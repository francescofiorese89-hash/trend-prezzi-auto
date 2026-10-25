// MODELLO DI FILE DATI — copia come data/<marca>-<modello>-<anni>.js e aggiungi la voce in data/index.js.
// Tutte le sezioni tranne `model` e `meta` sono facoltative: l'app mostra "nessun dato" per quelle vuote.
// Convenzioni: valute ISO (EUR, USD, GBP); date "YYYY-MM-DD" o "YYYY-MM"; t = anno decimale (2016.5 = metà 2016);
// chilometraggi in km (converti le miglia x1,609).
window.CAR_MODELS = window.CAR_MODELS || {};
window.CAR_MODELS["marca-modello-anni"] = {
  model: {
    id: "marca-modello-anni",          // uguale alla chiave sopra e all'id in data/index.js
    make: "Marca",
    name: "Modello (serie) motore",
    subtitle: "variante di riferimento",
    modelYears: [1990, 1991, 1992],
    description: "Due righe su cosa include il mercato tracciato e quali varianti vanno tenute separate."
  },

  meta: {
    lastUpdate: "2026-01-01",          // data dell'ultimo aggiornamento del file
    fx: { EURUSD: 1.15, GBPUSD: 1.30 } // cambi di default per la conversione (modificabili dall'interfaccia)
  },

  primarySeriesId: "serie_principale",  // serie con punti annuali che guida i KPI di variazione
  cycleSeriesId: "serie_guida",         // serie per il confronto "oggi vs massimo" (di solito una guida per condizione)
  indexBaseYear: 2016,                  // anno base per la vista a indice (100)

  reading: [
    "**Titolo del paragrafo.** Testo della lettura del trend con le cifre chiave."
  ],

  series: [
    {
      id: "serie_principale",
      name: "Nome completo della serie (fonte)",
      short: "Nome breve per la legenda",
      currency: "USD",
      kind: "median",                   // guide | median | average
      scope: "cosa misura, quali varianti/anni include",
      sourceId: "fonte_1",
      points: [
        { t: 2016.5, value: 100000, n: 12 },
        { t: 2017.5, value: 95000, n: 9, note: "commento facoltativo" }
      ]
    }
  ],

  snapshot: {
    asOf: "2026-01",
    valuations: [
      { market: "USA", sourceId: "fonte_1", item: "oggetto valutato", condition: "#2 Excellent", value: 100000, currency: "USD", date: "2026-01", n: 10, note: "", headline: false, headlineLabel: "" }
    ]
  },

  sales: [
    { date: "2026-01-15", my: 1991, body: "Coupé", price: 100000, currency: "USD", km: 80000, location: "Città (Paese)", source: "casa d'aste", sourceId: "fonte_1", note: "", outlier: false }
  ],

  listings: [
    { date: "2026-01", my: 1991, body: "Coupé", km: 80000, country: "IT", price: 95000, currency: "EUR", seller: "dealer", sourceId: "fonte_2", note: "" }
  ],

  sources: [
    { id: "fonte_1", name: "Nome fonte — pagina", url: "https://...", accessed: "2026-01-01", notes: "" },
    { id: "fonte_2", name: "Nome fonte — pagina", url: "https://...", accessed: "2026-01-01" }
  ]
};
