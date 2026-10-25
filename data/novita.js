// Novità trovate dalla routine giornaliera: una voce per giorno e per modello.
// L'app mostra le voci più recenti e segna come «nuove» quelle successive all'ultima visita.
// Formato di ogni voce:
// { date: "YYYY-MM-DD", modelId: "<id in data/index.js>", summary: "breve riepilogo",
//   items: [ { my: 1991, body: "Coupé C2", km: 120000, country: "IT", price: 95000, currency: "EUR",
//              seller: "dealer", url: "https://...", note: "" } ] }
// Le voci più recenti vanno in cima. Nessuna voce = nessun controllo ancora eseguito.
window.CAR_NEWS = [];
