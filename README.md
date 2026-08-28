# PokeNeltusoAPP

<p align="center">
  <img src="./src/assets/logoapp.png" alt="Logo di PokeNeltusoAPP" width="150" />
</p>

<p align="center">
  Una Pokédex responsive realizzata con Vue 3, TypeScript e PokéAPI.
</p>

<p align="center">
  <a href="https://neltj.github.io/miniprogettopoke/">Demo online</a>
  ·
  <a href="https://pokeapi.co/">PokéAPI</a>
</p>

## Descrizione

PokeNeltusoAPP è una Single Page Application didattica che permette di esplorare i Pokémon, cercarli nell'intera PokéAPI, consultarne i dettagli e salvare i preferiti nel browser.

Il progetto è stato sviluppato per approfondire Vue 3 e il flusso completo di un'applicazione frontend: componenti riutilizzabili, Composition API, routing, chiamate HTTP, gestione asincrona, TypeScript, persistenza locale, cache e deploy automatico.

## Funzionalità

- Lista paginata con 20 Pokémon per pagina.
- Pagina, filtri e variante selezionata salvati nei parametri dell'URL.
- Filtro locale per nome sui Pokémon presenti nella pagina corrente.
- Filtro locale per tipo.
- Ricerca globale di un Pokémon nell'intera API.
- Schede responsive con immagine, tipi e azioni.
- Passaggio tra immagine normale e shiny senza ulteriori richieste HTTP.
- Pagina di dettaglio con:
  - altezza e peso;
  - tipi e abilità, comprese quelle nascoste;
  - statistiche base visualizzate con barre di avanzamento;
  - categoria e descrizione localizzata, con fallback in inglese;
  - varianti disponibili per la specie;
  - catena evolutiva ricorsiva e navigabile.
- Risoluzione dei nomi di specie verso la varietà predefinita, utile per casi come `aegislash` e `giratina`.
- Preferiti persistenti tramite `localStorage`.
- Ordinamento alfabetico dei preferiti e rimozione singola o completa.
- Stati di caricamento, errore, retry, risultato vuoto e pagina 404.
- Cache in memoria per ridurre le richieste ripetute alla PokéAPI.
- Layout responsive con supporto automatico al tema chiaro/scuro del sistema.

## Come usare l'app

1. Apri la sezione **Pokemons**.
2. Usa **Filtra questa pagina** per cercare tra i 20 Pokémon già caricati.
3. Seleziona un tipo per restringere ulteriormente i risultati della pagina corrente.
4. Usa **Cerca un Pokémon in tutta l'API** per aprire direttamente un Pokémon non presente nella pagina visualizzata.
5. Premi **Dettagli** per consultare informazioni, statistiche, varianti ed evoluzioni.
6. Usa il pulsante dell'immagine per alternare la versione normale e shiny.
7. Aggiungi un Pokémon ai preferiti e ritrovalo nella sezione **Preferiti** anche dopo aver ricaricato la pagina.

> Il filtro per nome e quello per tipo operano sui 20 Pokémon della pagina corrente. La ricerca globale interroga invece direttamente la risorsa del Pokémon richiesto e richiede un nome esatto.

## Tecnologie utilizzate

