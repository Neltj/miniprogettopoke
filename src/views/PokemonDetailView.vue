<script setup lang="ts">
import { watch, ref, computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import type {
  PokemonDetailsResponse,
  PokemonSpeciesResponse,
  EvolutionChainResponse,
} from '@/types/pokemonTypes'
import {
  getPokemonDetailsWithSpecies,
  PokemonApiError,
  getEvolutionChain,
} from '@/services/pokemonApi'
import { usePokemonFavorites } from '@/composables/usePokemonFavorites'
import { useAsyncState } from '@/composables/useAsyncState'
import PokemonImageToggle from '@/components/pokemon/PokemonImageToggle.vue'
import EvolutionNodeItem from '@/components/pokemon/EvolutionNodeItem.vue'

const { data: pokemon, loading, error, execute } = useAsyncState<PokemonDetailsResponse>()

const species = ref<PokemonSpeciesResponse | null>(null)
const evolutionChain = ref<EvolutionChainResponse | null>(null)
const selectedVarietyName = ref('')

const props = defineProps<{
  name: string
}>()

const MAX_BASE_STAT = 255

const { isFavorite, toggleFavorite } = usePokemonFavorites()

const favorite = computed(() => {
  const currentPokemonName = pokemon.value?.name
  if (!currentPokemonName) {
    return false
  }

  return isFavorite(currentPokemonName)
})

const canRetry = ref<boolean>(false)
const route = useRoute()
const router = useRouter()

function clearFlavorText(text: string): string {
  return text
    .replace(/[\n\f\r]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const description = computed(() => {
  const entries = species.value?.flavor_text_entries ?? []

  const italianEntry = entries.find((entry) => {
    return entry.language.name === 'it'
  })

  const englishEntry = entries.find((entry) => {
    return entry.language.name === 'en'
  })

  const selectedEntry = italianEntry ?? englishEntry ?? entries[0]

  if (!selectedEntry) {
    return 'Descrizione non disponibile'
  }

  return clearFlavorText(selectedEntry.flavor_text)
})

const pokemonCategory = computed(() => {
  const entries = species.value?.genera ?? []

  const italianEntry = entries.find((entry) => {
    return entry.language.name === 'it'
  })

  const englishEntry = entries.find((entry) => {
    return entry.language.name === 'en'
  })

  return (
    italianEntry?.genus ?? englishEntry?.genus ?? entries[0]?.genus ?? 'Categoria non disponibile'
  )
})

// function flattenEvolutionChain(node: EvolutionNode): string[] {
//   const currentName = node.species.name

//   const nextNames = node.evolves_to.flatMap((child) => {
//     return flattenEvolutionChain(child)
//   })

//   return [currentName, ...nextNames]
// }

// const evolutionNames = computed(() => {
//   if (!evolutionChain.value) {
//     return []
//   }
//   return flattenEvolutionChain(evolutionChain.value.chain)
// })

const hasEvolutions = computed(() => {
  const chain = evolutionChain.value?.chain
  return Boolean(chain && chain.evolves_to.length > 0)
})

function getPokemonDetailsError(error: unknown): string {
  if (error instanceof PokemonApiError && error.status === 404) {
    canRetry.value = false
    return `Il pokemon "${props.name}" non è stato trovato`
  }

  canRetry.value = true
  return 'Impossibile caricare i dettagli del pokemon'
}

const cameFromFavorites = computed(() => {
  return route.query.from === 'favorites'
})

const returnPage = computed(() => {
  const page = Number(route.query.fromPage)

  if (!Number.isInteger(page) || page < 1) {
    return 1
  }

  return page
})

const returnFilter = computed(() => {
  const filter = route.query.fromFilter
  if (typeof filter !== 'string' || !filter) {
    return undefined
  }

  return filter
})

const returnType = computed(() => {
  const type = route.query.fromType
  if (typeof type !== 'string' || !type) {
    return undefined
  }

  return type
})

const availableVarieties = computed(() => {
  return species.value?.varieties ?? []
})

async function loadPokemonDetails() {
  canRetry.value = false
  await execute(
    async () => {
      const queryVariety = route.query.variety

      const identifier =
        typeof queryVariety === 'string' && queryVariety ? queryVariety : props.name

      const { pokemon: pokemonData, species: speciesData } =
        await getPokemonDetailsWithSpecies(identifier)

      species.value = speciesData
      selectedVarietyName.value = pokemonData.name

      const evolutionData = await getEvolutionChain(speciesData.evolution_chain.url)

      evolutionChain.value = evolutionData

      return pokemonData
    },

    getPokemonDetailsError,
  )
}

async function loadSelectedVariety() {
  const varietyName = selectedVarietyName.value
  if (!varietyName || varietyName === pokemon.value?.name) {
    return
  }

  await router.replace({
    query: {
      ...route.query,
      variety: varietyName,
    },
  })
}

watch(
  [() => props.name, () => route.query.variety],
  () => {
    loadPokemonDetails()
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <main class="page-shell detail-page">
    <RouterLink
      v-if="cameFromFavorites"
      class="back-link"
      :to="{
        name: 'favorites',
      }"
    >
      Torna ai preferiti
    </RouterLink>

    <RouterLink
      v-else
      :to="{
        name: 'pokemons',
        query: {
          page: returnPage,
          filter: returnFilter,
          type: returnType,
        },
      }"
    >
      Torna alla lista
    </RouterLink>

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
        v-if="canRetry"
        type="button"
        @click="loadPokemonDetails"
      >
        Riprova
      </button>
    </div>
    <section
      v-else-if="pokemon"
      class="pokemon-details"
    >
      <h1 class="page-title">Dettaglio di {{ pokemon.name }}</h1>
      <PokemonImageToggle
        variant="detail"
        :normal-image="pokemon.sprites.front_default"
        :shiny-image="pokemon.sprites.front_shiny"
        :alt="`Immagine di ${pokemon.name}`"
      />

      <section
        v-if="availableVarieties.length > 1"
        class="pokemon-varieties"
      >
        <label for="pokemon-variety">Variante:</label>
        <select
          id="pokemon-variety"
          v-model="selectedVarietyName"
          @change="loadSelectedVariety"
        >
          <option
            v-for="variety in availableVarieties"
            :key="variety.pokemon.name"
            :value="variety.pokemon.name"
          >
            {{ variety.pokemon.name }}
          </option>
        </select>
      </section>

      <section class="pokemon-description">
        <h2>Descrizione</h2>
        <p>{{ description }}</p>
      </section>

      <p class="pokemon-category">
        <strong>Categoria:</strong>
        {{ pokemonCategory }}
      </p>

      <section
        v-if="evolutionChain && hasEvolutions"
        class="pokemon-evolution"
      >
        <h2>Catena evolutiva</h2>
        <ul class="pokemon-evolution__list">
          <EvolutionNodeItem :node="evolutionChain.chain" />
        </ul>
      </section>

      <p
        v-else-if="evolutionChain"
        class="pokemon-evolution__empty"
      >
        Questo pokemon non ha evoluzioni
      </p>

      <p>Altezza: {{ pokemon.height / 10 }} m</p>
      <p>Peso: {{ pokemon.weight / 10 }} kg</p>

      <h2>Tipi</h2>

      <ul class="pokemon-details__types">
        <li
          v-for="pokemonType in pokemon.types"
          :key="pokemonType.type.name"
          :class="['pokemon-type', `pokemon-type--${pokemonType.type.name}`]"
        >
          {{ pokemonType.type.name }}
        </li>
      </ul>

      <h2>Abilità</h2>
      <ul>
        <li
          v-for="pokemonAbility in pokemon.abilities"
          :key="pokemonAbility.ability.name"
        >
          {{ pokemonAbility.ability.name }}

          <span v-if="pokemonAbility.is_hidden"> (abilità nascosta) </span>
        </li>
      </ul>

      <h2>Statistiche base</h2>
      <ul class="pokemon-stats">
        <li
          v-for="pokemonStat in pokemon.stats"
          :key="pokemonStat.stat.name"
          class="pokemon-stat"
        >
          <div class="pokemon-stat__header">
            <span>{{ pokemonStat.stat.name }}</span>
            <strong>{{ pokemonStat.base_stat }}</strong>
          </div>
          <progress
            class="pokemon-stat__bar"
            :value="pokemonStat.base_stat"
            :max="MAX_BASE_STAT"
            :aria-label="`Statistica ${pokemonStat.stat.name}`"
          >
            {{ pokemonStat.base_stat }}
          </progress>
        </li>
      </ul>

      <button
        class="button"
        type="button"
        :aria-pressed="favorite"
        @click="toggleFavorite(pokemon.name)"
      >
        {{ favorite ? '★ Rimuovi dai preferiti' : '☆ Aggiungi ai preferiti' }}
      </button>
    </section>
  </main>
</template>

<style scoped>
.detail-page {
  display: grid;
  gap: 1.25rem;
}

.back-link {
  justify-self: start;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  background: var(--color-surface-muted);
  font-weight: 650;
}

.pokemon-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}

.pokemon-details h1 {
  margin-bottom: 0;
  text-transform: capitalize;
}

.pokemon-details__types {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.pokemon-details__types li {
  font-weight: 650;
}

.pokemon-stats {
  display: grid;
  width: min(100%, 32rem);
  gap: 0.85rem;
}

.pokemon-stat {
  display: grid;
  gap: 0.35rem;
}

.pokemon-stat__header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  text-transform: capitalize;
}

.pokemon-stat__bar {
  width: 100%;
  height: 0.7rem;
  overflow: hidden;
  border: 0;
  border-radius: 999px;
  background-color: var(--color-background-mute);
  accent-color: var(--color-primary);
}

.pokemon-evolution {
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-muted);
}

.pokemon-evolution h2 {
  margin-bottom: 1rem;
}

.pokemon-evolution__list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  padding: 0;
  list-style: none;
}

.pokemon-evolution__empty {
  color: var(--color-text-muted);
  font-style: italic;
}

.pokemon-stat__bar::-webkit-progress-bar {
  border-radius: inherit;
  background: var(--color-background-mute);
}

.pokemon-stat__bar::-webkit-progress-value {
  border-radius: inherit;
  background: var(--color-primary);
}

.pokemon-stat__bar::-moz-progress-bar {
  border-radius: inherit;
  background: var(--color-primary);
}
</style>
