# Trend prezzi auto d'epoca

App locale (HTML + JavaScript, nessun server) per seguire il trend delle quotazioni di auto d'epoca:
storico delle valutazioni, quotazioni attuali per mercato, vendite reali recenti, annunci in corso
e rilevazioni personali. È progettata per qualsiasi marca/modello/anno: ogni modello è un file dati
registrato in `data/index.js`. Il primo modello tracciato è la **Porsche 911 Turbo (930) 3.3, MY 1985-1989**.

## Come si usa

- **Online, da qualsiasi PC o telefono:** https://francescofiorese89-hash.github.io/trend-prezzi-auto/
  (GitHub Pages: si aggiorna da sola a ogni commit, quindi anche dopo ogni esecuzione della routine).
- **Sul PC:** apri `index.html` con un doppio clic (serve la connessione per caricare Chart.js e i font; senza
  connessione restano le tabelle). Le rilevazioni personali restano nel browser in cui le inserisci.
- In alto scegli il **modello**, la **valuta di lettura** (EUR / USD / GBP) e i **cambi** usati per le conversioni.
- **Trend storico**: vista a indice (anno base = 100, per confrontare fonti in valute diverse) oppure a valore.
  Clic sulla legenda per nascondere una serie; la tabella sotto il grafico riporta gli stessi numeri.
- **Vendite recenti**: filtro per anno modello, mediane a 12 mesi, grafico a dispersione e tabella.
  Gli esemplari speciali (Flachbau, km bassissimi, record) sono esclusi dalle mediane e si mostrano con l'interruttore.
- **Le mie rilevazioni**: inserisci vendite viste di persona, annunci o quotazioni da riviste (es. Ruoteclassiche,
  Classic Data). Restano salvate nel browser (localStorage) e compaiono nel grafico delle vendite. «Copia JSON» le esporta.

## Struttura

```
index.html                 pagina (una sola, tutte le sezioni)
app.js                     logica: caricamento modelli, conversioni, grafici, tabelle, rilevazioni
styles.css                 stile (tema chiaro/scuro automatico)
data/index.js              registro dei modelli -> popola il selettore
data/porsche-930-turbo.js  dati Porsche 911 Turbo (930) 3.3 1985-1989
data/_template.js          modello vuoto per un nuovo file dati
```

## Aggiungere un modello

**Via rapida (da qualsiasi PC):** apri `data/richieste.txt` su GitHub (il link «Scrivila in data/richieste.txt» è
anche in cima all'app), aggiungi una riga sotto `DA FARE` nel formato `Marca | Modello | Anni | Variante | Note`
e salva (commit). La routine delle 20:00 fa la ricerca, crea il file dati, registra il modello e sposta la riga
sotto `FATTE`. Per non aspettare: su https://claude.ai/code/routines premi «Run» sulla routine.

**Via manuale:**

1. Copia `data/_template.js` in `data/<marca>-<modello>-<anni>.js`.
2. Compila le sezioni (tutte facoltative tranne `model` e `meta`):
   - `series`: serie storiche (listini per condizione, mediane d'asta per anno...). Ogni punto ha `t` = anno
     decimale (2016.5 = metà 2016), `value`, `n` (numero vendite), `note`.
   - `snapshot.valuations`: quotazioni attuali per mercato/fonte/condizione. Una voce con `headline: true`
     diventa il quarto indicatore in alto.
   - `sales`: vendite reali con data, anno modello, prezzo e valuta, km, luogo, fonte. `outlier: true` per gli esemplari speciali.
   - `listings`: annunci (prezzi richiesti).
   - `sources`: fonti con URL e data di consultazione; gli `sourceId` nelle altre sezioni puntano qui.
   - `primarySeriesId` (serie per la variazione annua), `cycleSeriesId` (serie per «oggi vs massimo»), `indexBaseYear`, `reading` (paragrafi di lettura).
3. Aggiungi la voce in `data/index.js` con lo stesso `id` e il percorso del file.

Convenzioni: valute ISO, date `YYYY-MM-DD` o `YYYY-MM`, chilometri (miglia x 1,609), cifre nella valuta della fonte.

## Metodo di raccolta (Porsche 930, ottobre 2026)

Fonti consultate e cosa forniscono:

| Fonte | Dato | Note |
|---|---|---|
| Hagerty (USA) | listino per condizione #1-#4, storico 2010-2025 | lo storico completo del grafico richiede login; i punti usati vengono dall'articolo Hagerty Insider (ago 2022) e da schede pubbliche |
| Hagerty UK | listino Fair/Good/Excellent/Concours in GBP | nessuno storico |
| Oldcarsdata | mediane annuali d'asta 2016-2026 (tutte le 930), mediane a 12 mesi per anno modello, vendite singole | aggrega 19 fonti USA |
| Conceptcarz | mediane annuali d'asta 2012-2026 per MY 1987 e 1989 | campioni annuali piccoli |
| CLASSIC.COM | media/min/max a 12 mesi, benchmark CMB, annunci e vendite | lo storico è a pagamento |
| The Classic Valuer (UK) | mediana vendite dal 2020, elenco vendite in GBP | |
| DriveIndex | valore stimato e vendite MY 1986 | |
| 911finder.de | andamento valori Europa 2012-2025, mediane vendite Europa giu-2026 (MarqueScope) | in EUR |
| Chromradar.de | valori per condizione (Zustand 1-5) in EUR | |
| Classic Trader, AutoScout24 | annunci europei in EUR | prezzi richiesti |

Non disponibili online: quotazioni Ruoteclassiche (cartaceo) e Classic Data a pagamento. Vanno inserite a mano nelle rilevazioni.

## Aggiornamento automatico (routine cloud)

Il progetto vive in un repository GitHub privato. Una routine Claude Code nel cloud gira ogni giorno alle 20:00
(ora italiana): controlla gli annunci dei modelli registrati in `data/index.js`, aggiunge le auto nuove alla
sezione `listings` del file dati del modello (con `url` e `addedOn`), scrive una voce in `data/novita.js` e fa il
commit. L'app mostra le novità nel riquadro «Novità in vendita» e marca come nuove quelle successive all'ultima
visita (pulsante «Segna tutto come visto»).

Per vedere i dati aggiornati sul PC: doppio clic su `aggiorna.cmd` (esegue `git pull` e apre l'app).
La routine («Trend prezzi auto — annunci giornalieri», cron `0 19 * * *` UTC) si gestisce da
https://claude.ai/code/routines/trig_01Pah6b8SuzEwaqZss8UbQzx (pausa, modifica dell'orario, esecuzione manuale, log delle esecuzioni).
Repository: https://github.com/francescofiorese89-hash/trend-prezzi-auto (privato).

## Prossimi passi possibili

- Aggiungere altri modelli con lo stesso processo di ricerca (file dati + voce nel registro).
- Script di aggiornamento periodico che legge le fonti aperte (Oldcarsdata, Conceptcarz, Classic Valuer) e aggiorna il file dati.
- Cambio EUR/USD aggiornato automaticamente invece che impostato a mano.
- Importazione del JSON delle rilevazioni per spostarle su un altro browser o unirle al file dati.
