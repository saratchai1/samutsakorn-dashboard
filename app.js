const DATA = window.EXECUTIVE_WATER_DATA;
const fmt = new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 });
const fmt1 = new Intl.NumberFormat("th-TH", { maximumFractionDigits: 1 });
const pct = new Intl.NumberFormat("th-TH", { style: "percent", maximumFractionDigits: 1 });

const WATER_IN = "#2563EB";
const WASTEWATER = "#94A3B8";
const OK = "#15803D";
const WATCH = "#F59E0B";
const ALERT = "#DC2626";
const SERIES = ["#2563EB", "#0F766E", "#EA580C", "#7C3AED", "#0891B2"];

const state = {
  view: "overview",
  month: "ALL",
  factory: "ALL",
  type: "ALL",
  point: "ALL",
  status: "ALL",
};

const $ = (selector) => document.querySelector(selector);
const els = {
  month: $("#monthSelect"),
  factory: $("#factorySelect"),
  type: $("#typeSelect"),
  verdictPanel: $("#verdictPanel"),
  verdictTitle: $("#verdictTitle"),
  verdictCopy: $("#verdictCopy"),
  gaugeFill: $("#gaugeFill"),
  gaugeText: $("#gaugeText"),
  kpiIn: $("#kpiIn"),
  kpiOut: $("#kpiOut"),
  kpiDiff: $("#kpiDiff"),
  kpiRatio: $("#kpiRatio"),
  kpiNormal: $("#kpiNormal"),
  kpiAbnormal: $("#kpiAbnormal"),
  kpiTopIn: $("#kpiTopIn"),
  kpiTopOut: $("#kpiTopOut"),
  waterBalance: $("#waterBalanceChart"),
  ratioGauge: $("#ratioGauge"),
  factoryCompare: $("#factoryCompareChart"),
  summaryTable: $("#summaryTable"),
  factoryTitle: $("#factoryTitle"),
  factoryBadge: $("#factoryBadge"),
  balanceStack: $("#balanceStack"),
  factoryTrend: $("#factoryTrendChart"),
  pointTable: $("#pointTable"),
  unknownTable: $("#unknownTable"),
};

init();

function init() {
  hydrateFilters();
  bindEvents();
  render();
}

function hydrateFilters() {
  fillSelect(els.month, [["ALL", "ทุกเดือน"], ...DATA.months.map((m) => [m, m])]);
  fillSelect(els.factory, [["ALL", "ทุกโรงงาน"], ...DATA.factories.map((f) => [f, f])]);
  fillSelect(els.type, [["ALL", "ทุกประเภท"], ["Water In", "น้ำดี"], ["Wastewater", "น้ำทิ้ง"]]);
}

function fillSelect(select, options) {
  select.innerHTML = options.map(([value, label]) => `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`).join("");
}

function bindEvents() {
  [
    [els.month, "month"],
    [els.factory, "factory"],
    [els.type, "type"],
  ].forEach(([select, key]) => select.addEventListener("change", () => {
    state[key] = select.value;
    render();
  }));

  document.querySelectorAll(".rail-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view;
      document.querySelectorAll(".rail-button").forEach((item) => item.classList.toggle("active", item === button));
      document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === `${state.view}View`));
      render();
    });
  });
  window.addEventListener("resize", debounce(render, 120));
}

window.dashboardState = state;
window.renderDashboard = render;

function render() {
  const rows = filteredSummary();
  renderSummary(rows);
  renderKpis(rows);
  renderCharts(rows);
  renderTable(rows);
  renderFactory();
  renderQuality();
}

function filteredSummary() {
  return DATA.summary.filter((row) => {
    if (state.month !== "ALL" && row.month !== state.month) return false;
    if (state.factory !== "ALL" && row.factory !== state.factory) return false;
    if (state.status !== "ALL" && row.status !== state.status) return false;
    if (state.type === "Water In" && row.water_in <= 0) return false;
    if (state.type === "Wastewater" && row.wastewater <= 0) return false;
    if (state.point !== "ALL" && !row.points.includes(state.point)) return false;
    return true;
  });
}

function filteredPointRows() {
  return DATA.point_detail.filter((row) => {
    if (state.month !== "ALL" && row.month !== state.month) return false;
    if (state.factory !== "ALL" && row.factory !== state.factory) return false;
    if (state.type !== "ALL" && row.water_type !== state.type) return false;
    if (state.point !== "ALL" && String(row.point) !== state.point) return false;
    return true;
  });
}

