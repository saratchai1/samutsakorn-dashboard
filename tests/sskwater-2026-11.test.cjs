"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const sandbox = { window: {} };
for (const name of [
  "data/executive_water_data.js",
  "data/executive_water_update_2026_08.js",
  "data/executive_water_update_2026_11.js",
]) {
  vm.runInNewContext(fs.readFileSync(path.join(root, name), "utf8"), sandbox, { filename: name });
}
const data = sandbox.window.EXECUTIVE_WATER_DATA;
const expected = {
  "2026-09": { waterIn: 32323, wastewater: 7086.95, records: 448, alarms: 117, partial: true },
  "2026-10": { waterIn: 67726, wastewater: 11860.35, records: 871, alarms: 223, partial: false },
  "2026-11": { waterIn: 42313, wastewater: 6686, records: 537, alarms: 130, partial: true },
};
const total = (rows, key) => rows.reduce((sum, row) => sum + Number(row[key] || 0), 0);
const closeTo = (actual, expectedValue) => assert.ok(Math.abs(actual - expectedValue) < 0.005,
  "Expected " + actual + " ≈ " + expectedValue);

test("three months imported with five factories and no duplicated summary rows", () => {
  for (const month of Object.keys(expected)) {
    assert.ok(data.months.includes(month));
    const rows = data.summary.filter((r) => r.month === month);
    assert.equal(rows.length, 5);
    assert.equal(new Set(rows.map((r) => r.factory)).size, 5);
  }
});
test("new monthly volumes reconcile to source workbook with 45% VR Food estimate", () => {
  for (const [month, exp] of Object.entries(expected)) {
    const rows = data.summary.filter((r) => r.month === month);
    closeTo(total(rows, "water_in"), exp.waterIn);
    closeTo(total(rows, "wastewater"), exp.wastewater);
    const pointRows = data.point_detail.filter((r) => r.month === month);
    assert.equal(pointRows.filter((r) => !r.estimated).length, 13);
    assert.equal(pointRows.filter((r) => r.estimated).length, 1);
    const vrIn = pointRows.find((r) => r.point === "P8");
    const vrOut = pointRows.find((r) => r.point === "EST-45%");
    assert.equal(vrIn.water_type, "Water In");
    assert.equal(vrOut.water_type, "Wastewater");
    closeTo(vrOut.volume, vrIn.volume * 0.45);
    assert.equal(vrOut.records, 0);
    assert.equal(total(pointRows, "records"), exp.records);
    assert.equal(total(pointRows, "alarms"), exp.alarms);
    const metadata = data.data_updates.find((r) => r.month === month);
    assert.equal(metadata.source_rows, exp.records);
    assert.equal(metadata.alarm_records, exp.alarms);
    assert.equal(metadata.is_partial_month, exp.partial);
    assert.equal(metadata.source_file, "SSK_water_meter_261119.xlsx");
    assert.equal(metadata.unique_points, 13);
  }
});
test("September UBIS imbalance is flagged as abnormal", () => {
  const row = data.summary.find((r) => r.month === "2026-09" && r.factory === "UBIS");
  assert.equal(row.water_in, 440);
  assert.equal(row.wastewater, 519);
  assert.equal(row.status, "ผิดปกติ");
  assert.ok(row.ratio > 1);
});
test("previous July copy and August 45% estimate are preserved", () => {
  const july = data.data_updates.find((r) => r.month === "2026-07");
  const august = data.data_updates.find((r) => r.month === "2026-08");
  assert.equal(july.imputed, true);
  assert.equal(july.copied_from_month, "2026-08");
  assert.equal(august.contains_estimated_values, true);
  assert.ok(data.summary.some((r) => r.month === "2026-08"));
});
test("latest data timestamp is snapshot, not live feed", () => {
  assert.equal(data.date_max, "2026-11-19T18:51:31+07:00");
  assert.equal(data.months[data.months.length - 1], "2026-11");
});
