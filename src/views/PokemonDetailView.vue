<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import type { PokemonDetailsResponse } from '@/types/pokemonTypes'
import { getPokemonDetails, PokemonApiError } from '@/services/pokemonApi'
import { usePokemonFavorites } from '@/composables/usePokemonFavorites'
import { useAsyncState } from '@/composables/useAsyncState'
import PokemonImageToggle from '@/components/pokemon/PokemonImageToggle.vue'

const { data: pokemon, loading, error, execute } = useAsyncState<PokemonDetailsResponse>()

const props = defineProps<{
  name: string
}>()

const { isFavorite, toggleFavorite } = usePokemonFavorites()

const favorite = computed(() => {
  return isFavorite(props.name)
})

const canRetry = ref<boolean>(false)
const route = useRoute()

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

async function loadPokemonDetails() {
  canRetry.value = false
  await execute(
    () => {
      return getPokemonDetails(props.name)
    },

    getPokemonDetailsError,
  )
}

onMounted(loadPokemonDetails)
</script>

<template>
  <main class="page-shell detail-page">
    <RouterLink
      class="back-link"
      v-if="cameFromFavorites"
      :to="{
        name: 'favorites',
      }"
    >
      Torna ai preferiti
    </RouterLink>

    <RouterLink
      class="back-link"
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
      <h1 class="page-title">Dettaglio di {{ name }}</h1>
      <PokemonImageToggle
        variant="detail"
        :normal-image="pokemon.sprites.front_default"
        :shiny-image="pokemon.sprites.front_shiny"
        :alt="`Immagine di ${pokemon.name}`"
      />

      <p>Altezza: {{ pokemon.height / 10 }} m</p>
      <p>Peso: {{ pokemon.weight / 10 }} kg</p>

      <h2>Tipi</h2>

      <ul class="pokemon-details__types">
        <li
          v-for="pokemonType in pokemon.types"
          :key="pokemonType.type.name"
          :class="[
            'pokemon-type',
            `pokemon-type--${pokemonType.type.name}`,
          ]"
        >
          {{ pokemonType.type.name }}
        </li>
      </ul>

      <button
        class="button"
        type="button"
        :aria-pressed="favorite"
        @click="toggleFavorite(props.name)"
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
</style>