function completeRows(rows) {
  return rows.filter((row) => row.status !== "ข้อมูลไม่ครบ");
}

function renderSummary(rows) {
  const complete = completeRows(rows);
  const abnormal = complete.filter((row) => row.status === "ผิดปกติ").length;
  const watch = complete.filter((row) => row.status === "ตรวจสอบ").length;
  const incomplete = rows.filter((row) => row.status === "ข้อมูลไม่ครบ").length;
  const inSum = sum(complete, "water_in");
  const outSum = sum(complete, "wastewater");
  const ratio = inSum ? outSum / inSum : null;

  els.verdictPanel.className = `verdict-panel ${abnormal ? "alert" : watch || incomplete ? "watch" : "ok"}`;
  if (abnormal) {
    els.verdictTitle.textContent = `พบ ${abnormal} รายการที่น้ำทิ้งมากกว่าน้ำดี`;
    els.verdictCopy.textContent = "รายการดังกล่าวเป็นผลจากข้อมูลมิเตอร์ในชุดข้อมูลนี้ ควรตรวจสอบความครบถ้วนและสถานะมิเตอร์ก่อนนำไปใช้ประกอบการตัดสินใจ";
  } else {
    els.verdictTitle.textContent = "สรุปข้อมูลน้ำดีและน้ำทิ้งจากมิเตอร์";
    els.verdictCopy.textContent = "Dashboard นี้แสดงผลรวมรายเดือนจากข้อมูลมิเตอร์ แยกตามโรงงาน ประเภทน้ำ จุดมิเตอร์ และสถานะข้อมูล";
  }
  if (incomplete) {
    els.verdictCopy.textContent += ` มี ${incomplete} รายการที่มีข้อมูลเพียงฝั่งเดียวและถูกจัดเป็นข้อมูลไม่ครบ`;
  }

  setTopGauge(ratio);
  renderGauge(els.ratioGauge, ratio, "Wastewater / Water In");
}

function renderKpis(rows) {
  const complete = completeRows(rows);
  const showIn = state.type === "ALL" || state.type === "Water In";
  const showOut = state.type === "ALL" || state.type === "Wastewater";
  const showComparison = state.type === "ALL";

  const totalIn = showIn ? sum(rows, "water_in") : null;
  const totalOut = showOut ? sum(rows, "wastewater") : null;
  const comparableIn = sum(complete, "water_in");
  const comparableOut = sum(complete, "wastewater");
  const diff = showComparison ? comparableIn - comparableOut : null;
  const ratio = (showComparison && comparableIn) ? comparableOut / comparableIn : null;
  const normal = showComparison ? complete.filter((row) => row.status === "ปกติ").length : null;
  const abnormal = showComparison ? complete.filter((row) => row.status === "ผิดปกติ").length : null;
  const topIn = showIn ? maxRow(rows, "water_in") : null;
  const topOut = showOut ? maxRow(rows, "wastewater") : null;

  els.kpiIn.textContent = totalIn == null ? "-" : fmt.format(totalIn);
  els.kpiOut.textContent = totalOut == null ? "-" : fmt.format(totalOut);
  els.kpiDiff.textContent = diff == null ? "-" : fmt.format(diff);
  els.kpiRatio.textContent = ratio == null ? "-" : pct.format(ratio);
  els.kpiNormal.textContent = normal == null ? "-" : fmt.format(normal);
  els.kpiAbnormal.textContent = abnormal == null ? "-" : fmt.format(abnormal);
  els.kpiTopIn.textContent = topIn?.factory ?? "-";
  els.kpiTopOut.textContent = topOut?.factory ?? "-";
}

function renderCharts(rows) {
  const showIn = state.type === "ALL" || state.type === "Water In";
  const showOut = state.type === "ALL" || state.type === "Wastewater";

  const monthly = monthlyFromRows(rows);
  
  const balanceSeries = [];
  if (showIn) {
    balanceSeries.push({ name: "น้ำดี", color: WATER_IN, values: monthly.map((r) => r.water_in) });
  }
  if (showOut) {
    balanceSeries.push({ name: "น้ำทิ้ง", color: WASTEWATER, values: monthly.map((r) => r.wastewater), statuses: monthly.map((r) => r.status) });
  }
  renderGroupedBars(els.waterBalance, monthly.map((r) => r.month), balanceSeries, { alertByStatus: true });

  const factoryRows = DATA.factories.map((factory) => {
    const scoped = rows.filter((r) => r.factory === factory);
    return {
      factory,
      water_in: sum(scoped, "water_in"),
      wastewater: sum(scoped, "wastewater"),
      difference: sum(completeRows(scoped), "water_in") - sum(completeRows(scoped), "wastewater"),
    };
  });

  const factoryCompareSeries = [];
  if (showIn) {
    factoryCompareSeries.push({ name: "น้ำดี", color: WATER_IN, values: factoryRows.map((r) => r.water_in) });
  }
  if (showOut) {
    factoryCompareSeries.push({ name: "น้ำทิ้ง", color: WASTEWATER, values: factoryRows.map((r) => r.wastewater) });
  }
  renderGroupedBars(els.factoryCompare, factoryRows.map((r) => r.factory), factoryCompareSeries);
}

