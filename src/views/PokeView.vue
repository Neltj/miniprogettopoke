<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PokemonCard from '@/components/pokemon/PokemonCard.vue'
import type { PokemonListItem, PokemonResult } from '@/types/pokemonTypes'
import { getPokemonDetails, getPokemonList } from '@/services/pokemonApi'
import PokemonPagination from '@/components/pokemon/PokemonPagination.vue'
import { usePokemonFavorites } from '@/composables/usePokemonFavorites'
import { useAsyncState } from '@/composables/useAsyncState'
const { loading, error, execute } = useAsyncState<void>()
const { isFavorite, toggleFavorite } = usePokemonFavorites()

const route = useRoute()

const router = useRouter()

const pokemon = ref<PokemonListItem[]>([])

const limit = 20

const validPokemonTypes = new Set([
  'bug',
  'dark',
  'dragon',
  'electric',
  'fairy',
  'fighting',
  'fire',
  'flying',
  'ghost',
  'grass',
  'ground',
  'ice',
  'normal',
  'poison',
  'psychic',
  'rock',
  'steel',
  'water',
])

function isValidPokemonType(value: unknown): value is string {
  return typeof value === 'string' && validPokemonTypes.has(value)
}

const totalPokemon = ref(0)

const searchTerm = ref<string>('')

function searchPokemon() {
  const name = searchTerm.value.trim().toLowerCase()

  if (!name) {
    return
  }

  goToPokemonDetails(name)
}

const selectedType = computed({
  get() {
    const type = route.query.type
    if (!isValidPokemonType(type)) {
      return ''
    }

    return type
  },
  set(value: string) {
    router.replace({
      name: 'pokemons',
      query: {
        ...route.query,
        type: value || undefined,
      },
    })
  },
})

const filterTerm = computed({
  get() {
    const filter = route.query.filter

    if (typeof filter !== 'string') {
      return ''
    }

    return filter
  },

  set(value: string) {
    router.replace({
      name: 'pokemons',
      query: {
        ...route.query,
        filter: value || undefined,
      },
    })
  },
})

const filteredPokemon = computed(() => {
  const search = filterTerm.value.trim().toLowerCase()
  const type = selectedType.value

  return pokemon.value.filter((poke) => {
    const matchesName = !search || poke.name.toLowerCase().includes(search)
    const matchesType = !type || poke.types.includes(type)

    return matchesName && matchesType
  })
})

function clearFilters() {
  router.replace({
    name: 'pokemons',
    query: {
      ...route.query,
      filter: undefined,
      type: undefined,
    },
  })
}

const availableTypes = computed(() => {
  const types = pokemon.value.flatMap((poke) => poke.types)

  return [...new Set(types)].sort()
})

const offset = computed(() => {
  return (currentPage.value - 1) * limit
})

const totalPages = computed(() => {
  return Math.ceil(totalPokemon.value / limit)
})

//pagina corrente
const currentPage = computed(() => {
  const page = Number(route.query.page)
  if (!Number.isInteger(page) || page < 1) {
    return 1
  }

  return page
})

//funzione principale per caricare i pokemon
async function loadPokemon(): Promise<void> {
  await execute(async () => {
    const data = await getPokemonList(limit, offset.value)

    totalPokemon.value = data.count
    if (totalPages.value > 0 && currentPage.value > totalPages.value) {
      await router.replace({
        name: 'pokemons',
        query: {
          ...route.query,
          page: totalPages.value,
        },
      })

      return
    }

    const pokemonWithImages = await Promise.all(
      data.results.map(async (poke: PokemonResult) => {
        const pokeData = await getPokemonDetails(poke.name)
        return {
          name: poke.name,
          url: poke.url,
          image: pokeData.sprites.front_default,
          shinyImage: pokeData.sprites.front_shiny,
          types: pokeData.types.map((pokemonType) => pokemonType.type.name),
        }
      }),
    )
    pokemon.value = pokemonWithImages
  }, 'Impossibile caricare i Pokémon.')
}