- [Vue 3](https://vuejs.org/) con Composition API e `<script setup>`
- [TypeScript](https://www.typescriptlang.org/)
- [Vue Router](https://router.vuejs.org/)
- [Vite](https://vite.dev/)
- [PokéAPI](https://pokeapi.co/)
- CSS responsive con custom properties e media query
- `localStorage` per la persistenza dei preferiti
- ESLint, Oxlint e Prettier per qualità e formattazione
- GitHub Actions e GitHub Pages per il deploy

## Flusso dei dati

```text
View Vue
   ↓
service pokemonApi.ts
   ↓
PokéAPI
   ↓
risposta tipizzata con TypeScript
   ↓
ref / computed
   ↓
componenti dell'interfaccia
```

La lista viene caricata in due fasi:

1. `getPokemonList(limit, offset)` recupera nome e URL dei Pokémon della pagina.
2. `Promise.all()` recupera in parallelo i dettagli necessari per immagini, versioni shiny e tipi.

La pagina di dettaglio combina più risorse collegate:

```text
/pokemon/{name}
   ↓ species.url
/pokemon-species/{name}
   ↓ evolution_chain.url
/evolution-chain/{id}
```

`getPokemonDetailsWithSpecies()` gestisce sia un nome Pokémon valido sia un nome di specie. Se il primo endpoint restituisce `404`, la funzione cerca la specie e ne carica la varietà predefinita.

## Stato nell'URL

Vue Router usa la hash history, compatibile con GitHub Pages. I parametri di query mantengono lo stato importante dell'interfaccia:

```text
#/pokemons?page=3&filter=char&type=fire
#/pokemons/vulpix?variety=vulpix-alola
```

Quando si apre un dettaglio dalla lista, pagina e filtri vengono trasferiti nei parametri `fromPage`, `fromFilter` e `fromType`. In questo modo il collegamento di ritorno ricostruisce la vista precedente.

## Preferiti e cache

I nomi dei preferiti vengono salvati nel browser con la chiave:

```text
pokemon-favorites
```

Il contenuto letto da `localStorage` viene validato prima dell'utilizzo. I preferiti rimangono disponibili dopo un refresh, ma sono locali al browser e al dispositivo in uso.

Il servizio API utilizza inoltre cache basate su `Map` per:

- pagine della lista;
- dettagli dei Pokémon;
- dati delle specie;
- catene evolutive.

Queste cache vivono in memoria e vengono azzerate quando la pagina viene ricaricata.

## Struttura del progetto

```text
src/
├── assets/                 # Stili globali e immagini
├── components/pokemon/     # Componenti riutilizzabili della Pokédex
├── composables/            # Stato asincrono e gestione preferiti
├── router/                 # Configurazione delle route
├── services/               # Chiamate alla PokéAPI e cache
├── types/                  # Interfacce TypeScript delle risposte API
├── views/                  # Pagine collegate al router
├── App.vue                 # Layout e navigazione principale
└── main.ts                 # Avvio dell'applicazione
```

Componenti principali:

- `PokemonCard.vue`: card riutilizzabile per lista e preferiti.
- `PokemonImageToggle.vue`: alterna sprite normale e shiny con stato locale.
- `PokemonPagination.vue`: riceve lo stato dal padre ed emette gli eventi di navigazione.
- `EvolutionNodeItem.vue`: componente ricorsivo che visualizza le evoluzioni annidate.
- `useAsyncState.ts`: centralizza `loading`, `error`, `data` ed esecuzione delle Promise.
- `usePokemonFavorites.ts`: gestisce preferiti reattivi e persistenza.
- `pokemonApi.ts`: separa la comunicazione HTTP dall'interfaccia.

## Route

| Route logica | Contenuto |
| --- | --- |
| `/` e `/home` | Pagina iniziale |
| `/pokemons` | Lista, filtri, ricerca e paginazione |
| `/pokemons/:name` | Dettagli del Pokémon |
| `/favorites` | Pokémon salvati nel browser |
| `/about` | Pagina informativa |
| `/experiments` | Pagina sperimentale |
| `/stories` | Pagina dedicata alle storie |
| Qualsiasi route sconosciuta | Pagina 404 |

## Requisiti

- Node.js `^22.18.0 || >=24.12.0`
- pnpm 10
- Connessione Internet per recuperare i dati dalla PokéAPI

Puoi verificare le versioni installate con:

```bash
node --version
pnpm --version
```

## Installazione locale

Clona il repository:

```bash
git clone https://github.com/Neltj/miniprogettopoke.git
cd miniprogettopoke
```

Installa le dipendenze:

```bash
pnpm install
```

Avvia il server di sviluppo:

```bash
pnpm dev
```

Vite mostrerà nel terminale l'indirizzo locale, normalmente `http://localhost:5173`.

## Comandi disponibili

| Comando | Descrizione |
| --- | --- |
| `pnpm dev` | Avvia Vite con hot reload |
| `pnpm type-check` | Controlla i tipi con `vue-tsc` |
| `pnpm lint` | Esegue Oxlint ed ESLint applicando le correzioni disponibili |
| `pnpm format` | Formatta i file in `src/` con Prettier |
| `pnpm build` | Esegue type-check e genera la build di produzione |
| `pnpm preview` | Avvia localmente la build presente in `dist/` |

Prima di pubblicare modifiche:

```bash
pnpm run type-check
pnpm run build
```

## Deploy su GitHub Pages

Il deploy è automatizzato dal workflow `.github/workflows/deploy.yml`.

Ogni push sul branch `main` esegue:

1. checkout del repository;
2. configurazione di pnpm e Node.js;
3. installazione con lockfile;
4. type-check e build;
5. pubblicazione della cartella `dist` su GitHub Pages.

Vite è configurato con:

```ts
base: '/miniprogettopoke/'
```

Se il repository viene rinominato, anche questo valore deve essere aggiornato.

## Accessibilità e interfaccia

L'interfaccia include label associate agli input, pulsanti con stato `disabled`, attributi `aria-pressed`, messaggi aggiornati tramite `aria-live`, navigazione semantica e stati testuali alternativi quando un'immagine non è disponibile.

La griglia, la navigazione, la ricerca e la paginazione si adattano agli schermi piccoli. Il tema segue automaticamente `prefers-color-scheme` del sistema operativo.

## Limiti attuali e possibili sviluppi

- I filtri locali operano soltanto sui Pokémon già caricati nella pagina corrente.
- La ricerca globale richiede il nome esatto.
- I preferiti non sono sincronizzati tra browser o dispositivi.
- La cache è solo in memoria e non sopravvive al refresh.
- L'app dipende dalla disponibilità della PokéAPI.
- PokéAPI rappresenta forme e varietà in modo non sempre uniforme; l'app gestisce le varietà esposte dalla specie, ma non implementa ancora un browser completo delle risorse `pokemon-form`.
- Le pagine About, Experiments e Stories contengono attualmente contenuti semplici.
- Non è ancora presente una suite di test automatici.

Possibili evoluzioni del progetto:

- test unitari con Vitest e test end-to-end;
- cache persistente con scadenza;
- ricerca globale con suggerimenti e debounce;
- gestione completa delle forme alternative;
- traduzione delle etichette e dei nomi restituiti dall'API.

## Crediti

I dati e gli sprite sono forniti da [PokéAPI](https://pokeapi.co/).

Questo progetto è stato realizzato a scopo didattico. Pokémon e i relativi nomi e immagini appartengono ai rispettivi proprietari.