function monthlyFromRows(rows) {
  const byMonth = new Map();
  rows.forEach((row) => {
    if (!byMonth.has(row.month)) {
      byMonth.set(row.month, {
        month: row.month,
        water_in: 0,
        wastewater: 0,
        complete_water_in: 0,
        complete_wastewater: 0,
        difference: 0,
        status: "ปกติ",
      });
    }
    const item = byMonth.get(row.month);
    item.water_in += Number(row.water_in) || 0;
    item.wastewater += Number(row.wastewater) || 0;
    if (row.status !== "ข้อมูลไม่ครบ") {
      item.complete_water_in += Number(row.water_in) || 0;
      item.complete_wastewater += Number(row.wastewater) || 0;
    }
    if (row.status === "ผิดปกติ") item.status = "ผิดปกติ";
    else if (row.status === "ตรวจสอบ" && item.status !== "ผิดปกติ") item.status = "ตรวจสอบ";
    else if (row.status === "ข้อมูลไม่ครบ" && item.status === "ปกติ") item.status = "ข้อมูลไม่ครบ";
  });

  return [...byMonth.values()]
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((item) => ({
      ...item,
      difference: item.complete_water_in - item.complete_wastewater,
    }));
}

function renderTable(rows) {
  const sorted = [...rows].sort((a, b) => `${b.month}${a.factory}`.localeCompare(`${a.month}${b.factory}`));
  
  const showIn = state.type === "ALL" || state.type === "Water In";
  const showOut = state.type === "ALL" || state.type === "Wastewater";
  const showComparison = state.type === "ALL";

  const table = els.summaryTable.closest("table");
  if (table) {
    const thead = table.querySelector("thead");
    if (thead) {
      thead.innerHTML = `
        <tr>
          <th>เดือน/ปี</th>
          <th>โรงงาน</th>
          ${showIn ? "<th>น้ำดีรวม</th>" : ""}
          ${showOut ? "<th>น้ำทิ้งรวม</th>" : ""}
          ${showComparison ? "<th>ส่วนต่าง</th>" : ""}
          ${showComparison ? "<th>น้ำทิ้ง/น้ำดี</th>" : ""}
        </tr>
      `;
    }
  }

  els.summaryTable.innerHTML = sorted.map((row) => `
    <tr>
      <td>${row.month}</td>
      <td>${row.factory}</td>
      ${showIn ? `<td>${fmt.format(row.water_in)}</td>` : ""}
      ${showOut ? `<td>${fmt.format(row.wastewater)}</td>` : ""}
      ${showComparison ? `<td>${fmt.format(row.difference)}</td>` : ""}
      ${showComparison ? `<td>${row.ratio == null ? "-" : pct.format(row.ratio)}</td>` : ""}
    </tr>
  `).join("");
}

