/* SSK water-meter update: source SSK_water_meter_261119.xlsx (1,856 records; 13 meters)
 * Maintains historical dashboard method: monthly volume = SUM(decode_usage).
 * Source contains 2026-09-15 to 2026-11-19; Sep and Nov are partial.
 * VR Food wastewater is an explicitly labelled 45% estimate; not observed.
 * Monthly alarms count readings with any decode_al_* flag, not unique incidents.
 * Device-to-factory mappings P2, P3 and P10 follow the previously verified dashboard.
 */
(() => {
  "use strict";
  const DATA = window.EXECUTIVE_WATER_DATA;
  if (!DATA) throw new Error("Base executive water data must load first.");

  const SOURCE = {
  "2026-09": {
    "P1": [
      1792,
      32,
      20
    ],
    "P2": [
      8960,
      25,
      0
    ],
    "P3": [
      44,
      64,
      0
    ],
    "P4": [
      377,
      63,
      58
    ],
    "P5": [
      1966,
      9,
      0
    ],
    "P6": [
      1645,
      64,
      17
    ],
    "P7": [
      440,
      32,
      1
    ],
    "P8": [
      751,
      26,
      2
    ],
    "P9": [
      2102,
      30,
      0
    ],
    "P10": [
      14323,
      9,
      0
    ],
    "P11": [
      450,
      30,
      18
    ],
    "P12": [
      5703,
      32,
      0
    ],
    "P13": [
      519,
      32,
      1
    ]
  },
  "2026-10": {
    "P1": [
      2884,
      59,
      43
    ],
    "P2": [
      19994,
      58,
      0
    ],
    "P3": [
      87,
      120,
      3
    ],
    "P4": [
      736,
      120,
      96
    ],
    "P5": [
      2910,
      25,
      0
    ],
    "P6": [
      2890,
      119,
      40
    ],
    "P7": [
      781,
      60,
      0
    ],
    "P8": [
      2003,
      44,
      0
    ],
    "P9": [
      4812,
      57,
      0
    ],
    "P10": [
      29107,
      31,
      0
    ],
    "P11": [
      898,
      60,
      40
    ],
    "P12": [
      10942,
      60,
      0
    ],
    "P13": [
      641,
      58,
      1
    ]
  },
  "2026-11": {
    "P1": [
      1567,
      38,
      31
    ],
    "P2": [
      12248,
      38,
      0
    ],
    "P3": [
      53,
      75,
      2
    ],
    "P4": [
      404,
      71,
      34
    ],
    "P5": [
      1558,
      13,
      0
    ],
    "P6": [
      1627,
      75,
      29
    ],
    "P7": [
      468,
      38,
      0
    ],
    "P8": [
      1720,
      24,
      0
    ],
    "P9": [
      3459,
      38,
      0
    ],
    "P10": [
      17625,
      14,
      0
    ],
    "P11": [
      498,
      38,
      31
    ],
    "P12": [
      6740,
      38,
      0
    ],
    "P13": [
      258,
      37,
      3
    ]
  }
};
  const POINT_META = {
  "P1": [
    "Huatamaki",
    "Wastewater",
    "Huatamaki น้ำเสีย หลังโรงงาน",
    "450545"
  ],
  "P2": [
    "APEX",
    "Water In",
    "P2",
    "48D9F7"
  ],
  "P3": [
    "Huatamaki",
    "Water In",
    "P3",
    "48D960"
  ],
  "P4": [
    "APEX",
    "Wastewater",
    "APEX น้ำเสีย 1",
    "451923"
  ],
  "P5": [
    "Longtex",
    "Wastewater",
    "Longtex น้ำเสีย",
    "48CADE"
  ],
  "P6": [
    "APEX",
    "Wastewater",
    "APEX น้ำเสีย 2",
    "451A58"
  ],
  "P7": [
    "UBIS",
    "Water In",
    "UBIS น้ำดี",
    "48D762"
  ],
  "P8": [
    "VR Food",
    "Water In",
    "VR Food น้ำดี",
    "48D974"
  ],
  "P9": [
    "Longtex",
    "Water In",
    "Longtex น้ำดี",
    "48D564"
  ],
  "P10": [
    "APEX",
    "Water In",
    "P10",
    "48D5CF"
  ],
  "P11": [
    "Huatamaki",
    "Wastewater",
    "Huatamaki น้ำเสีย หน้าโรงงาน",
    "48CCC2"
  ],
  "P12": [
    "Huatamaki",
    "Water In",
    "Huatamaki น้ำดี หน้าโรงงาน",
    "48CCAE"
  ],
  "P13": [
    "UBIS",
    "Wastewater",
    "UBIS น้ำเสีย",
    "48CCFA"
  ]
};
  const SOURCE_AUDIT = {
  "2026-09": {
    "source_rows": 448,
    "source_date_min": "2026-09-15T00:52:41+07:00",
    "source_date_max": "2026-09-30T22:40:25+07:00",
    "observed_days": 16,
    "is_partial_month": true,
    "alarm_records": 117,
    "meter_gap_points": [
      "P5",
      "P10"
    ],
    "notes": [
      "เริ่มมีข้อมูลวันที่ 15 ก.ย. จึงไม่ใช่ปริมาณน้ำตลอดเดือน",
      "P5 และ P10 มีจำนวนวันตรวจวัดน้อยกว่าจุดอื่น"
    ]
  },
  "2026-10": {
    "source_rows": 871,
    "source_date_min": "2026-10-01T01:23:38+07:00",
    "source_date_max": "2026-10-31T22:34:43+07:00",
    "observed_days": 31,
    "is_partial_month": false,
    "alarm_records": 223,
    "meter_gap_points": [
      "P5",
      "P8",
      "P10"
    ],
    "notes": [
      "ครอบคลุมวันต้นเดือนถึงปลายเดือน แต่บางจุดมีช่องว่างระหว่างการส่งข้อมูล",
      "P5 ปรากฏข้อมูล 17 วัน และ P10 ปรากฏข้อมูล 26 วัน"
    ]
  },
  "2026-11": {
    "source_rows": 537,
    "source_date_min": "2026-11-01T00:36:28+07:00",
    "source_date_max": "2026-11-19T18:51:31+07:00",
    "observed_days": 19,
    "is_partial_month": true,
    "alarm_records": 130,
    "meter_gap_points": [
      "P5",
      "P8",
      "P10"
    ],
    "notes": [
      "ข้อมูลถึงวันที่ 19 พ.ย. ไม่ใช่ปริมาณน้ำตลอดเดือน",
      "P5 และ P10 มีช่วงวันที่ไม่ส่งข้อมูลครบ"
    ]
  }
};
  const UPDATED_MONTHS = Object.keys(SOURCE).sort();
  const MONTH_SET = new Set(UPDATED_MONTHS);
  const FACTORIES = ["APEX", "Longtex", "VR Food", "UBIS", "Huatamaki"];
  const ESTIMATE_RATE = 0.45;
  const round = (n, digits = 2) => Number(n.toFixed(digits));
  const sum = (rows, key) => rows.reduce((total, row) => total + (Number(row[key]) || 0), 0);
  const replace = (oldRows, newRows) => [
    ...(Array.isArray(oldRows) ? oldRows : []).filter((row) => !MONTH_SET.has(row.month)),
    ...newRows,
  ];

  const pointDetails = [];
  const summaries = [];
  const monthlyTypes = [];
  const overviews = [];
  const dataUpdates = [];

  for (const month of UPDATED_MONTHS) {
    const pointEntries = Object.entries(SOURCE[month]);
    const audit = SOURCE_AUDIT[month];
    if (pointEntries.length !== 13) throw new Error(month + ": expected 13 meters");
    const details = pointEntries.map(([point, [volume, records, alarms]]) => {
      const [factory, water_type, location, device_id] = POINT_META[point];
      return {
        month, factory, water_type, location, point, device_id,
        volume, records, alarms, estimated: false, source: "meter",
      };
    });
    const vrFoodWaterIn = details.find((row) => row.point === "P8").volume;
    details.push({
      month, factory: "VR Food", water_type: "Wastewater",
      location: "VR Food น้ำทิ้ง (ประมาณการ 45% ของน้ำดี)", point: "EST-45%",
      device_id: null, volume: round(vrFoodWaterIn * ESTIMATE_RATE),
      records: 0, alarms: 0, estimated: true, source: "assumption",
      estimation_method: "45% of Water In", estimation_rate: ESTIMATE_RATE,
    });
    pointDetails.push(...details);

    const periodSummaries = [];
    for (const factory of FACTORIES) {
      const factoryRows = details.filter((row) => row.factory === factory);
      const inRows = factoryRows.filter((row) => row.water_type === "Water In");
      const outRows = factoryRows.filter((row) => row.water_type === "Wastewater");
      const water_in = round(sum(inRows, "volume"));
      const wastewater = round(sum(outRows, "volume"));
      const ratio = water_in > 0 ? round(wastewater / water_in, 4) : null;
      const status = !inRows.length || !outRows.length ? "ข้อมูลไม่ครบ" :
        ratio > 1 ? "ผิดปกติ" : ratio >= 0.9 ? "ตรวจสอบ" : "ปกติ";
      periodSummaries.push({
        month, factory, water_in, wastewater, difference: round(water_in - wastewater),
        ratio, status, alarms: sum(factoryRows, "alarms"),
        points: factoryRows.filter((row) => !row.estimated).map((row) => row.point),
        wastewater_estimated: factory === "VR Food",
        is_partial_month: audit.is_partial_month,
        source_file: "SSK_water_meter_261119.xlsx",
      });

      for (const water_type of ["Water In", "Wastewater"]) {
        const scoped = factoryRows.filter((row) => row.water_type === water_type);
        if (!scoped.length) continue;
        const estimated = scoped.every((row) => row.estimated);
        monthlyTypes.push({
          month, factory, water_type, volume: round(sum(scoped, "volume")),
          records: sum(scoped, "records"), alarms: sum(scoped, "alarms"),
          points: scoped.filter((row) => !row.estimated).map((row) => row.point),
          ...(estimated ? {
            estimated: true, estimation_method: "45% of Water In",
            estimation_rate: ESTIMATE_RATE,
          } : {}),
        });
      }
    }
    summaries.push(...periodSummaries);
    const complete = periodSummaries.filter((row) => row.status !== "ข้อมูลไม่ครบ");
    const total_water_in = round(sum(periodSummaries, "water_in"));
    const total_wastewater = round(sum(periodSummaries, "wastewater"));
    const comparable_water_in = round(sum(complete, "water_in"));
    const comparable_wastewater = round(sum(complete, "wastewater"));
    const abnormal_count = complete.filter((r) => r.status === "ผิดปกติ").length;
    const watch_count = complete.filter((r) => r.status === "ตรวจสอบ").length;
    const incomplete_count = periodSummaries.length - complete.length;
    overviews.push({
      month, total_water_in, total_wastewater,
      comparable_water_in, comparable_wastewater,
      difference: round(comparable_water_in - comparable_wastewater),
      ratio: comparable_water_in ? round(comparable_wastewater / comparable_water_in, 4) : null,
      normal_months: complete.filter((r) => r.status === "ปกติ").length,
      watch_count, abnormal_count, incomplete_count,
      status: abnormal_count ? "ผิดปกติ" : watch_count ? "ตรวจสอบ" :
        incomplete_count ? "ข้อมูลไม่ครบ" : "ปกติ",
      contains_estimated_values: true, is_partial_month: audit.is_partial_month,
    });

    const readingCount = sum(details, "records");
    const alarmCount = sum(details, "alarms");
    if (readingCount !== audit.source_rows || alarmCount !== audit.alarm_records) {
      throw new Error(month + ": failed source-row/alarm reconciliation");
    }
    dataUpdates.push({
      month, source_file: "SSK_water_meter_261119.xlsx",
      source_sheet: "data-1789534994744", source_rows: readingCount,
      source_date_min: audit.source_date_min, source_date_max: audit.source_date_max,
      observed_days: audit.observed_days, is_partial_month: audit.is_partial_month,
      meter_gap_points: audit.meter_gap_points, alarm_records: audit.alarm_records,
      unique_points: pointEntries.length, duplicate_device_seqno: 0,
      duplicate_point_time: 0,
      volume_method: "SUM(decode_usage) by local month, meter and factory",
      alarm_method: "Number of readings with >=1 decode_al_* flag",
      mapping_method: "Historical verified point mapping; P2/APEX, P3/Huatamaki, P10/APEX",
      contains_estimated_values: true,
      assumptions: [{
        factory: "VR Food", metric: "Wastewater",
        method: "45% of Water In", rate: ESTIMATE_RATE,
        water_in: vrFoodWaterIn, estimated_wastewater: round(vrFoodWaterIn * ESTIMATE_RATE),
      }],
      notes: audit.notes,
    });
  }

  DATA.months = [...new Set([...(DATA.months || []), ...UPDATED_MONTHS])].sort();
  DATA.summary = replace(DATA.summary, summaries);
  DATA.monthly_overview = replace(DATA.monthly_overview, overviews);
  DATA.monthly_type = replace(DATA.monthly_type, monthlyTypes);
  DATA.point_detail = replace(DATA.point_detail, pointDetails);
  DATA.data_updates = replace(DATA.data_updates, dataUpdates).sort((a, b) => a.month.localeCompare(b.month));
  DATA.date_max = "2026-11-19T18:51:31+07:00";
})();
