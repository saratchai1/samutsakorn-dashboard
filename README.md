# SSK Water Balance Executive Dashboard

Static dashboard for water-in and wastewater meters at the Samut Sakhon Industrial Estate (13 points, 5 factories). Open `index.html` in a web browser or serve the folder as static files.

## Data updates

- Historical baseline: `data/executive_water_data.js` and its source JSON (through June 2026).
- July/August: `data/executive_water_update_2026_08.js` (August from the August workbook; **July is an explicit copy of August, not July measurements**).
- **September–November 2026:** `data/executive_water_update_2026_11.js`, aggregated from `SSK_water_meter_261119.xlsx`, 1,856 records from 13 meters.

| Month | Source period (Thailand time) | Raw records | Water In (m³) | Wastewater incl. estimated VR Food (m³) | Alarm-marked records |
|---|---|---:|---:|---:|---:|
| 2026-09 | 15–30 Sep (partial) | 448 | 32,323 | 7,086.95 | 117 |
| 2026-10 | 1–31 Oct (some meter gaps) | 871 | 67,726 | 11,860.35 | 223 |
| 2026-11 | 1–19 Nov (partial) | 537 | 42,313 | 6,686.00 | 130 |

## Reporting rules

1. Meter volume per month: `SUM(decode_usage)`, using **local Thai time** month, not lifetime `decode_totalizer`.
2. Map P2/P10 to APEX Water In and P3 to Huatamaki Water In, consistent with the earlier verified mapping. All 13 device IDs are mapped.
3. **VR Food has no monitored wastewater meter in the source**; estimated wastewater = 45% of its measured Water In. Estimate rows contain zero observed records and display a provenance flag. Do not treat them as measured or certified quantities.
4. Water In / Wastewater imbalance is an operational review flag, not proof of an environmental or permit violation. For **UBIS September 2026**, 519 m³ out vs 440 m³ in, ratio ~118%, is flagged abnormal.
5. September and November are partial months. October spans the calendar month but has gaps in individual meter observations (especially P5 and P10); monthly totals may be under-reported if data was missing.
6. Alarm counts count **records with at least one decoder alarm bit**, not unique incident events. September: 117; October: 223; November: 130. There are no duplicate (device_id, seqno) or (point, time) pairs in the imported workbook.
7. The dashboard is a **static snapshot, not a real-time water-meter feed**; latest reading is 19 Nov 2026 at 18:51:31 UTC+07:00. Original September–November raw workbook is not committed.

## Testing

Requires Node.js 18+. Run `node --test tests/sskwater-2026-11.test.cjs`.

The tests reconcile monthly source totals, alarm counts, VR Food estimation, September UBIS alert, and preservation of the July/August provenance.