function renderFactory() {
  const factory = state.factory === "ALL" ? DATA.factories[0] : state.factory;
  const rows = DATA.summary.filter((r) => r.factory === factory && (state.month === "ALL" || r.month === state.month));
  const selected = rows[rows.length - 1];
  const max = Math.max(...rows.flatMap((r) => [r.water_in, r.wastewater, Math.max(r.difference, 0)]), 1);
  els.factoryTitle.textContent = factory;
  els.factoryBadge.textContent = selected ? `${selected.month} · ${selected.status}` : "ไม่มีข้อมูล";

  const showIn = state.type === "ALL" || state.type === "Water In";
  const showOut = state.type === "ALL" || state.type === "Wastewater";
  const showComparison = state.type === "ALL";

  let stackHtml = "";
  if (selected) {
    const rowsHtml = [];
    if (showIn) rowsHtml.push(balanceRow("น้ำดี", selected.water_in, max, "in"));
    if (showOut) rowsHtml.push(balanceRow("น้ำทิ้ง", selected.wastewater, max, "out"));
    if (showComparison) rowsHtml.push(balanceRow("ส่วนต่าง", Math.max(selected.difference, 0), max, "balance"));
    stackHtml = rowsHtml.join("");
  }
  els.balanceStack.innerHTML = stackHtml;

  const allFactoryRows = DATA.summary.filter((r) => r.factory === factory);
  const trendSeries = [];
  if (showIn) {
    trendSeries.push({ name: "น้ำดี", color: WATER_IN, values: allFactoryRows.map((r) => r.water_in || null) });
  }
  if (showOut) {
    trendSeries.push({ name: "น้ำทิ้ง", color: WASTEWATER, values: allFactoryRows.map((r) => r.wastewater || null) });
  }
  renderLineChart(els.factoryTrend, allFactoryRows.map((r) => r.month), trendSeries);

  els.pointTable.innerHTML = filteredPointRows().slice(0, 300).map((row) => `
    <tr>
      <td>${row.month}</td><td>${row.factory}</td><td>${labelType(row.water_type)}</td><td>${escapeHtml(row.location)}</td>
      <td>${row.point}</td><td>${fmt.format(row.volume)}</td><td>${fmt.format(row.records)}</td><td>${fmt.format(row.alarms)}</td>
    </tr>
  `).join("");
}

function renderQuality() {
  els.unknownTable.innerHTML = DATA.unknown.map((row) => `
    <tr>
      <td>${escapeHtml(row.location)}</td><td>${row.point}</td><td>${labelType(row.water_type)}</td>
      <td>${fmt.format(row.volume)}</td><td>${fmt.format(row.records)}</td><td>${fmt.format(row.alarms)}</td>
    </tr>
  `).join("");
}

function setTopGauge(ratio) {
  const dash = 251;
  const value = ratio == null ? 0 : Math.min(ratio, 1.15);
  els.gaugeFill.style.strokeDashoffset = `${dash - Math.min(value, 1) * dash}`;
  els.gaugeFill.style.stroke = ratio == null ? "#94A3B8" : ratio > 1 ? ALERT : ratio >= 0.9 ? WATCH : OK;
  els.gaugeText.textContent = ratio == null ? "-" : pct.format(ratio);
}

function renderGauge(node, ratio, caption) {
  const value = ratio == null ? 0 : Math.min(ratio, 1.15);
  const status = ratio == null ? "ข้อมูลไม่ครบ" : ratio > 1 ? "ผิดปกติ" : ratio >= 0.9 ? "ตรวจสอบ" : "ปกติ";
  node.innerHTML = `
    <div class="gauge-big ${statusClass(status)}">
      <div class="gauge-ring" style="--ratio:${Math.min(value, 1)}"></div>
      <strong>${ratio == null ? "-" : pct.format(ratio)}</strong>
      <span>${caption}</span>
      <em>${status}</em>
    </div>`;
}

function renderGroupedBars(node, labels, series, options = {}) {
  const width = Math.max(node.clientWidth, 520);
  const height = Math.max(node.clientHeight, 300);
  const margin = { top: 18, right: 18, bottom: 60, left: 58 };
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;
  const max = niceMax(Math.max(...series.flatMap((s) => s.values), 1));
  const y = (v) => margin.top + plotH - (v / max) * plotH;
  const groupW = plotW / labels.length;
  const barW = Math.min(20, Math.max(5, (groupW - 10) / series.length));
  node.innerHTML = `<svg viewBox="0 0 ${width} ${height}">
    ${grid(max, y, margin, width)}
    ${labels.map((label, i) => {
      const cx = margin.left + i * groupW + groupW / 2;
      const bars = series.map((s, j) => {
        const v = s.values[i] || 0;
        const color = options.alertByStatus && s.statuses?.[i] === "ผิดปกติ" ? ALERT : s.color;
        const x = cx - (series.length * barW) / 2 + j * barW;
        return `<rect x="${x}" y="${y(v)}" width="${barW - 3}" height="${plotH - (y(v) - margin.top)}" rx="3" fill="${color}"></rect>`;
      }).join("");
      return `${bars}<text class="tick-label" x="${cx}" y="${height - 34}" text-anchor="middle">${label}</text>`;
    }).join("")}
    ${legend(series, margin.left, height - 12)}
  </svg>`;
}