function nextPage() {
  if (currentPage.value >= totalPages.value) {
    return
  }

  router.push({
    name: 'pokemons',
    query: {
      ...route.query,
      page: currentPage.value + 1,
    },
  })
}

function previousPage() {
  if (currentPage.value === 1) {
    return
  }

  router.push({
    name: 'pokemons',
    query: {
      ...route.query,
      page: currentPage.value - 1,
    },
  })
}

function goToPokemonDetails(name: string) {
  router.push({
    name: 'pokemon-details',
    params: { name },
    query: {
      fromPage: currentPage.value,
      fromFilter: filterTerm.value,
      fromType: selectedType.value,
    },
  })
}

//watch di type
watch(
  () => route.query.type,
  (type) => {
    if (type !== undefined && !isValidPokemonType(type)) {
      router.replace({
        name: 'pokemons',
        query: {
          ...route.query,
          type: undefined,
        },
      })
    }
  },
  {
    immediate: true,
  },
)

//watch di page
watch(
  () => route.query.page,
  async (pageParam) => {
    const page = Number(pageParam)

    if (!Number.isInteger(page) || page < 1) {
      await router.replace({
        name: 'pokemons',
        query: {
          ...route.query,
          page: 1,
        },
      })

      return
    }

    await loadPokemon()
  },
  { immediate: true },
)
</script>
<template>
  <div class="pokemon">
    <h1 class="page-title">Lista di Pokémon</h1>
  </div>

  <main class="page-shell pokemon-page">
    <section
      class="search-panel"
      aria-label="Ricerca e filtri Pokémon"
    >
      <div class="filter-grid">
        <label class="field" for="pokemon-filter">
          <span>Filtra questa pagina</span>
          <input
            id="pokemon-filter"
            v-model="filterTerm"
            type="search"
            placeholder="Filtra i 20 Pokémon visibili"
          />
        </label>

        <label class="field" for="pokemon-type">
          <span>Filtra per tipo</span>
          <select
            id="pokemon-type"
            v-model="selectedType"
          >
            <option value="">Tutti i tipi</option>
            <option
              v-for="type in availableTypes"
              :key="type"
              :value="type"
            >
              {{ type }}
            </option>
          </select>
        </label>
      </div>

      <button
        class="button button--secondary"
        type="button"
        :disabled="!filterTerm && !selectedType"
        @click="clearFilters"
      >
        Azzera filtri
      </button>

      <form
        class="global-search"
        @submit.prevent="searchPokemon"
      >
        <label class="field" for="pokemon-search">
          <span>Cerca un Pokémon in tutta l'API</span>
          <input
            id="pokemon-search"
            v-model="searchTerm"
            type="search"
            placeholder="Es. pikachu"
          />
        </label>
        <button type="submit">Cerca Pokémon</button>
      </form>
    </section>

    <PokemonPagination
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-pokemon="totalPokemon"
      :loading="loading"
      @previous="previousPage"
      @next="nextPage"
    />

    <p
      v-if="loading"
      class="status-message"
    >
      Caricamento in corso...
    </p>
    <div
      v-else-if="error"
      class="status-message"
    >
      <p>{{ error }}</p>
      <button
        type="button"
        @click="loadPokemon"
      >
        Riprova
      </button>
    </div>
    <template v-else>
      <p
        aria-live="polite"
        class="results-count"
      >
        {{ filteredPokemon.length }} Pokemon visualizzati in questa pagina.
      </p>

      <p
        v-if="filteredPokemon.length === 0"
        class="empty-state"
      >
        Nessun Pokémon trovato.
      </p>
      <ul
        v-else
        class="pokemon-grid"
      >
        <PokemonCard
          v-for="poke in filteredPokemon"
          :key="poke.name"
          :name="poke.name"
          :image="poke.image"
          :shiny-image="poke.shinyImage"
          :types="poke.types"
          :favorite="isFavorite(poke.name)"
          @select="goToPokemonDetails"
          @toggle-favorite="toggleFavorite"
        />
      </ul>
    </template>
  </main>
</template>

<style scoped>
.pokemon {
  padding: 1rem 0 0.25rem;
}
</style>
