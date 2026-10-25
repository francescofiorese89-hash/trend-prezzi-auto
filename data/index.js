// Registro dei modelli tracciati. L'app legge questo elenco, popola il selettore e carica
// a richiesta il file indicato in `file`, che deve registrarsi in window.CAR_MODELS[id].
// Per aggiungere un modello: copia data/_template.js, compila i dati, aggiungi una riga qui.
window.CAR_INDEX = [
  {
    id: "porsche-930-turbo-1985-1989",
    make: "Porsche",
    name: "911 Turbo (930) 3.3",
    years: "1985-1989",
    file: "data/porsche-930-turbo.js"
  },
  {
    id: "porsche-964-carrera-coupe-1989-1994",
    make: "Porsche",
    name: "911 (964) Carrera Coupé",
    years: "1989-1994",
    file: "data/porsche-964-carrera-coupe.js"
  }
];