function renderSingleBars(node, labels, values, colors) {
  const width = Math.max(node.clientWidth, 520);
  const height = Math.max(node.clientHeight, 300);
  const margin = { top: 18, right: 18, bottom: 48, left: 58 };
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;
  const maxAbs = niceMax(Math.max(...values.map((v) => Math.abs(v)), 1));
  const y0 = margin.top + plotH / 2;
  const y = (v) => y0 - (v / maxAbs) * (plotH / 2);
  const barW = Math.max(8, Math.min(24, plotW / values.length - 6));
  node.innerHTML = `<svg viewBox="0 0 ${width} ${height}">
    <line class="grid-line" x1="${margin.left}" x2="${width - margin.right}" y1="${y0}" y2="${y0}"></line>
    ${values.map((v, i) => {
      const x = margin.left + i * (plotW / values.length) + (plotW / values.length - barW) / 2;
      const top = v >= 0 ? y(v) : y0;
      const h = Math.abs(y(v) - y0);
      return `<rect x="${x}" y="${top}" width="${barW}" height="${h}" rx="3" fill="${v >= 0 ? colors.positive : colors.negative}"></rect>
        <text class="tick-label" x="${x + barW / 2}" y="${height - 22}" text-anchor="middle">${labels[i]}</text>`;
    }).join("")}
  </svg>`;
}

function renderLineChart(node, labels, series) {
  const width = Math.max(node.clientWidth, 520);
  const height = Math.max(node.clientHeight, 300);
  const margin = { top: 18, right: 18, bottom: 58, left: 58 };
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;
  const values = series.flatMap((s) => s.values).filter(Number.isFinite);
  const max = niceMax(Math.max(...values, 1));
  const x = (i) => margin.left + (labels.length <= 1 ? plotW / 2 : (i / (labels.length - 1)) * plotW);
  const y = (v) => margin.top + plotH - (v / max) * plotH;
  node.innerHTML = `<svg viewBox="0 0 ${width} ${height}">
    ${grid(max, y, margin, width)}
    ${series.map((s) => `<polyline class="series-line" stroke="${s.color}" points="${s.values.map((v, i) => Number.isFinite(v) ? `${x(i)},${y(v)}` : "").filter(Boolean).join(" ")}"></polyline>`).join("")}
    ${labels.filter((_, i) => i % Math.ceil(labels.length / 8) === 0 || i === labels.length - 1).map((label) => `<text class="tick-label" x="${x(labels.indexOf(label))}" y="${height - 34}" text-anchor="middle">${label}</text>`).join("")}
    ${legend(series, margin.left, height - 12)}
  </svg>`;
}

function grid(max, y, margin, width) {
  return [0, 0.25, 0.5, 0.75, 1].map((t) => t * max).map((tick) => `
    <line class="grid-line" x1="${margin.left}" x2="${width - margin.right}" y1="${y(tick)}" y2="${y(tick)}"></line>
    <text class="tick-label" x="${margin.left - 10}" y="${y(tick) + 4}" text-anchor="end">${short(tick)}</text>
  `).join("");
}

function legend(series, x, y) {
  return `<g>${series.map((s, i) => `<rect x="${x + i * 110}" y="${y - 10}" width="14" height="5" rx="2" fill="${s.color}"></rect><text class="tick-label" x="${x + i * 110 + 20}" y="${y - 4}">${s.name}</text>`).join("")}</g>`;
}

function balanceRow(label, value, max, type) {
  return `<div class="balance-row"><header><span>${label}</span><strong>${fmt.format(value)} ลบ.ม.</strong></header><div class="bar-track"><div class="bar-fill ${type}" style="width:${Math.max(2, (value / max) * 100)}%"></div></div></div>`;
}

function qualityItem(value, label) {
  return `<div class="quality-item"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`;
}

function statusClass(status) {
  if (status === "ปกติ") return "ok";
  if (status === "ผิดปกติ") return "alert";
  return "watch";
}

function labelType(type) {
  return type === "Water In" ? "น้ำดี" : type === "Wastewater" ? "น้ำทิ้ง" : "Unknown";
}

function sum(rows, key) {
  return rows.reduce((total, row) => total + (Number(row[key]) || 0), 0);
}

function maxRow(rows, key) {
  return rows.reduce((best, row) => (!best || row[key] > best[key] ? row : best), null);
}

function niceMax(value) {
  const pow = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / pow) * pow;
}

function short(value) {
  return Math.abs(value) >= 1000 ? `${fmt1.format(value / 1000)}k` : fmt.format(value);
}

function escapeHtml(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function debounce(fn, wait) {
  let handle;
  return () => {
    clearTimeout(handle);
    handle = setTimeout(fn, wait);
  };
}
