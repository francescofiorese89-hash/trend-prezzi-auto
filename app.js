/* Trend prezzi auto d'epoca — app.js
   Legge window.CAR_INDEX (data/index.js), carica a richiesta il file del modello scelto
   (che si registra in window.CAR_MODELS[id]) e ridisegna ogni sezione dal modello attivo. */
(function () {
  'use strict';

  // ---------- utilità DOM ----------
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  function h(tag, attrs) {
    const node = document.createElement(tag);
    if (attrs) for (const k of Object.keys(attrs)) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else if (k.indexOf('on') === 0) node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v === true ? '' : v);
    }
    for (let i = 2; i < arguments.length; i++) {
      const c = arguments[i];
      if (c == null || c === false) continue;
      if (Array.isArray(c)) c.forEach(x => x != null && x !== false && node.append(x.nodeType ? x : document.createTextNode(String(x))));
      else node.append(c.nodeType ? c : document.createTextNode(String(c)));
    }
    return node;
  }
  const cssVar = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); return node; }
  // **grassetto** -> <strong>, senza altro HTML
  function richText(s) {
    const frag = document.createDocumentFragment();
    String(s).split(/\*\*(.+?)\*\*/g).forEach((part, i) => frag.append(i % 2 ? h('strong', { text: part }) : part));
    return frag;
  }

  // ---------- stato ----------
  const state = { modelId: null, currency: 'EUR', view: 'index', fx: { EURUSD: 1.15, GBPUSD: 1.30 }, showOutliers: false, myFilter: 'all' };
  let M = null;
  const charts = { trend: null, sales: null };

  // ---------- valute e formati ----------
  const SYM = { EUR: '€', USD: '$', GBP: '£' };
  const usdRate = cur => cur === 'USD' ? 1 : cur === 'EUR' ? state.fx.EURUSD : cur === 'GBP' ? state.fx.GBPUSD : 1;
  function toCur(v, from, to) { if (v == null || isNaN(v)) return null; return v * usdRate(from) / usdRate(to); }
  const nf0 = new Intl.NumberFormat('it-IT', { maximumFractionDigits: 0 });
  const fmtMoney = (v, cur) => v == null || isNaN(v) ? '–' : nf0.format(Math.round(v)) + ' ' + (SYM[cur] || cur);
  function fmtCompact(v, cur) {
    const s = Math.abs(v) >= 1e6 ? (v / 1e6).toLocaleString('it-IT', { maximumFractionDigits: 2 }) + ' M' : (v / 1e3).toLocaleString('it-IT', { maximumFractionDigits: 0 }) + ' k';
    return cur ? s + ' ' + (SYM[cur] || cur) : s;
  }
  function fmtPct(p, digits) {
    if (p == null || !isFinite(p)) return '–';
    const d = digits == null ? 1 : digits;
    return (p > 0 ? '+' : '') + (p * 100).toLocaleString('it-IT', { maximumFractionDigits: d, minimumFractionDigits: d }) + ' %';
  }
  const fmtKm = km => km == null ? 'n/d' : nf0.format(km) + ' km';
  const MONTHS = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
  function fmtDate(s) {
    if (!s) return '';
    const p = String(s).split('-');
    if (p.length === 1) return p[0];
    if (p.length === 2) return MONTHS[+p[1] - 1] + ' ' + p[0];
    return (+p[2]) + ' ' + MONTHS[+p[1] - 1] + ' ' + p[0];
  }
  function decYear(s) {
    const p = String(s).split('-').map(Number);
    const y = p[0], t = Date.UTC(y, (p[1] || 1) - 1, p[2] || 15);
    const a = Date.UTC(y, 0, 1), b = Date.UTC(y + 1, 0, 1);
    return y + (t - a) / (b - a);
  }
  function fmtDec(t, withMonth) {
    const y = Math.floor(t), mi = Math.min(11, Math.round((t - y) * 12));
    return withMonth ? MONTHS[mi] + ' ' + y : String(y);
  }
  function fmtT(t) { const y = Math.floor(t), f = t - y; return (f < 0.3 ? 'inizio ' : f < 0.67 ? 'metà ' : 'fine ') + y; }
  function median(arr) {
    const a = arr.filter(x => x != null && !isNaN(x)).sort((x, y) => x - y);
    if (!a.length) return null;
    const m = Math.floor(a.length / 2);
    return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
  }
  function addMonths(iso, n) {
    const p = iso.split('-').map(Number);
    const d = new Date(Date.UTC(p[0], (p[1] || 1) - 1 + n, p[2] || 1));
    return d.toISOString().slice(0, 10);
  }
  const yearsLabel = () => { const ys = M.model.modelYears || []; return ys.length ? ys[0] + '–' + ys[ys.length - 1] : ''; };
  function sourceName(id, short) {
    const s = (M.sources || []).find(x => x.id === id);
    if (!s) return id || '';
    return short ? s.name.split(' — ')[0] : s.name;
  }
  const seriesById = id => (M.series || []).find(s => s.id === id);
  const primarySeries = () => seriesById(M.primarySeriesId) || (M.series || [])[0];
  const cycleSeries = () => seriesById(M.cycleSeriesId) || (M.series || []).find(s => s.kind === 'guide') || primarySeries();

  // ---------- caricamento modelli ----------
  function loadModel(id) {
    return new Promise((resolve, reject) => {
      if (window.CAR_MODELS && window.CAR_MODELS[id]) return resolve(window.CAR_MODELS[id]);
      const entry = (window.CAR_INDEX || []).find(m => m.id === id);
      if (!entry) return reject(new Error('Modello non presente nel registro: ' + id));
      const s = document.createElement('script');
      s.src = entry.file;
      s.onload = () => (window.CAR_MODELS && window.CAR_MODELS[id]) ? resolve(window.CAR_MODELS[id]) : reject(new Error('Il file ' + entry.file + ' non registra il modello ' + id));
      s.onerror = () => reject(new Error('Impossibile caricare ' + entry.file));
      document.head.appendChild(s);
    });
  }

  async function selectModel(id) {
    try {
      M = await loadModel(id);
    } catch (err) {
      $('#modelTitle').textContent = 'Dati non disponibili';
      $('#modelSub').textContent = err.message;
      return;
    }
    state.modelId = id;
    if (M.meta && M.meta.fx) {
      state.fx.EURUSD = M.meta.fx.EURUSD || state.fx.EURUSD;
      state.fx.GBPUSD = M.meta.fx.GBPUSD || state.fx.GBPUSD;
      $('#fxEurUsd').value = state.fx.EURUSD;
      $('#fxGbpUsd').value = state.fx.GBPUSD;
    }
    state.myFilter = 'all';
    try { if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id); } catch (e) { /* ignora */ }
    renderAll();
  }

  // ---------- rendering ----------
  function renderAll() {
    renderMasthead();
    renderKpis();
    renderTrend();
    renderReading();
    renderQuotes();
    renderSales();
    renderListings();
    renderMine();
    renderSources();
    $('#footer').textContent = 'Dati raccolti da fonti pubbliche indicate in «Fonti e metodo». Le cifre sono indicative e non costituiscono una perizia. Ultimo aggiornamento dati: ' + fmtDate(M.meta.lastUpdate) + '.';
  }

  function renderMasthead() {
    document.title = M.model.make + ' ' + M.model.name + ' · Trend Prezzi Auto';
    $('#modelTitle').textContent = M.model.make + ' ' + M.model.name;
    const parts = ['Model year ' + yearsLabel()];
    if (M.model.subtitle) parts.push(M.model.subtitle);
    parts.push('dati aggiornati al ' + fmtDate(M.meta.lastUpdate));
    $('#modelSub').textContent = parts.join(' · ');
    $('#modelDesc').textContent = M.model.description || '';
  }

  // --- KPI
  function salesAll() { return (M.sales || []).slice().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)); }
  function salesLast12(includeOutliers) {
    const cutoff = addMonths(M.meta.lastUpdate, -12);
    return salesAll().filter(s => s.date >= cutoff && (includeOutliers || !s.outlier));
  }
  function renderKpis() {
    const tiles = [];
    const s12 = salesLast12(false);
    const med = median(s12.map(s => toCur(s.price, s.currency, state.currency)));
    if (med != null) tiles.push({ label: 'Mediana vendite 12 mesi (dataset)', value: fmtMoney(med, state.currency), sub: s12.length + ' vendite reali MY ' + yearsLabel() + ', esclusi esemplari speciali' });

    const ps = primarySeries();
    if (ps && ps.points.length >= 2) {
      const a = ps.points[ps.points.length - 2], b = ps.points[ps.points.length - 1];
      const ch = b.value / a.value - 1;
      tiles.push({ label: 'Variazione ' + fmtDec(a.t) + ' → ' + fmtDec(b.t), value: fmtPct(ch), cls: ch >= 0 ? 'up' : 'down', sub: ps.short + (b.note ? ' · ' + b.note : '') });
    }
    const cs = cycleSeries();
    if (cs && cs.points.length >= 2) {
      const peak = cs.points.reduce((m, p) => (p.value > m.value ? p : m), cs.points[0]);
      const last = cs.points[cs.points.length - 1];
      const d = last.value / peak.value - 1;
      tiles.push({ label: 'Oggi vs massimo storico', value: fmtPct(d), cls: d >= 0 ? 'up' : 'down', sub: cs.short + ' · massimo ' + fmtMoney(toCur(peak.value, cs.currency, state.currency), state.currency) + ' (' + fmtDec(peak.t) + ') · ultimo ' + fmtMoney(toCur(last.value, cs.currency, state.currency), state.currency) });
    }
    const head = ((M.snapshot || {}).valuations || []).find(v => v.headline);
    if (head) {
      const conv = head.currency !== state.currency;
      tiles.push({ label: head.headlineLabel || (head.market + ': ' + head.item), value: fmtMoney(toCur(head.value, head.currency, state.currency), state.currency), sub: head.condition + (head.n ? ' · ' + head.n + ' vendite' : '') + ' · ' + sourceName(head.sourceId, true) + (conv ? ' · orig. ' + fmtMoney(head.value, head.currency) : '') });
    }
    const root = clear($('#kpis'));
    tiles.forEach(t => root.append(h('div', { class: 'kpi' },
      h('div', { class: 'kpi-label', text: t.label }),
      h('div', { class: 'kpi-value' + (t.cls ? ' ' + t.cls : ''), text: t.value }),
      h('div', { class: 'kpi-sub', text: t.sub }))));
    root.hidden = tiles.length === 0;
  }

  // --- grafici: tema e plugin
  function chartTheme() {
    if (!window.Chart) return;
    Chart.defaults.font.family = cssVar('--font-body') || 'system-ui, sans-serif';
    Chart.defaults.font.size = 12;
    Chart.defaults.color = cssVar('--fg-2');
    Chart.defaults.borderColor = cssVar('--grid');
    Chart.defaults.plugins.tooltip.backgroundColor = cssVar('--fg');
    Chart.defaults.plugins.tooltip.titleColor = cssVar('--bg');
    Chart.defaults.plugins.tooltip.bodyColor = cssVar('--bg');
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.displayColors = true;
    Chart.defaults.plugins.tooltip.boxPadding = 4;
    Chart.defaults.plugins.legend.labels.boxWidth = 22;
    Chart.defaults.plugins.legend.labels.boxHeight = 2;
  }
  const crosshair = {
    id: 'crosshair',
    afterDraw(chart) {
      const t = chart.tooltip;
      if (!t || !t.getActiveElements || !t.getActiveElements().length) return;
      const x = t.getActiveElements()[0].element.x;
      const area = chart.chartArea, ctx = chart.ctx;
      ctx.save();
      ctx.strokeStyle = cssVar('--fg-3');
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(x, area.top); ctx.lineTo(x, area.bottom); ctx.stroke();
      ctx.restore();
    }
  };
  function noChart(canvas, msg) {
    const box = canvas.parentElement;
    if (!box.querySelector('.empty')) box.append(h('p', { class: 'empty', text: msg }));
  }

  // --- trend
  const SLOTS = ['--s1', '--s2', '--s3', '--s4', '--s5', '--s6'];
  function basePoint(s) {
    const base = (M.indexBaseYear || 2016) + 0.5;
    let best = null;
    s.points.forEach(p => { if (Math.abs(p.t - base) <= 0.75 && (!best || Math.abs(p.t - base) < Math.abs(best.t - base))) best = p; });
    return best;
  }
  function trendDatasets() {
    const out = [];
    (M.series || []).forEach((s, i) => {
      const color = cssVar(SLOTS[i % SLOTS.length]);
      const base = basePoint(s);
      if (state.view === 'index' && !base) return;
      const conv = state.view === 'value' && s.currency !== state.currency;
      const data = s.points.map(p => ({
        x: p.t,
        y: state.view === 'index' ? p.value / base.value * 100 : toCur(p.value, s.currency, state.currency),
        p: p, s: s
      }));
      out.push({
        label: s.short + (conv ? ' (conv.)' : ''),
        data: data,
        parsing: false,
        borderColor: color,
        backgroundColor: color,
        borderWidth: 2,
        tension: 0,
        spanGaps: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: color,
        pointBorderColor: cssVar('--surface'),
        pointBorderWidth: 1.5,
        borderDash: s.kind === 'guide' ? [7, 4] : s.kind === 'average' ? [2, 3] : []
      });
    });
    return out;
  }
  function renderTrend() {
    const canvas = $('#trendChart');
    const base = M.indexBaseYear || 2016;
    $$('#trendSection .seg button').forEach(b => {
      b.setAttribute('aria-pressed', String(b.dataset.view === state.view));
      if (b.dataset.view === 'index') b.textContent = 'Indice (' + base + ' = 100)';
    });
    const excluded = (M.series || []).filter(s => !basePoint(s)).map(s => s.short);
    $('#trendHint').textContent = state.view === 'index'
      ? 'Ogni serie è riportata a 100 nel ' + base + ' per confrontare l\'andamento di fonti con valute e metodi diversi. Clic sulla legenda per nascondere una serie.' + (excluded.length ? ' Fuori dall\'indice (senza dato ' + base + '): ' + excluded.join(', ') + '.' : '')
      : 'Valori in ' + state.currency + '. Le serie in altra valuta sono convertite al cambio indicato in alto: è un\'approssimazione, il cambio storico era diverso.';
    renderTrendTable();
    if (charts.trend) { charts.trend.destroy(); charts.trend = null; }
    if (!window.Chart) return noChart(canvas, 'Grafico non disponibile: la libreria Chart.js non è stata caricata (serve la connessione). La tabella qui sotto riporta gli stessi dati.');
    if (!(M.series || []).length) return noChart(canvas, 'Nessuna serie storica per questo modello.');
    chartTheme();
    const ds = trendDatasets();
    const xs = ds.flatMap(d => d.data.map(p => p.x));
    const self = this;
    charts.trend = new Chart(canvas, {
      type: 'line',
      data: { datasets: ds },
      plugins: [crosshair],
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'nearest', axis: 'xy', intersect: false },
        scales: {
          x: {
            type: 'linear', min: Math.floor(Math.min.apply(null, xs)) - 0.2, max: Math.ceil(Math.max.apply(null, xs)) + 0.2,
            ticks: { stepSize: 1, callback: v => Number.isInteger(v) ? String(v) : '', maxRotation: 0, autoSkip: true },
            grid: { color: cssVar('--grid') }, border: { color: cssVar('--line') }
          },
          y: {
            title: { display: true, text: state.view === 'index' ? 'Indice (' + base + ' = 100)' : 'Valore in ' + state.currency, color: cssVar('--fg-3') },
            ticks: { callback: v => state.view === 'index' ? String(v) : fmtCompact(v) },
            grid: { color: cssVar('--grid') }, border: { display: false },
            beginAtZero: state.view === 'value'
          }
        },
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: false, padding: 14 } },
          tooltip: {
            callbacks: {
              title: items => items.length ? fmtT(items[0].raw.x) : '',
              label: item => {
                const r = item.raw, s = r.s, p = r.p;
                let txt = s.short + ': ';
                if (state.view === 'index') txt += r.y.toFixed(0) + ' (' + base + ' = 100) · ' + fmtMoney(p.value, s.currency);
                else txt += fmtMoney(r.y, state.currency) + (s.currency !== state.currency ? ' (orig. ' + fmtMoney(p.value, s.currency) + ')' : '');
                if (p.n) txt += ' · ' + p.n + ' vendite';
                return txt;
              },
              afterLabel: item => item.raw.p.note ? wrapText(item.raw.p.note, 60) : ''
            }
          }
        }
      }
    });
  }
  function wrapText(s, width) {
    const words = String(s).split(' '), lines = []; let cur = '';
    words.forEach(w => { if ((cur + ' ' + w).trim().length > width) { lines.push(cur.trim()); cur = w; } else cur += ' ' + w; });
    if (cur.trim()) lines.push(cur.trim());
    return lines;
  }
  function renderTrendTable() {
    const root = clear($('#trendTable'));
    const series = M.series || [];
    if (!series.length) return;
    const years = Array.from(new Set(series.flatMap(s => s.points.map(p => Math.floor(p.t))))).sort();
    const thead = h('thead', null, h('tr', null, h('th', { text: 'Anno' }), series.map(s => h('th', { class: 'num', text: s.short + ' (' + s.currency + ')' }))));
    const tbody = h('tbody');
    years.forEach(y => {
      tbody.append(h('tr', null, h('td', { class: 'num', text: y }), series.map(s => {
        const pts = s.points.filter(p => Math.floor(p.t) === y);
        if (!pts.length) return h('td', { class: 'num muted', text: '–' });
        return h('td', { class: 'num', title: pts.map(p => p.note || '').filter(Boolean).join(' / ') }, pts.map(p => fmtMoney(p.value, s.currency) + (p.n ? ' (' + p.n + ')' : '')).join(' / '));
      })));
    });
    root.append(h('table', null, thead, tbody));
  }

  // --- lettura
  function renderReading() {
    const strip = clear($('#cycleStrip'));
    const cs = cycleSeries();
    if (cs && cs.points.length >= 3) {
      const peakIdx = cs.points.reduce((mi, p, i, arr) => (p.value > arr[mi].value ? i : mi), 0);
      const after = cs.points.slice(peakIdx + 1);
      const trough = after.length ? after.reduce((m, p) => (p.value < m.value ? p : m), after[0]) : null;
      const last = cs.points[cs.points.length - 1];
      const first = cs.points[0];
      const item = (label, p) => h('span', null, h('small', { text: label }), h('b', { text: fmtMoney(toCur(p.value, cs.currency, state.currency), state.currency) }), ' ', fmtDec(p.t));
      const arrow = () => h('span', { class: 'arrow', text: '→' });
      strip.append(item('partenza', first), arrow(), item('massimo', cs.points[peakIdx]));
      if (trough && trough !== last) strip.append(arrow(), item('minimo', trough));
      strip.append(arrow(), item('ultimo dato', last));
      strip.append(h('small', { text: cs.short + (cs.currency !== state.currency ? ' · convertito in ' + state.currency : '') }));
    }
    const body = clear($('#readingBody'));
    (M.reading || []).forEach(par => body.append(h('p', null, richText(par))));
    $('#reading').hidden = !(M.reading || []).length && !strip.childNodes.length;
  }

  // --- quotazioni
  function renderQuotes() {
    const vals = ((M.snapshot || {}).valuations || []);
    $('#quotesIntro').textContent = vals.length ? 'Listini per condizione e statistiche a 12 mesi per mercato, aggiornati a ' + fmtDate((M.snapshot || {}).asOf || M.meta.lastUpdate) + '. La colonna «in ' + state.currency + '» usa i cambi impostati in alto.' : '';
    const root = clear($('#quotesTable'));
    if (!vals.length) { root.append(h('p', { class: 'empty', text: 'Nessuna quotazione registrata per questo modello.' })); return; }
    const markets = Array.from(new Set(vals.map(v => v.market)));
    const thead = h('thead', null, h('tr', null,
      h('th', { text: 'Fonte' }), h('th', { text: 'Oggetto' }), h('th', { text: 'Condizione / metrica' }),
      h('th', { class: 'num', text: 'Valore' }), h('th', { class: 'num', text: 'in ' + state.currency }), h('th', { class: 'num', text: 'n' }), h('th', { text: 'Data' }), h('th', { text: 'Note' })));
    const tbody = h('tbody');
    markets.forEach(mk => {
      tbody.append(h('tr', { class: 'group' }, h('td', { colspan: 8, text: mk })));
      vals.filter(v => v.market === mk).forEach(v => {
        const conv = toCur(v.value, v.currency, state.currency);
        tbody.append(h('tr', null,
          h('td', { text: sourceName(v.sourceId, true) }),
          h('td', { text: v.item }),
          h('td', { text: v.condition }),
          h('td', { class: 'num', text: fmtMoney(v.value, v.currency) }),
          h('td', { class: 'num' + (v.currency === state.currency ? ' muted' : ''), text: v.currency === state.currency ? '=' : fmtMoney(conv, state.currency) }),
          h('td', { class: 'num muted', text: v.n ? String(v.n) : '' }),
          h('td', { class: 'muted', text: fmtDate(v.date) }),
          h('td', { class: 'muted', text: v.note || '' })));
      });
    });
    root.append(h('table', null, thead, tbody));
  }

  // --- vendite
  const RAMP = ['--seq-1', '--seq-2', '--seq-3', '--seq-4', '--seq-5'];
  const STYLES = ['circle', 'triangle', 'rect', 'rectRot', 'star'];
  function salesFiltered() {
    return salesAll().filter(s => (state.showOutliers || !s.outlier) && (state.myFilter === 'all' || s.my === +state.myFilter));
  }
  function renderSales() {
    const years = M.model.modelYears || [];
    const chips = clear($('#myChips'));
    const mk = (val, label) => h('button', { type: 'button', class: 'chip', 'aria-pressed': String(state.myFilter === val), onclick: () => { state.myFilter = val; renderSales(); } }, label);
    chips.append(mk('all', 'Tutti'));
    years.forEach(y => chips.append(mk(String(y), String(y))));
    $('#outlierToggle').checked = state.showOutliers;

    const all = salesAll();
    const n12 = salesLast12(false).length;
    $('#salesHint').textContent = all.length
      ? all.length + ' vendite registrate (' + n12 + ' negli ultimi 12 mesi, esclusi esemplari speciali). Mediane calcolate sugli ultimi 12 mesi nella valuta di lettura. Gli esemplari speciali (Flachbau, km bassissimi, record) restano fuori dalle mediane.'
      : '';

    // mini statistiche per anno modello
    const minis = clear($('#salesMinis'));
    const s12 = salesLast12(false);
    years.forEach((y, i) => {
      const arr = s12.filter(s => s.my === y).map(s => toCur(s.price, s.currency, state.currency));
      const med = median(arr);
      minis.append(h('div', { class: 'mini' },
        h('div', { class: 'mini-label' }, h('i', { style: 'background:' + cssVar(RAMP[i % RAMP.length]) }), 'MY ' + y),
        h('div', { class: 'mini-value', text: med == null ? '–' : fmtMoney(med, state.currency) }),
        h('div', { class: 'mini-sub', text: arr.length ? 'mediana su ' + arr.length + ' vendite' : 'nessuna vendita negli ultimi 12 mesi' })));
    });
    minis.hidden = !years.length || !all.length;

    renderSalesChart();
    renderSalesTable();
  }
  function renderSalesChart() {
    const canvas = $('#salesChart');
    if (charts.sales) { charts.sales.destroy(); charts.sales = null; }
    const rows = salesFiltered();
    const mine = myRecords();
    if (!window.Chart) return noChart(canvas, 'Grafico non disponibile senza connessione: la tabella riporta gli stessi dati.');
    if (!rows.length && !mine.length) return noChart(canvas, 'Nessuna vendita da mostrare.');
    chartTheme();
    const years = M.model.modelYears || [];
    const ds = years.map((y, i) => ({
      label: 'MY ' + y,
      data: rows.filter(s => s.my === y).map(s => ({ x: decYear(s.date), y: toCur(s.price, s.currency, state.currency), r: s })),
      backgroundColor: cssVar(RAMP[i % RAMP.length]),
      borderColor: cssVar('--surface'),
      borderWidth: 1,
      pointStyle: STYLES[i % STYLES.length],
      pointRadius: 5.5, pointHoverRadius: 8
    })).filter(d => d.data.length);
    const other = rows.filter(s => years.indexOf(s.my) < 0);
    if (other.length) ds.push({ label: 'Altri MY', data: other.map(s => ({ x: decYear(s.date), y: toCur(s.price, s.currency, state.currency), r: s })), backgroundColor: cssVar('--fg-3'), borderColor: cssVar('--surface'), borderWidth: 1, pointStyle: 'circle', pointRadius: 5 });
    if (mine.length) ds.push({
      label: 'Le mie rilevazioni',
      data: mine.map(r => ({ x: decYear(r.date), y: toCur(r.price, r.currency, state.currency), r: r, mine: true })),
      backgroundColor: cssVar('--s2'), borderColor: cssVar('--s2'), borderWidth: 2.5, pointStyle: 'crossRot', pointRadius: 7, pointHoverRadius: 9
    });
    const xs = ds.flatMap(d => d.data.map(p => p.x));
    const xmin = Math.min.apply(null, xs), xmax = Math.max(Math.max.apply(null, xs), decYear(M.meta.lastUpdate));
    const span = Math.max(0.5, xmax - xmin);
    charts.sales = new Chart(canvas, {
      type: 'scatter',
      data: { datasets: ds },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'nearest', intersect: true },
        scales: {
          x: {
            type: 'linear', min: xmin - span * 0.04, max: xmax + span * 0.04,
            ticks: { callback: v => fmtDec(v, span <= 3), maxRotation: 0, autoSkip: true, maxTicksLimit: 10 },
            grid: { color: cssVar('--grid') }, border: { color: cssVar('--line') }
          },
          y: { ticks: { callback: v => fmtCompact(v) }, grid: { color: cssVar('--grid') }, border: { display: false }, title: { display: true, text: 'Prezzo in ' + state.currency, color: cssVar('--fg-3') } }
        },
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true, padding: 14 } },
          tooltip: {
            callbacks: {
              title: items => items.length ? fmtDate(items[0].raw.r.date) : '',
              label: item => {
                const r = item.raw.r;
                const head = item.raw.mine ? (r.type || 'rilevazione') + ' · MY ' + r.my : 'MY ' + r.my + (r.body ? ' ' + r.body : '');
                let txt = head + ': ' + fmtMoney(item.raw.y, state.currency);
                if (r.currency !== state.currency) txt += ' (orig. ' + fmtMoney(r.price, r.currency) + ')';
                if (r.km != null) txt += ' · ' + fmtKm(r.km);
                return txt;
              },
              afterLabel: item => {
                const r = item.raw.r; const bits = [];
                if (r.location) bits.push(r.location);
                if (r.source) bits.push(r.source);
                if (r.note) bits.push(r.note);
                if (r.outlier) bits.push('esemplare speciale / anomalo');
                return bits.length ? wrapText(bits.join(' · '), 60) : '';
              }
            }
          }
        }
      }
    });
  }
  function renderSalesTable() {
    const root = clear($('#salesTable'));
    const rows = salesFiltered();
    if (!rows.length) { root.append(h('p', { class: 'empty', text: 'Nessuna vendita per il filtro selezionato.' })); return; }
    const thead = h('thead', null, h('tr', null,
      h('th', { text: 'Data' }), h('th', { class: 'num', text: 'MY' }), h('th', { text: 'Carrozzeria' }),
      h('th', { class: 'num', text: 'Prezzo' }), h('th', { class: 'num', text: 'in ' + state.currency }), h('th', { class: 'num', text: 'Km' }),
      h('th', { text: 'Luogo' }), h('th', { text: 'Fonte' }), h('th', { text: 'Note' })));
    const tbody = h('tbody');
    rows.forEach(s => {
      tbody.append(h('tr', { class: s.outlier ? 'outlier' : null },
        h('td', { text: fmtDate(s.date) }),
        h('td', { class: 'num', text: s.my }),
        h('td', { text: s.body || '' }),
        h('td', { class: 'num', text: fmtMoney(s.price, s.currency) }),
        h('td', { class: 'num' + (s.currency === state.currency ? ' muted' : ''), text: s.currency === state.currency ? '=' : fmtMoney(toCur(s.price, s.currency, state.currency), state.currency) }),
        h('td', { class: 'num', text: fmtKm(s.km) }),
        h('td', { text: s.location || '' }),
        h('td', { class: 'muted', text: (s.source || '') + (s.sourceId ? ' · ' + sourceName(s.sourceId, true) : '') }),
        h('td', { class: 'muted' }, s.outlier ? [h('span', { class: 'badge warn', text: 'speciale' }), ' '] : null, s.note || '')));
    });
    root.append(h('table', null, thead, tbody));
  }

  // --- annunci
  function renderListings() {
    const rows = (M.listings || []).slice().sort((a, b) => a.my - b.my || (a.price - b.price));
    const minis = clear($('#listingsMinis'));
    const root = clear($('#listingsTable'));
    $('#listingsSection').hidden = !rows.length;
    if (!rows.length) return;
    const bodies = Array.from(new Set(rows.map(r => r.body || 'n/d')));
    bodies.forEach(b => {
      const arr = rows.filter(r => (r.body || 'n/d') === b).map(r => toCur(r.price, r.currency, state.currency));
      minis.append(h('div', { class: 'mini' },
        h('div', { class: 'mini-label', text: b }),
        h('div', { class: 'mini-value', text: fmtMoney(median(arr), state.currency) }),
        h('div', { class: 'mini-sub', text: 'prezzo richiesto mediano · ' + arr.length + ' annunci' })));
    });
    const thead = h('thead', null, h('tr', null,
      h('th', { class: 'num', text: 'MY' }), h('th', { text: 'Carrozzeria' }), h('th', { class: 'num', text: 'Km' }), h('th', { text: 'Paese' }),
      h('th', { class: 'num', text: 'Richiesta' }), h('th', { class: 'num', text: 'in ' + state.currency }), h('th', { text: 'Venditore' }), h('th', { text: 'Fonte' }), h('th', { text: 'Rilevato' }), h('th', { text: 'Note' }), h('th', { text: 'Link' })));
    const tbody = h('tbody');
    rows.forEach(r => tbody.append(h('tr', null,
      h('td', { class: 'num', text: r.my }),
      h('td', { text: r.body || 'n/d' }),
      h('td', { class: 'num', text: fmtKm(r.km) }),
      h('td', { text: r.country || '' }),
      h('td', { class: 'num', text: fmtMoney(r.price, r.currency) }),
      h('td', { class: 'num' + (r.currency === state.currency ? ' muted' : ''), text: r.currency === state.currency ? '=' : fmtMoney(toCur(r.price, r.currency, state.currency), state.currency) }),
      h('td', { text: r.seller || '' }),
      h('td', { class: 'muted', text: sourceName(r.sourceId, true) }),
      h('td', { class: 'muted', text: fmtDate(r.date) }),
      h('td', { class: 'muted', text: r.note || '' }),
      h('td', null, r.url ? h('a', { href: r.url, target: '_blank', rel: 'noopener noreferrer', text: 'apri' }) : ''))));
    root.append(h('table', null, thead, tbody));
  }

  // --- novità (data/novita.js, riempito dalla routine giornaliera)
  const NEWS_KEY = 'trend-prezzi-auto:news-seen';
  function newsSeen() { try { return localStorage.getItem(NEWS_KEY) || ''; } catch (e) { return ''; } }
  function renderNews() {
    const sec = $('#newsSection');
    if (!sec) return;
    const news = (window.CAR_NEWS || []).slice().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    const seen = newsSeen();
    const unseen = news.filter(n => n.date > seen).reduce((s, n) => s + (n.items || []).length, 0);
    sec.hidden = false;
    $('#newsHint').textContent = news.length
      ? (unseen ? unseen + ' auto nuove dall\'ultima visita. ' : 'Nessuna auto nuova dall\'ultima visita. ') + 'Ultimo controllo: ' + fmtDate(news[0].date) + '. La routine controlla gli annunci ogni giorno.'
      : 'Nessuna novità ancora: la routine giornaliera aggiungerà qui le nuove auto in vendita dei modelli seguiti.';
    const body = clear($('#newsBody'));
    news.slice(0, 12).forEach(n => {
      const entry = (window.CAR_INDEX || []).find(m => m.id === n.modelId);
      const title = entry ? entry.make + ' ' + entry.name + ' · ' + entry.years : n.modelId;
      const isNew = n.date > seen;
      const head = h('div', { class: 'news-head' },
        isNew ? h('span', { class: 'badge new', text: 'nuovo' }) : null,
        h('b', { text: fmtDate(n.date) }), ' · ', title,
        n.summary ? h('span', { class: 'muted', text: ' · ' + n.summary }) : null);
      const items = n.items || [];
      const list = h('ul', { class: 'news-list' }, items.map(it => h('li', null,
        h('span', { class: 'num', text: 'MY ' + (it.my || '?') }), ' ', it.body || '', ' · ', fmtKm(it.km), ' · ', it.country || '', ' · ',
        h('b', { class: 'num', text: fmtMoney(it.price, it.currency) }),
        it.seller ? ' · ' + it.seller : '', it.note ? ' · ' + it.note : '',
        it.url ? h('span', null, ' · ', h('a', { href: it.url, target: '_blank', rel: 'noopener noreferrer', text: 'apri annuncio' })) : null)));
      body.append(h('div', { class: 'news-entry' + (isNew ? ' is-new' : '') }, head, items.length ? list : h('p', { class: 'empty', text: 'Nessuna nuova auto trovata.' })));
    });
  }
  function markNewsSeen() {
    try { localStorage.setItem(NEWS_KEY, new Date().toISOString().slice(0, 10)); } catch (e) { /* memoria non disponibile */ }
    renderNews();
  }

  // --- le mie rilevazioni (localStorage per modello)
  const lsKey = () => 'trend-prezzi-auto:' + state.modelId + ':rilevazioni';
  function myRecords() {
    try { const raw = localStorage.getItem(lsKey()); const arr = raw ? JSON.parse(raw) : []; return Array.isArray(arr) ? arr : []; } catch (e) { return []; }
  }
  function saveMyRecords(arr) {
    try { localStorage.setItem(lsKey(), JSON.stringify(arr)); return true; } catch (e) { return false; }
  }
  function renderMine() {
    const sel = clear($('#mMy'));
    (M.model.modelYears || []).forEach(y => sel.append(h('option', { value: y, text: y })));
    if (!$('#mDate').value) $('#mDate').value = new Date().toISOString().slice(0, 10);
    $('#mCur').value = state.currency;
    const root = clear($('#mineTable'));
    const rows = myRecords().slice().sort((a, b) => (a.date < b.date ? 1 : -1));
    if (!rows.length) { root.append(h('p', { class: 'empty', text: 'Nessuna rilevazione salvata per questo modello.' })); return; }
    const thead = h('thead', null, h('tr', null, h('th', { text: 'Data' }), h('th', { text: 'Tipo' }), h('th', { class: 'num', text: 'MY' }), h('th', { text: 'Carrozzeria' }), h('th', { class: 'num', text: 'Prezzo' }), h('th', { class: 'num', text: 'in ' + state.currency }), h('th', { class: 'num', text: 'Km' }), h('th', { text: 'Fonte / nota' }), h('th', { text: '' })));
    const tbody = h('tbody');
    rows.forEach(r => tbody.append(h('tr', null,
      h('td', { text: fmtDate(r.date) }), h('td', { text: r.type }), h('td', { class: 'num', text: r.my }), h('td', { text: r.body || '' }),
      h('td', { class: 'num', text: fmtMoney(r.price, r.currency) }),
      h('td', { class: 'num' + (r.currency === state.currency ? ' muted' : ''), text: r.currency === state.currency ? '=' : fmtMoney(toCur(r.price, r.currency, state.currency), state.currency) }),
      h('td', { class: 'num', text: fmtKm(r.km) }), h('td', { class: 'muted', text: r.note || '' }),
      h('td', null, h('button', { type: 'button', class: 'btn danger', onclick: () => { saveMyRecords(myRecords().filter(x => x.id !== r.id)); renderMine(); renderSalesChart(); toast('Rilevazione eliminata.'); } }, 'Elimina')))));
    root.append(h('div', { class: 'table-wrap' }, h('table', null, thead, tbody)));
  }
  function toast(msg) { const t = $('#mineToast'); t.textContent = msg; clearTimeout(toast.timer); toast.timer = setTimeout(() => { t.textContent = ''; }, 3500); }
  function onMineSubmit(ev) {
    ev.preventDefault();
    const f = ev.target;
    const rec = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      date: f.date.value, type: f.type.value, my: +f.my.value, body: f.body.value.trim(),
      price: +f.price.value, currency: f.currency.value, km: f.km.value ? +f.km.value : null, note: f.note.value.trim(),
      createdAt: new Date().toISOString()
    };
    if (!rec.date || !rec.price) return;
    const ok = saveMyRecords(myRecords().concat([rec]));
    f.price.value = ''; f.km.value = ''; f.note.value = '';
    renderMine(); renderSalesChart();
    toast(ok ? 'Rilevazione salvata in questo browser.' : 'Salvataggio non riuscito: memoria del browser non disponibile.');
  }
  function onExport() {
    const payload = { modelId: state.modelId, exported: new Date().toISOString(), records: myRecords() };
    const txt = JSON.stringify(payload, null, 2);
    const box = $('#exportBox');
    const show = () => { box.hidden = false; box.value = txt; box.focus(); box.select(); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(() => toast('JSON copiato negli appunti.'), () => { show(); toast('Copia automatica non riuscita: seleziona e copia dal riquadro.'); });
    } else { show(); toast('Seleziona e copia dal riquadro.'); }
  }

  // --- fonti e metodo
  function renderSources() {
    const method = clear($('#methodBody'));
    [
      'Le serie storiche sono riportate nella valuta della fonte; la conversione usa un cambio fisso impostabile e serve solo al confronto di massima. La vista a indice (anno base = 100) evita il problema del cambio.',
      'Quotazioni di listino (Hagerty, Classic Data, Chromradar) e statistiche di vendita (mediane d\'asta) misurano cose diverse: le prime descrivono un\'auto «tipo» per condizione, le seconde il mix di ciò che è stato venduto. Le mediane sono preferite alle medie perché meno sensibili agli esemplari eccezionali.',
      'Le vendite marcate come «speciale» (esemplari Flachbau di fabbrica, chilometraggi minimi, record d\'asta, dati incompleti) sono escluse dalle mediane e dai KPI, ma restano consultabili.',
      'Per aggiornare i dati o aggiungere un modello: copia data/_template.js, compila le sezioni e registra il file in data/index.js. Le rilevazioni manuali restano nel browser (localStorage) e si esportano in JSON.'
    ].concat(M.methodNotes || []).forEach(t => method.append(h('p', null, richText(t))));
    const ol = clear($('#sourcesList'));
    (M.sources || []).forEach(s => ol.append(h('li', null,
      h('b', { text: s.name }), ' — ',
      h('a', { href: s.url, target: '_blank', rel: 'noopener noreferrer', text: s.url }),
      s.accessed ? ' (consultato il ' + fmtDate(s.accessed) + ')' : '',
      s.notes ? h('div', { class: 'muted', text: s.notes }) : null)));
  }

  // ---------- eventi ----------
  function rerenderCharts() { renderTrend(); renderSalesChart(); }
  function bind() {
    $('#modelSelect').addEventListener('change', ev => selectModel(ev.target.value));
    $('#currencySelect').addEventListener('change', ev => { state.currency = ev.target.value; renderAll(); });
    $('#fxEurUsd').addEventListener('change', ev => { const v = parseFloat(ev.target.value); if (v > 0) { state.fx.EURUSD = v; renderAll(); } });
    $('#fxGbpUsd').addEventListener('change', ev => { const v = parseFloat(ev.target.value); if (v > 0) { state.fx.GBPUSD = v; renderAll(); } });
    $$('#trendSection .seg button').forEach(b => b.addEventListener('click', () => { state.view = b.dataset.view; renderTrend(); }));
    $('#outlierToggle').addEventListener('change', ev => { state.showOutliers = ev.target.checked; renderSales(); });
    $('#mineForm').addEventListener('submit', onMineSubmit);
    $('#exportBtn').addEventListener('click', onExport);
    $('#newsSeenBtn').addEventListener('click', markNewsSeen);
    window.addEventListener('hashchange', () => { const id = location.hash.slice(1); if (id && id !== state.modelId && (window.CAR_INDEX || []).some(m => m.id === id)) { $('#modelSelect').value = id; selectModel(id); } });
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    if (mq.addEventListener) mq.addEventListener('change', rerenderCharts); else if (mq.addListener) mq.addListener(rerenderCharts);
    new MutationObserver(rerenderCharts).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  function init() {
    const index = window.CAR_INDEX || [];
    const sel = clear($('#modelSelect'));
    index.forEach(m => sel.append(h('option', { value: m.id, text: m.make + ' ' + m.name + ' · ' + m.years })));
    if (!index.length) { $('#modelTitle').textContent = 'Nessun modello nel registro'; $('#modelSub').textContent = 'Aggiungi una voce in data/index.js.'; return; }
    $('#currencySelect').value = state.currency;
    $('#fxEurUsd').value = state.fx.EURUSD;
    $('#fxGbpUsd').value = state.fx.GBPUSD;
    bind();
    renderNews();
    const fromHash = location.hash.slice(1);
    const start = index.some(m => m.id === fromHash) ? fromHash : index[0].id;
    sel.value = start;
    selectModel(start);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
