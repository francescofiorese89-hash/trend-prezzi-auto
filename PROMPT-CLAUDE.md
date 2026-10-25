# Prompt per continuare il lavoro da un altro PC

Il repository è la fonte di verità: tutto ciò che serve a Claude è qui dentro (README.md, data/_template.js,
l'esempio completo data/porsche-964-carrera-coupe.js). Copia uno dei due prompt qui sotto.

## A. Claude Code sul web (consigliato: modifica e pubblica da solo)

Apri https://claude.ai/code, crea una sessione sul repository `francescofiorese89-hash/trend-prezzi-auto` e incolla:

```
Lavora sul repository francescofiorese89-hash/trend-prezzi-auto (branch main). È l'app «Trend prezzi auto»: pagina statica (index.html, app.js, styles.css) che mostra storico quotazioni, quotazioni attuali, vendite recenti, annunci e novità di auto d'epoca, un modello per file nella cartella data/. È pubblicata su GitHub Pages (https://francescofiorese89-hash.github.io/trend-prezzi-auto/) e una routine cloud giornaliera (ore 20:00 italiane) aggiunge gli annunci nuovi e crea i modelli richiesti in data/richieste.txt.

Prima di toccare qualcosa leggi README.md, data/_template.js e data/porsche-964-carrera-coupe.js (esempio completo di un modello). Regole: non cambiare la struttura dei file dati; cifre sempre nella valuta della fonte; esemplari speciali (RS, Turbo, km bassissimi, prezzi anomali) marcati con outlier: true; mai inventare numeri, ogni dato ha fonte con URL e data; testi in italiano; dopo ogni modifica esegui node --check sui file JavaScript, fai commit con messaggio chiaro e push su main (la pagina si aggiorna da sola).

Cosa ti chiedo oggi: [SCRIVI QUI, es. «aggiungi il modello Ferrari 328 GTS 1985-1989, tenendo separata la GTB» oppure «aggiorna le quotazioni della Porsche 930» oppure «aggiungi all'app un filtro per paese negli annunci»]

Per un nuovo modello fai la ricerca completa descritta nel README: serie storiche per anno (Conceptcarz valuation, Oldcarsdata price history, Hagerty UK e USA, The Classic Valuer, DriveIndex, Chromradar, 911finder per le Porsche), quotazioni attuali per mercato (USA, UK, Germania, Europa) con una voce headline: true, vendite reali degli ultimi 12-24 mesi, annunci attuali da Classic Trader e AutoScout24.it, fonti con URL e data; poi registra il modello in data/index.js. Alla fine riassumi in italiano cosa hai trovato e quali fonti non sei riuscito a leggere.
```

## B. Chat normale su claude.ai (ricerca e file da incollare)

La chat non può scrivere nel repository: fa la ricerca e ti restituisce i file, che incolli tu su GitHub
(«Add file → Create new file» nella cartella data/, poi modifica di data/index.js). Incolla:

```
Sto costruendo «Trend prezzi auto», un'app che traccia prezzi e annunci di auto d'epoca. I dati vivono in un repository GitHub pubblico: https://github.com/francescofiorese89-hash/trend-prezzi-auto (un file JavaScript per modello nella cartella data/, registro in data/index.js, modello vuoto in data/_template.js, esempio completo in data/porsche-964-carrera-coupe.js, istruzioni in README.md). Tu non puoi scrivere nel repository: fai la ricerca e restituiscimi il contenuto dei file, che incollo io su GitHub.

Modello da aggiungere: [MARCA, MODELLO, ANNI, variante di riferimento, varianti da tenere separate]

Fai così:
1. Leggi dal repository questi file per rispettare esattamente struttura e stile:
   https://raw.githubusercontent.com/francescofiorese89-hash/trend-prezzi-auto/main/README.md
   https://raw.githubusercontent.com/francescofiorese89-hash/trend-prezzi-auto/main/data/_template.js
   https://raw.githubusercontent.com/francescofiorese89-hash/trend-prezzi-auto/main/data/porsche-964-carrera-coupe.js
2. Cerca sul web: storico quotazioni per anno (Conceptcarz valuation, Oldcarsdata price history, Hagerty USA e UK, The Classic Valuer, DriveIndex, Chromradar, 911finder se Porsche), quotazioni attuali per mercato (USA, UK, Germania, Europa), vendite reali degli ultimi 12-24 mesi, annunci attuali su Classic Trader e AutoScout24.it, tutto con URL e data di consultazione.
3. Restituisci: (a) il file completo data/<marca>-<modello>-<anni>.js pronto da incollare, con model, meta, primarySeriesId, cycleSeriesId, indexBaseYear, reading (4-6 paragrafi in italiano con le cifre chiave), series, snapshot (una voce con headline: true), sales (outlier: true per esemplari speciali), listings, sources; (b) la riga da aggiungere in data/index.js; (c) un riepilogo in italiano del trend e delle fonti non raggiungibili.
Regole: cifre nella valuta della fonte, chilometri (miglia x1,609), date YYYY-MM-DD, nessun numero inventato, virgolette doppie, indentazione 2 spazi, JavaScript valido.
```

## Consiglio

Su claude.ai crea un Progetto «Trend prezzi auto» e metti il prompt B nelle istruzioni del progetto (e il README tra
le conoscenze): da qualsiasi PC basta aprire il progetto e scrivere il modello da cercare.

## Scorciatoie che non richiedono Claude

- Nuovo modello senza ricerca manuale: una riga in `data/richieste.txt` (link in cima all'app); la routine delle 20:00 fa tutto.
- Routine (pausa, orario, esecuzione immediata, log): https://claude.ai/code/routines/trig_01Pah6b8SuzEwaqZss8UbQzx
