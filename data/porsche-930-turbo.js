// Dataset: Porsche 911 Turbo (930) 3.3 — model years 1985-1989
// Fonte di verità dell'app. Tutte le cifre sono nella valuta originale della fonte.
// I chilometraggi delle vendite USA sono convertiti da miglia (x1,609) e arrotondati.
// Aggiornato: 2026-10-25
// Ogni file modello si registra in window.CAR_MODELS[id]; l'id deve coincidere con quello in data/index.js.
window.CAR_MODELS = window.CAR_MODELS || {};
window.CAR_MODELS["porsche-930-turbo-1985-1989"] = {
  model: {
    id: "porsche-930-turbo-1985-1989",
    make: "Porsche",
    name: "911 Turbo (930) 3.3",
    subtitle: "Coupé come riferimento",
    modelYears: [1985, 1986, 1987, 1988, 1989],
    description:
      "Seconda serie della 930 con motore 3.3 litri (300 CV). Dal MY 1986 la Turbo torna ufficialmente negli USA; " +
      "il MY 1989 è l'unico con cambio G50 a 5 marce e vale un premio. Le Flachbau (slant nose) di fabbrica e le " +
      "Cabriolet/Targa (dal 1987) sono mercati distinti: l'app li segnala, ma il trend principale riguarda la Coupé.",
    newPriceUsd1989: 71000
  },

  meta: {
    lastUpdate: "2026-10-25",
    // Cambi indicativi usati SOLO per la colonna/vista convertita (modificabili dall'interfaccia).
    fx: { EURUSD: 1.15, GBPUSD: 1.30 }
  },

  // Serie che guida i KPI di variazione annua (deve avere punti annuali).
  primarySeriesId: "oldcarsdata_median",
  // Serie usata per il confronto "oggi vs massimo storico" (di norma una guida per condizione).
  cycleSeriesId: "hagerty_c2",
  // Anno base per la vista a indice (100 = valore a metà di quell'anno). Le serie senza punto nell'anno base restano fuori dall'indice.
  indexBaseYear: 2016,

  // Lettura del trend: paragrafi in italiano, **grassetto** consentito.
  reading: [
    "**Un ciclo completo in quindici anni.** Nel 2010 una 930 in condizioni eccellenti costava poco più di 40.000 $ negli USA (Hagerty). Il boom 2011-2016 l'ha portata a 235.000 $ (+461% sull'indice Hagerty #2), con il picco a metà 2016, quando il prezzo medio di vendita toccava 148.000 $. In Europa la corsa è partita da 35-45.000 € nel 2012 e ha raggiunto il massimo più tardi, nella primavera 2017 (150-160.000 €).",
    "**Correzione 2017-2020.** Dal picco i valori USA sono scesi del 35% (140.000 $ nel 2020 per una #2) e la mediana delle vendite d'asta è passata da 132.000 $ (2016) a 89.550 $ (2020). In Europa il calo è stato più contenuto, -20/25% in quattro anni, con il minimo nel 2021 intorno a 118.000 €.",
    "**Ripresa 2021-2026 e nuovi massimi negli USA.** La mediana d'asta USA è risalita ogni anno: 152.911 $ nel 2025 e 207.500 $ nei primi dieci mesi del 2026 (+35,7%), sopra il picco del 2016. La guida Hagerty #2 è a 225.000 $, ancora il 4% sotto il massimo 2016. In Europa la mediana 3.3 Coupé è a 147.950 € (+21% sul 2025), ma resta sotto il picco 2017.",
    "**Il premio dell'anno modello.** Il 1989 con cambio G50 vale nettamente di più: mediana USA a 12 mesi 247.000 $ contro 158.500 $ del 1986; in Europa 215.000 € contro 148.000 €. Le Flachbau di fabbrica (230.000 €+) e gli esemplari sotto i 25.000 km (300.000 $+) sono mercati a parte: vanno esclusi dal confronto con un'auto normale.",
    "**USA più caro dell'Europa.** A parità di condizione il mercato americano quota il 20-30% in più: mediana USA a 12 mesi 209.000 $ (circa 180.000 €) contro 148.000 € in Europa. Per chi compra o vende in Italia contano soprattutto il dato europeo e il cambio del dollaro.",
    "**Limiti dei dati.** Le serie mescolano varianti e condizioni; i campioni annuali per singolo anno modello sono piccoli (3-20 vendite); i prezzi d'asta includono o escludono la commissione a seconda della fonte; il cambio EUR/USD sposta i confronti di diversi punti percentuali. Le quotazioni italiane (Ruoteclassiche) non sono pubblicate online: vanno inserite a mano nella sezione «Le mie rilevazioni»."
  ],

  // Serie storiche. kind: guide = quotazione di listino per condizione; median/average = statistiche di vendite reali.
  // Ogni punto: t = anno decimale (2016.5 = metà 2016), value, n = numero vendite (se noto), note.
  series: [
    {
      id: "hagerty_c2",
      name: "Hagerty Price Guide USA — condizione #2 (Excellent)",
      short: "Hagerty #2 (USA)",
      currency: "USD",
      kind: "guide",
      scope: "930 Turbo (tutti gli anni, prevalenza 1986-89)",
      sourceId: "hagerty_insider",
      points: [
        { t: 2010.5, value: 42000, note: "«poco più di 40.000 $ per una 930 in condizioni eccellenti» (2010)" },
        { t: 2016.5, value: 235000, note: "picco: +461% sull'indice #2 dal 2011" },
        { t: 2020.5, value: 140000, note: "minimo post-picco: -35% dal 2016" },
        { t: 2023.55, value: 225000, note: "guida Hagerty 13/07/2023, 1986 911 Turbo #2 (citata da un dealer)" },
        { t: 2025.1, value: 225000, note: "scheda Hagerty feb-2025 su una 1986: #2 225.000 $, #1 295.000 $" }
      ]
    },
    {
      id: "oldcarsdata_median",
      name: "Mediana vendite d'asta USA — tutte le 930 (Oldcarsdata)",
      short: "Mediana aste USA (tutte le 930)",
      currency: "USD",
      kind: "median",
      scope: "Porsche 930 1975-1989, aste e marketplace USA (BaT, Mecum, RM, Cars&Bids…)",
      sourceId: "oldcarsdata",
      points: [
        { t: 2016.5, value: 132000, n: 18 },
        { t: 2017.5, value: 117700, n: 9 },
        { t: 2018.5, value: 110000, n: 53 },
        { t: 2019.5, value: 104500, n: 48 },
        { t: 2020.5, value: 89550, n: 43 },
        { t: 2021.5, value: 107500, n: 74 },
        { t: 2022.5, value: 109965, n: 80 },
        { t: 2023.5, value: 126750, n: 76 },
        { t: 2024.5, value: 130000, n: 77 },
        { t: 2025.5, value: 152911, n: 91 },
        { t: 2026.4, value: 207500, n: 96, note: "anno parziale (gen-ott 2026)" }
      ]
    },
    {
      id: "conceptcarz_1989",
      name: "Mediana vendite d'asta — MY 1989 (Conceptcarz)",
      short: "Mediana aste MY 1989",
      currency: "USD",
      kind: "median",
      scope: "1989 Porsche 911 Turbo (930) — 97 vendite totali, campioni annuali piccoli",
      sourceId: "conceptcarz_1989",
      points: [
        { t: 2012.5, value: 68548, n: 2 },
        { t: 2013.5, value: 80850, n: 3 },
        { t: 2014.5, value: 143498, n: 4 },
        { t: 2015.5, value: 126500, n: 5 },
        { t: 2016.5, value: 165000, n: 11 },
        { t: 2017.5, value: 143000, n: 5 },
        { t: 2018.5, value: 176000, n: 11 },
        { t: 2019.5, value: 121206, n: 7 },
        { t: 2020.5, value: 163581, n: 1 },
        { t: 2021.5, value: 211170, n: 3 },
        { t: 2022.5, value: 236500, n: 3 },
        { t: 2023.5, value: 185180, n: 9 },
        { t: 2024.5, value: 246950, n: 10 },
        { t: 2025.5, value: 184800, n: 5 },
        { t: 2026.4, value: 355357, n: 9, note: "anno parziale; include 577.000 $ RM Sotheby's Monterey (esemplare eccezionale)" }
      ]
    },
    {
      id: "conceptcarz_1987",
      name: "Mediana vendite d'asta — MY 1987 (Conceptcarz)",
      short: "Mediana aste MY 1987",
      currency: "USD",
      kind: "median",
      scope: "1987 Porsche 911 Turbo (930) — 84 vendite totali, campioni annuali piccoli",
      sourceId: "conceptcarz_1987",
      points: [
        { t: 2012.5, value: 78100, n: 1 },
        { t: 2013.5, value: 52500, n: 6 },
        { t: 2014.5, value: 68750, n: 3 },
        { t: 2015.5, value: 125000, n: 7 },
        { t: 2016.5, value: 178750, n: 1 },
        { t: 2017.5, value: 82500, n: 7 },
        { t: 2018.5, value: 111908, n: 8 },
        { t: 2019.5, value: 97975, n: 8 },
        { t: 2020.5, value: 132000, n: 5 },
        { t: 2021.5, value: 179200, n: 3 },
        { t: 2022.5, value: 211750, n: 4 },
        { t: 2023.5, value: 192500, n: 5 },
        { t: 2024.5, value: 197804, n: 6 },
        { t: 2025.5, value: 212800, n: 3 },
        { t: 2026.4, value: 189125, n: 4, note: "anno parziale" }
      ]
    },
    {
      id: "finder911_eur",
      name: "Germania/Europa — valore medio Turbo G-Modell (911finder)",
      short: "Europa valore medio (911finder)",
      currency: "EUR",
      kind: "average",
      scope: "911 Turbo 1975-1989 tutte le varianti fino al 2025; 2026 = mediana vendite 3.3 Coupé Europa (MarqueScope)",
      sourceId: "finder911",
      points: [
        { t: 2012.5, value: 40000, note: "fascia 35-45k € (punto medio)" },
        { t: 2016.5, value: 107500, note: "fascia 100-115k € (punto medio)" },
        { t: 2017.25, value: 155000, note: "picco primavera 2017, fascia 150-160k €" },
        { t: 2021.5, value: 118000, note: "minimo 2021, fascia 115-121k €" },
        { t: 2025.5, value: 122000, note: "valore medio Turbo 3.3 Coupé 2025" },
        { t: 2026.45, value: 147950, n: 82, note: "mediana vendite 3.3 Coupé 4 marce Europa, ott-2025 → giu-2026" }
      ]
    }
  ],

  // Quotazioni attuali (ottobre 2026) per fonte, mercato e condizione.
  snapshot: {
    asOf: "2026-10",
    valuations: [
      { market: "USA", sourceId: "hagerty_insider", item: "930 Turbo 1986 Coupé", condition: "#1 Concours", value: 295000, currency: "USD", date: "2025-02", note: "scheda Hagerty Valuation Tools" },
      { market: "USA", sourceId: "hagerty_insider", item: "930 Turbo 1986 Coupé", condition: "#2 Excellent", value: 225000, currency: "USD", date: "2025-02" },
      { market: "USA", sourceId: "classiccom", item: "Turbo 3.3 Coupé 1978-89", condition: "CMB (benchmark)", value: 165767, currency: "USD", date: "2026-10" },
      { market: "USA", sourceId: "classiccom", item: "Turbo 3.3 Coupé 1978-89", condition: "Media vendite 12 mesi", value: 185331, currency: "USD", n: 97, date: "2026-10", note: "min 76.000 $, max 417.500 $" },
      { market: "USA", sourceId: "oldcarsdata", item: "930 tutti gli anni", condition: "Mediana 12 mesi", value: 209000, currency: "USD", n: 109, date: "2026-10", note: "25°-75° percentile 151.000-258.000 $" },
      { market: "USA", sourceId: "oldcarsdata", item: "MY 1986", condition: "Mediana 12 mesi", value: 158500, currency: "USD", n: 11, date: "2026-10", note: "min 88.430 $, max 311.000 $" },
      { market: "USA", sourceId: "oldcarsdata", item: "MY 1987", condition: "Mediana 12 mesi", value: 221000, currency: "USD", n: 21, date: "2026-10", note: "min 105.000 $, max 307.000 $" },
      { market: "USA", sourceId: "oldcarsdata", item: "MY 1988", condition: "Mediana 12 mesi", value: 222000, currency: "USD", n: 16, date: "2026-10", note: "min 56.100 $, max 494.500 $" },
      { market: "USA", sourceId: "oldcarsdata", item: "MY 1989 (G50)", condition: "Mediana 12 mesi", value: 247000, currency: "USD", n: 16, date: "2026-10", note: "min 110.000 $, max 577.000 $" },
      { market: "USA", sourceId: "classiccom", item: "MY 1985 Coupé", condition: "Media vendite 12 mesi", value: 144639, currency: "USD", n: 2, date: "2026-10" },
      { market: "USA", sourceId: "driveindex", item: "MY 1986", condition: "Valore di mercato stimato", value: 226367, currency: "USD", n: 131, date: "2026-10-25", note: "mediana storica 109.911 $, 8 vendite negli ultimi 12 mesi" },
      { market: "UK", sourceId: "hagerty_uk", item: "1986/1989 Turbo 3.3 Coupé", condition: "Fair", value: 85800, currency: "GBP", date: "2026" },
      { market: "UK", sourceId: "hagerty_uk", item: "1986/1989 Turbo 3.3 Coupé", condition: "Good", value: 132000, currency: "GBP", date: "2026" },
      { market: "UK", sourceId: "hagerty_uk", item: "1986/1989 Turbo 3.3 Coupé", condition: "Excellent", value: 163000, currency: "GBP", date: "2026" },
      { market: "UK", sourceId: "hagerty_uk", item: "1986/1989 Turbo 3.3 Coupé", condition: "Concours", value: 217000, currency: "GBP", date: "2026" },
      { market: "UK", sourceId: "classicvaluer", item: "930 Turbo Coupé (tutti gli anni)", condition: "Mediana vendite dal 2020", value: 111290, currency: "GBP", n: 548, date: "2026-10", note: "max 361.440 £" },
      { market: "Germania", sourceId: "chromradar", item: "Turbo 3.3 Coupé", condition: "Zustand 1 (top)", value: 180000, currency: "EUR", date: "2026-10" },
      { market: "Germania", sourceId: "chromradar", item: "Turbo 3.3 Coupé", condition: "Zustand 2 (buono)", value: 130000, currency: "EUR", date: "2026-10" },
      { market: "Germania", sourceId: "chromradar", item: "Turbo 3.3 Coupé", condition: "Zustand 4 (uso quotidiano)", value: 50000, currency: "EUR", date: "2026-10" },
      { market: "Europa", sourceId: "finder911", item: "Turbo 3.3 Coupé 4 marce", condition: "Mediana vendite ott-25/giu-26", value: 147950, currency: "EUR", n: 82, date: "2026-06", headline: true, headlineLabel: "Europa: mediana 3.3 Coupé" },
      { market: "Europa", sourceId: "finder911", item: "Turbo 3.3 1989 G50 Coupé", condition: "Mediana vendite ott-25/giu-26", value: 215000, currency: "EUR", n: 5, date: "2026-06" },
      { market: "Europa", sourceId: "finder911", item: "Turbo Flachbau Coupé", condition: "Mediana vendite ott-25/giu-26", value: 230058, currency: "EUR", n: 8, date: "2026-06" },
      { market: "Europa", sourceId: "classictrader", item: "Turbo 3.3 (annunci)", condition: "Fascia realistica (punto medio)", value: 150000, currency: "EUR", date: "2026-10", note: "fascia indicata 110.000-190.000 € per 3.3 da buone a ottime" }
    ]
  },

  // Vendite reali recenti, MY 1985-1989. Prezzi nella valuta d'asta. outlier: true = esemplare speciale o dato anomalo.
  sales: [
    { date: "2026-10-20", my: 1987, body: "Coupé", price: 221000, currency: "USD", km: 72400, location: "Elkhart Lake, WI (USA)", source: "Bring a Trailer", sourceId: "oldcarsdata" },
    { date: "2026-10-14", my: 1988, body: "Coupé", price: 240000, currency: "USD", km: 64400, location: "Portland, OR (USA)", source: "Bring a Trailer", sourceId: "oldcarsdata", note: "modificata (3.4)" },
    { date: "2026-10-09", my: 1988, body: "Coupé", price: 136364, currency: "GBP", km: 80000, location: "Knokke-Heist (BE)", source: "Broad Arrow", sourceId: "classicvaluer", note: "prezzo convertito in £ dalla fonte" },
    { date: "2026-10-07", my: 1986, body: "Coupé", price: 310000, currency: "USD", km: 20900, location: "Scottsdale, AZ (USA)", source: "asta USA", sourceId: "oldcarsdata" },
    { date: "2026-09-26", my: 1986, body: "Coupé", price: 161000, currency: "USD", km: 101400, location: "Dallas, TX (USA)", source: "Bring a Trailer", sourceId: "oldcarsdata" },
    { date: "2026-09-25", my: 1989, body: "Coupé", price: 226505, currency: "USD", km: 112700, location: "Pompano Beach, FL (USA)", source: "asta USA", sourceId: "oldcarsdata" },
    { date: "2026-09-25", my: 1987, body: "Coupé", price: 152999, currency: "USD", km: 82100, location: "Monterey, CA (USA)", source: "Bring a Trailer", sourceId: "classiccom", note: "contachilometri TMU" },
    { date: "2026-09-18", my: 1988, body: "Coupé", price: 250000, currency: "USD", km: 66000, location: "Greenville, SC (USA)", source: "Bring a Trailer", sourceId: "oldcarsdata" },
    { date: "2026-09-16", my: 1987, body: "Coupé", price: 307000, currency: "USD", km: 29000, location: "Los Angeles, CA (USA)", source: "Bring a Trailer", sourceId: "oldcarsdata" },
    { date: "2026-09-16", my: 1988, body: "Coupé", price: 146000, currency: "USD", km: 201200, location: "Pass Christian, MS (USA)", source: "Bring a Trailer", sourceId: "oldcarsdata", note: "RoW (europea importata)" },
    { date: "2026-09-15", my: 1989, body: "Coupé", price: 176000, currency: "USD", km: 239800, location: "Elk Grove, CA (USA)", source: "Bring a Trailer", sourceId: "oldcarsdata", note: "30 anni stesso proprietario" },
    { date: "2026-09-10", my: 1986, body: "Coupé", price: 88430, currency: "USD", km: 210800, location: "West Palm Beach, FL (USA)", source: "asta USA", sourceId: "oldcarsdata" },
    { date: "2026-09-08", my: 1987, body: "Coupé", price: 115000, currency: "USD", km: 413600, location: "Fresno, CA (USA)", source: "asta USA", sourceId: "oldcarsdata" },
    { date: "2026-09-04", my: 1986, body: "Coupé", price: 311000, currency: "USD", km: 22500, location: "Great Falls, VA (USA)", source: "asta USA", sourceId: "oldcarsdata" },
    { date: "2026-09-01", my: 1988, body: "Coupé", price: 275000, currency: "USD", km: 64400, location: "Memphis, TN (USA)", source: "asta USA", sourceId: "oldcarsdata" },
    { date: "2026-08-26", my: 1987, body: "Coupé", price: 258000, currency: "USD", km: 56300, location: "Eagle, ID (USA)", source: "asta USA", sourceId: "oldcarsdata" },
    { date: "2026-08-15", my: 1989, body: "Coupé", price: 577000, currency: "USD", km: null, location: "Monterey, CA (USA)", source: "RM Sotheby's", sourceId: "conceptcarz_1989", note: "esemplare eccezionale (record recente), km non indicati", outlier: true },
    { date: "2026-08-15", my: 1989, body: "n/d", price: 445000, currency: "USD", km: null, location: "Monterey, CA (USA)", source: "asta Monterey", sourceId: "oldcarsdata", note: "km non indicati, probabile Flachbau/speciale", outlier: true },
    { date: "2026-08-15", my: 1988, body: "n/d", price: 494500, currency: "USD", km: null, location: "Monterey, CA (USA)", source: "asta Monterey", sourceId: "oldcarsdata", note: "km non indicati, probabile Flachbau/speciale", outlier: true },
    { date: "2026-08-15", my: 1987, body: "Coupé", price: 160000, currency: "USD", km: 82100, location: "Monterey, CA (USA)", source: "asta Monterey", sourceId: "oldcarsdata" },
    { date: "2026-08-12", my: 1988, body: "Coupé", price: 96500, currency: "USD", km: 95000, location: "Tokyo (JP)", source: "asta", sourceId: "oldcarsdata" },
    { date: "2026-07-28", my: 1989, body: "Coupé", price: 153000, currency: "EUR", km: 117000, location: "Strasburgo (FR)", source: "asta", sourceId: "classiccom" },
    { date: "2026-07-22", my: 1986, body: "Coupé", price: 156559, currency: "USD", km: 181900, location: "Spokane, WA (USA)", source: "asta USA", sourceId: "oldcarsdata" },
    { date: "2026-07-22", my: 1987, body: "Coupé", price: 276000, currency: "USD", km: 96600, location: "Newbury Park, CA (USA)", source: "asta USA", sourceId: "oldcarsdata" },
    { date: "2026-07-15", my: 1989, body: "Coupé", price: 224000, currency: "USD", km: 51500, location: "Pompano Beach, FL (USA)", source: "asta USA", sourceId: "oldcarsdata", note: "modificata" },
    { date: "2026-07-15", my: 1986, body: "Coupé", price: 155000, currency: "USD", km: 46700, location: "Portland, OR (USA)", source: "asta USA", sourceId: "oldcarsdata" },
    { date: "2026-07-10", my: 1987, body: "Coupé", price: 151000, currency: "USD", km: 91900, location: "Las Vegas, NV (USA)", source: "asta USA", sourceId: "oldcarsdata" },
    { date: "2026-07-02", my: 1988, body: "Coupé", price: 156000, currency: "USD", km: 122800, location: "Girard, PA (USA)", source: "asta USA", sourceId: "oldcarsdata" },
    { date: "2026-06-30", my: 1986, body: "Coupé", price: 158500, currency: "USD", km: 96600, location: "Newport Beach, CA (USA)", source: "asta USA", sourceId: "oldcarsdata" },
    { date: "2026-06-25", my: 1988, body: "Coupé", price: 315000, currency: "USD", km: 17700, location: "Hailey, ID (USA)", source: "asta USA", sourceId: "oldcarsdata" },
    { date: "2026-06-18", my: 1987, body: "Coupé", price: 260000, currency: "USD", km: 86900, location: "Miami, FL (USA)", source: "asta USA", sourceId: "oldcarsdata" },
    { date: "2026-06-16", my: 1989, body: "Coupé", price: 133550, currency: "GBP", km: 85300, location: "Londra (UK)", source: "asta UK", sourceId: "classiccom", note: "guida a destra" },
    { date: "2026-06-11", my: 1988, body: "Coupé", price: 167000, currency: "USD", km: 162500, location: "West Hollywood, CA (USA)", source: "asta USA", sourceId: "oldcarsdata" },
    { date: "2026-06-09", my: 1987, body: "Coupé", price: 105000, currency: "USD", km: 104600, location: "Gulf Shores, AL (USA)", source: "asta USA", sourceId: "oldcarsdata" },
    { date: "2026-06-08", my: 1985, body: "Coupé", price: 168000, currency: "USD", km: 77200, location: "Daytona Beach, FL (USA)", source: "asta USA", sourceId: "classiccom" },
    { date: "2026-06-02", my: 1989, body: "Coupé", price: 172000, currency: "USD", km: 162500, location: "Beverly Hills, CA (USA)", source: "asta USA", sourceId: "oldcarsdata", note: "modificata" },
    { date: "2026-05-18", my: 1989, body: "Coupé", price: 277000, currency: "USD", km: 80500, location: "Naples, FL (USA)", source: "asta USA", sourceId: "oldcarsdata" },
    { date: "2026-05-16", my: 1989, body: "n/d", price: 302500, currency: "USD", km: null, location: "n/d", source: "asta", sourceId: "oldcarsdata", note: "km non indicati" },
    { date: "2026-05-14", my: 1986, body: "Coupé", price: 235585, currency: "USD", km: 88500, location: "Wayzata, MN (USA)", source: "asta USA", sourceId: "oldcarsdata" },
    { date: "2026-04-25", my: 1989, body: "Coupé", price: 142800, currency: "USD", km: 142100, location: "Costa Mesa, CA (USA)", source: "asta USA", sourceId: "oldcarsdata" },
    { date: "2026-04-25", my: 1989, body: "Coupé", price: 390000, currency: "USD", km: 104500, location: "Costa Mesa, CA (USA)", source: "asta USA", sourceId: "oldcarsdata", note: "prezzo alto per i km dichiarati: probabile Flachbau/speciale", outlier: true },
    { date: "2026-04-10", my: 1986, body: "Coupé", price: 127000, currency: "USD", km: 164200, location: "San Rafael, CA (USA)", source: "asta USA", sourceId: "oldcarsdata" },
    { date: "2026-02-11", my: 1985, body: "Coupé", price: 103000, currency: "EUR", km: 150000, location: "Breda (NL)", source: "asta", sourceId: "classiccom" },
    { date: "2026-02-06", my: 1986, body: "Coupé", price: 121000, currency: "USD", km: 35400, location: "Pompano Beach, FL (USA)", source: "asta USA", sourceId: "oldcarsdata" },
    { date: "2026-01-13", my: 1986, body: "Coupé", price: 184000, currency: "USD", km: 98200, location: "USA", source: "asta USA", sourceId: "driveindex" },
    { date: "2025-11-01", my: 1986, body: "Coupé", price: 181500, currency: "USD", km: 25800, location: "USA", source: "asta USA", sourceId: "driveindex" },
    { date: "2025-10-10", my: 1986, body: "Coupé", price: 241000, currency: "USD", km: 24100, location: "USA", source: "asta USA", sourceId: "driveindex" },
    { date: "2025-10-10", my: 1986, body: "Coupé", price: 161000, currency: "USD", km: 80500, location: "USA", source: "asta USA", sourceId: "driveindex" },
    { date: "2025-09-30", my: 1985, body: "Coupé", price: 125000, currency: "USD", km: 121000, location: "Jacksonville Beach, FL (USA)", source: "asta USA", sourceId: "oldcarsdata" },
    { date: "2025-09-04", my: 1986, body: "Coupé", price: 170000, currency: "USD", km: 93300, location: "USA", source: "asta USA", sourceId: "driveindex" },
    { date: "2025-08-02", my: 1986, body: "Coupé", price: 116000, currency: "USD", km: 209200, location: "USA", source: "asta USA", sourceId: "driveindex" },
    { date: "2025-07-30", my: 1986, body: "Coupé", price: 131000, currency: "USD", km: 25700, location: "USA", source: "asta USA", sourceId: "driveindex" },
    { date: "2025-07-08", my: 1986, body: "Coupé", price: 163000, currency: "USD", km: 197900, location: "USA", source: "asta USA", sourceId: "driveindex" },
    { date: "2025-06-18", my: 1986, body: "Coupé", price: 138930, currency: "USD", km: 120700, location: "USA", source: "asta USA", sourceId: "driveindex" },
    { date: "2025-01-23", my: 1985, body: "Coupé", price: 97900, currency: "USD", km: null, location: "USA", source: "asta USA", sourceId: "oldcarsdata" },
    { date: "2024-06-18", my: 1985, body: "Coupé", price: 70000, currency: "USD", km: 114300, location: "Ormond Beach, FL (USA)", source: "asta USA", sourceId: "oldcarsdata" },
    { date: "2022-10-20", my: 1985, body: "Coupé", price: 70500, currency: "USD", km: 99300, location: "Miami, FL (USA)", source: "asta USA", sourceId: "oldcarsdata" },
    { date: "2022-01-03", my: 1985, body: "Coupé", price: 131000, currency: "USD", km: 67000, location: "Rego Park, NY (USA)", source: "asta USA", sourceId: "oldcarsdata" },
    { date: "2020-10-30", my: 1985, body: "Coupé", price: 57500, currency: "USD", km: 171300, location: "USA", source: "asta USA", sourceId: "oldcarsdata" }
  ],

  // Annunci attivi (prezzi richiesti, NON prezzi di vendita). Ottobre 2026.
  listings: [
    { date: "2026-10", my: 1986, body: "Coupé", km: 151097, country: "NL", price: 139500, currency: "EUR", seller: "Metropole (dealer)", sourceId: "classictrader" },
    { date: "2026-10", my: 1988, body: "Coupé", km: 88997, country: "BE", price: 148000, currency: "EUR", seller: "dealer", sourceId: "classictrader" },
    { date: "2026-10", my: 1988, body: "Cabriolet", km: 155870, country: "BE", price: 133950, currency: "EUR", seller: "dealer", sourceId: "classictrader" },
    { date: "2026-10", my: 1988, body: "Coupé", km: 63200, country: "SE", price: 210000, currency: "EUR", seller: "Classix by Schiebler", sourceId: "classictrader" },
    { date: "2026-10", my: 1989, body: "Coupé", km: 175000, country: "DE", price: 159500, currency: "EUR", seller: "dealer", sourceId: "classictrader" },
    { date: "2026-10", my: 1987, body: "Cabriolet", km: 66800, country: "DE", price: 137500, currency: "EUR", seller: "dealer", sourceId: "classictrader" },
    { date: "2026-10", my: 1989, body: "Cabriolet", km: 110000, country: "IT", price: 145000, currency: "EUR", seller: "dealer", sourceId: "classictrader" },
    { date: "2026-10", my: 1988, body: "n/d", km: 86860, country: "NL", price: 99500, currency: "EUR", seller: "dealer", sourceId: "autoscout24" },
    { date: "2026-10", my: 1988, body: "Cabriolet", km: 63058, country: "NL", price: 199900, currency: "EUR", seller: "dealer", sourceId: "autoscout24" },
    { date: "2026-10", my: 1987, body: "n/d", km: 89000, country: "BE", price: 148000, currency: "EUR", seller: "dealer", sourceId: "autoscout24" },
    { date: "2026-10", my: 1989, body: "Cabriolet", km: 47683, country: "NL", price: 129995, currency: "EUR", seller: "dealer", sourceId: "autoscout24" },
    { date: "2026-10", my: 1987, body: "n/d", km: 121630, country: "BE", price: 145900, currency: "EUR", seller: "dealer", sourceId: "autoscout24" },
    { date: "2026-10", my: 1987, body: "n/d", km: 65975, country: "DE", price: 199000, currency: "EUR", seller: "dealer", sourceId: "autoscout24" },
    { date: "2026-10", my: 1988, body: "Coupé", km: 201750, country: "DE", price: 229911, currency: "EUR", seller: "dealer", sourceId: "autoscout24" },
    { date: "2026-08", my: 1986, body: "Coupé", km: 167000, country: "DE", price: 117000, currency: "EUR", seller: "Kickdown (asta)", sourceId: "classiccom" },
    { date: "2026-10", my: 1986, body: "Coupé", km: 14500, country: "US", price: 339699, currency: "USD", seller: "Merit Partners", sourceId: "classiccom" },
    { date: "2026-10", my: 1986, body: "Coupé", km: 96600, country: "US", price: 199900, currency: "USD", seller: "Gallery Junction", sourceId: "classiccom", note: "ultimo prezzo richiesto" },
    { date: "2026-09", my: 1987, body: "Coupé", km: 16100, country: "US", price: 360000, currency: "USD", seller: "Dark Horse Motorcars", sourceId: "classiccom" },
    { date: "2026-09", my: 1987, body: "Coupé", km: 46700, country: "US", price: 249000, currency: "USD", seller: "Aventura Motors", sourceId: "classiccom" },
    { date: "2026-09", my: 1987, body: "Coupé", km: 101400, country: "US", price: 149900, currency: "USD", seller: "Autohaus of Naples", sourceId: "classiccom", note: "modificata" },
    { date: "2026-07", my: 1986, body: "Coupé", km: 17700, country: "US", price: 259947, currency: "USD", seller: "Exotic Motorsports of Oklahoma", sourceId: "classiccom", note: "modificata" },
    { date: "2026-07", my: 1988, body: "Coupé", km: 85300, country: "US", price: 179990, currency: "USD", seller: "Sport Cars Lux", sourceId: "classiccom" },
    { date: "2025-08", my: 1988, body: "Coupé", km: 11300, country: "US", price: 365000, currency: "USD", seller: "Mouse Motors", sourceId: "classiccom" },
    { date: "2026-09", my: 1989, body: "Coupé", km: 132000, country: "UK", price: 175000, currency: "GBP", seller: "Broad Arrow Private Sales", sourceId: "classiccom", note: "Turbo LE, guida a destra" },
    { date: "2026-08", my: 1989, body: "Coupé", km: 114300, country: "US", price: 267991, currency: "USD", seller: "dealer", sourceId: "classiccom", note: "ultimo prezzo richiesto" }
  ],

  sources: [
    { id: "hagerty_insider", name: "Hagerty Insider — «The rise, fall, and resurgence of Porsche's 911 Turbo (930)» (J. Hewitt, 5 ago 2022) + Hagerty Valuation Tools", url: "https://www.hagerty.com/media/market-trends/hagerty-insider/the-rise-fall-and-resurgence-of-the-porsche-911-turbo/", accessed: "2026-10-25", notes: "Valori di listino per condizione; lo storico completo del grafico Hagerty richiede login." },
    { id: "hagerty_uk", name: "Hagerty UK Price Guide — 911 Turbo (930) 3.3 Coupé 1986/1989", url: "https://www.hagerty.co.uk/valuation/tool/results/?y=1989&mk=Porsche&md=911&sm=Turbo+%28930%29+3.3&cc=3299&b=Coupe", accessed: "2026-10-25" },
    { id: "oldcarsdata", name: "Oldcarsdata — Porsche 930 price history e pagine per model year", url: "https://oldcarsdata.com/porsche/930/price-history", accessed: "2026-10-25", notes: "Aggrega 19 fonti d'asta USA (BaT, Cars&Bids, Mecum…)." },
    { id: "conceptcarz_1989", name: "Conceptcarz — 1989 Porsche 911 Turbo (930) auction results", url: "https://www.conceptcarz.com/valuation/9779/porsche-911-turbo-type-930.aspx", accessed: "2026-10-25" },
    { id: "conceptcarz_1987", name: "Conceptcarz — 1987 Porsche 911 Turbo auction results", url: "https://www.conceptcarz.com/valuation/9320/porsche-911-turbo.aspx", accessed: "2026-10-25" },
    { id: "classiccom", name: "CLASSIC.COM — Porsche 911 Turbo Coupe 3.3 (930) market", url: "https://www.classic.com/m/porsche/911/g-body/930/turbo-33/coupe/", accessed: "2026-10-25", notes: "Statistiche a 12 mesi gratuite; storico a pagamento (Classic Insider)." },
    { id: "classicvaluer", name: "The Classic Valuer (UK) — 911 (930) Turbo Coupe", url: "https://www.theclassicvaluer.com/cars/porsche/911-(930)-turbo-coupe", accessed: "2026-10-25" },
    { id: "driveindex", name: "DriveIndex — 1986 Porsche 911 Turbo (930)", url: "https://driveindex.com/cars/porsche/911-turbo/1986", accessed: "2026-10-25" },
    { id: "finder911", name: "911finder.de — Preisentwicklung Porsche 911 G-Modell Turbo (dati 911finder + MarqueScope SOLD-Archiv)", url: "https://www.911finder.de/preisentwicklung-porsche-911-g-modell-turbo", accessed: "2026-10-25" },
    { id: "chromradar", name: "Chromradar.de — Marktwert Porsche 930 Turbo (Stand mag/ott 2026)", url: "https://chromradar.de/marktwert/porsche/930-turbo", accessed: "2026-10-25" },
    { id: "classictrader", name: "Classic Trader — annunci Porsche 911 (930)", url: "https://www.classic-trader.com/it/automobili/search/porsche/911/930", accessed: "2026-10-25" },
    { id: "autoscout24", name: "AutoScout24.it — annunci Porsche 930 3.3 Turbo", url: "https://www.autoscout24.it/lst/porsche/930/ve_3.3-turbo", accessed: "2026-10-25" }
  ]
};
