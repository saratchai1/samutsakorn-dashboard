(() => {
  "use strict";

  const DATA = window.EXECUTIVE_WATER_DATA;
  if (!DATA) {
    throw new Error("EXECUTIVE_WATER_DATA must be loaded before the August 2026 update.");
  }

  const MONTH = "2026-08";
  const VR_FOOD_WASTEWATER_ASSUMPTION = 0.45;

  const SUMMARY = [
    {
      month: MONTH,
      factory: "APEX",
      water_in: 34592.0,
      wastewater: 2140.0,
      difference: 32452.0,
      ratio: 0.0619,
      status: "ปกติ",
      alarms: 85,
      points: ["P10", "P2", "P4", "P6"],
    },
    {
      month: MONTH,
      factory: "Longtex",
      water_in: 2821.0,
      wastewater: 1690.0,
      difference: 1131.0,
      ratio: 0.5991,
      status: "ปกติ",
      alarms: 0,
      points: ["P5", "P9"],
    },
    {
      month: MONTH,
      factory: "VR Food",
      water_in: 1267.0,
      wastewater: 570.15,
      difference: 696.85,
      ratio: 0.45,
      status: "ปกติ",
      alarms: 4,
      points: ["P8"],
      wastewater_estimated: true,
      wastewater_estimation_method: "45% of Water In",
      wastewater_estimation_rate: VR_FOOD_WASTEWATER_ASSUMPTION,
    },
    {
      month: MONTH,
      factory: "UBIS",
      water_in: 650.0,
      wastewater: 265.0,
      difference: 385.0,
      ratio: 0.4077,
      status: "ปกติ",
      alarms: 4,
      points: ["P13", "P7"],
    },
    {
      month: MONTH,
      factory: "Huatamaki",
      water_in: 7709.0,
      wastewater: 2498.0,
      difference: 5211.0,
      ratio: 0.324,
      status: "ปกติ",
      alarms: 64,
      points: ["P1", "P11", "P12", "P3"],
    },
  ];

  const MONTHLY_OVERVIEW = [
    {
      month: MONTH,
      total_water_in: 47039.0,
      total_wastewater: 7163.15,
      comparable_water_in: 47039.0,
      comparable_wastewater: 7163.15,
      difference: 39875.85,
      ratio: 0.1523,
      normal_months: 5,
      watch_count: 0,
      abnormal_count: 0,
      incomplete_count: 0,
      status: "ปกติ",
      contains_estimated_values: true,
    },
  ];

  const MONTHLY_TYPE = [
    {
      month: MONTH,
      factory: "APEX",
      water_type: "Wastewater",
      volume: 2140.0,
      records: 173,
      alarms: 85,
      points: ["P4", "P6"],
    },
    {
      month: MONTH,
      factory: "APEX",
      water_type: "Water In",
      volume: 34592.0,
      records: 67,
      alarms: 0,
      points: ["P10", "P2"],
    },
    {
      month: MONTH,
      factory: "Huatamaki",
      water_type: "Wastewater",
      volume: 2498.0,
      records: 83,
      alarms: 62,
      points: ["P1", "P11"],
    },
    {
      month: MONTH,
      factory: "Huatamaki",
      water_type: "Water In",
      volume: 7709.0,
      records: 130,
      alarms: 2,
      points: ["P12", "P3"],
    },
    {
      month: MONTH,
      factory: "Longtex",
      water_type: "Wastewater",
      volume: 1690.0,
      records: 27,
      alarms: 0,
      points: ["P5"],
    },
    {
      month: MONTH,
      factory: "Longtex",
      water_type: "Water In",
      volume: 2821.0,
      records: 33,
      alarms: 0,
      points: ["P9"],
    },
    {
      month: MONTH,
      factory: "UBIS",
      water_type: "Wastewater",
      volume: 265.0,
      records: 44,
      alarms: 1,
      points: ["P13"],
    },
    {
      month: MONTH,
      factory: "UBIS",
      water_type: "Water In",
      volume: 650.0,
      records: 44,
      alarms: 3,
      points: ["P7"],
    },
    {
      month: MONTH,
      factory: "VR Food",
      water_type: "Wastewater",
      volume: 570.15,
      records: 0,
      alarms: 0,
      points: [],
      estimated: true,
      estimation_method: "45% of Water In",
      estimation_rate: VR_FOOD_WASTEWATER_ASSUMPTION,
    },
    {
      month: MONTH,
      factory: "VR Food",
      water_type: "Water In",
      volume: 1267.0,
      records: 39,
      alarms: 4,
      points: ["P8"],
    },
  ];

  const POINT_DETAIL = [
    {
      month: MONTH,
      factory: "Huatamaki",
      water_type: "Wastewater",
      location: "Huatamaki น้ำเสีย หลังโรงงาน",
      point: "P1",
      volume: 1997.0,
      records: 43,
      alarms: 34,
    },
    {
      month: MONTH,
      factory: "APEX",
      water_type: "Water In",
      location: "P2",
      point: "P2",
      volume: 13988.0,
      records: 42,
      alarms: 0,
    },
    {
      month: MONTH,
      factory: "Huatamaki",
      water_type: "Water In",
      location: "P3",
      point: "P3",
      volume: 69.0,
      records: 87,
      alarms: 2,
    },
    {
      month: MONTH,
      factory: "APEX",
      water_type: "Wastewater",
      location: "APEX น้ำเสีย 1",
      point: "P4",
      volume: 568.0,
      records: 87,
      alarms: 84,
    },
    {
      month: MONTH,
      factory: "Longtex",
      water_type: "Wastewater",
      location: "Longtex น้ำเสีย",
      point: "P5",
      volume: 1690.0,
      records: 27,
      alarms: 0,
    },
    {
      month: MONTH,
      factory: "APEX",
      water_type: "Wastewater",
      location: "APEX น้ำเสีย 2",
      point: "P6",
      volume: 1572.0,
      records: 86,
      alarms: 1,
    },
    {
      month: MONTH,
      factory: "UBIS",
      water_type: "Water In",
      location: "UBIS น้ำดี",
      point: "P7",
      volume: 650.0,
      records: 44,
      alarms: 3,
    },
    {
      month: MONTH,
      factory: "VR Food",
      water_type: "Water In",
      location: "VR Food น้ำดี",
      point: "P8",
      volume: 1267.0,
      records: 39,
      alarms: 4,
    },
    {
      month: MONTH,
      factory: "VR Food",
      water_type: "Wastewater",
      location: "VR Food น้ำเสีย (ประมาณการ 45% ของน้ำดี)",
      point: "EST-45%",
      volume: 570.15,
      records: 0,
      alarms: 0,
      estimated: true,
      estimation_method: "45% of Water In",
      estimation_rate: VR_FOOD_WASTEWATER_ASSUMPTION,
    },
    {
      month: MONTH,
      factory: "Longtex",
      water_type: "Water In",
      location: "Longtex น้ำดี",
      point: "P9",
      volume: 2821.0,
      records: 33,
      alarms: 0,
    },
    {
      month: MONTH,
      factory: "APEX",
      water_type: "Water In",
      location: "P10",
      point: "P10",
      volume: 20604.0,
      records: 25,
      alarms: 0,
    },
    {
      month: MONTH,
      factory: "Huatamaki",
      water_type: "Wastewater",
      location: "Huatamaki น้ำเสีย หน้าโรงงาน",
      point: "P11",
      volume: 501.0,
      records: 40,
      alarms: 28,
    },
    {
      month: MONTH,
      factory: "Huatamaki",
      water_type: "Water In",
      location: "Huatamaki น้ำดี หน้าโรงงาน",
      point: "P12",
      volume: 7640.0,
      records: 43,
      alarms: 0,
    },
    {
      month: MONTH,
      factory: "UBIS",
      water_type: "Wastewater",
      location: "UBIS น้ำเสีย",
      point: "P13",
      volume: 265.0,
      records: 44,
      alarms: 1,
    },
  ];

  const UPDATE_METADATA = {
    month: MONTH,
    source_file: "SSK_water_meter_260827.xlsx",
    source_sheet: "data-1787823342279 (2)",
    source_rows: 640,
    source_date_min: "2026-08-06T00:10:05+07:00",
    source_date_max: "2026-08-27T14:38:01+07:00",
    is_partial_month: true,
    mapping_verified_against_historical_dashboard: true,
    contains_estimated_values: true,
    assumptions: [
      {
        factory: "VR Food",
        metric: "Wastewater",
        method: "45% of Water In",
        rate: VR_FOOD_WASTEWATER_ASSUMPTION,
        water_in: 1267.0,
        estimated_wastewater: 570.15,
      },
    ],
    notes: [
      "All 13 raw points match existing dashboard point mappings.",
      "No duplicate (device_id, seqno) or (point, time) records were found.",
      "VR Food raw source contains only Water In point P8. August 2026 wastewater is an explicit 45% of Water In assumption, not a measured meter value.",
    ],
  };

  const replaceMonth = (rows, updateRows) => [
    ...(Array.isArray(rows) ? rows : []).filter((row) => row?.month !== MONTH),
    ...updateRows,
  ];

  DATA.months = [...new Set([...(Array.isArray(DATA.months) ? DATA.months : []), MONTH])]
    .sort((a, b) => String(a).localeCompare(String(b)));
  DATA.date_max = UPDATE_METADATA.source_date_max;
  DATA.summary = replaceMonth(DATA.summary, SUMMARY);
  DATA.monthly_overview = replaceMonth(DATA.monthly_overview, MONTHLY_OVERVIEW);
  DATA.monthly_type = replaceMonth(DATA.monthly_type, MONTHLY_TYPE);
  DATA.point_detail = replaceMonth(DATA.point_detail, POINT_DETAIL);

  DATA.data_updates = [
    ...(Array.isArray(DATA.data_updates)
      ? DATA.data_updates.filter((item) => item?.month !== MONTH)
      : []),
    UPDATE_METADATA,
  ];
})();
