<script setup lang="ts">
import { usePokemonFavorites } from '@/composables/usePokemonFavorites'
import { watch, computed } from 'vue'
import { useAsyncState } from '@/composables/useAsyncState'
import PokemonCard from '@/components/pokemon/PokemonCard.vue'
import type { PokemonDetailsResponse } from '@/types/pokemonTypes'
import { getPokemonDetails } from '@/services/pokemonApi'
import router from '@/router'

const { favoriteNames, isFavorite, toggleFavorite, clearFavorites } = usePokemonFavorites()

const { data: favoritePokemon, loading, error, execute } = useAsyncState<PokemonDetailsResponse[]>()

const sortedFavoritePokemon = computed(() => {
  return [...(favoritePokemon.value ?? [])].sort((a, b) => {
    return a.name.localeCompare(b.name)
  })
})

function goToPokemonDetails(name: string): void {
  router.push({
    name: 'pokemon-details',
    params: { name },
    query: {
      from: 'favorites',
    },
  })
}

function confirmClearFavorites(): void {
  const confirmed = window.confirm('Vuoi davvero rimuovere tutti i pokemon dai preferiti?')

  if (!confirmed) {
    return
  }
  clearFavorites()
}

async function loadFavoritePokemon(): Promise<void> {
  if (favoriteNames.value.length === 0) {
    favoritePokemon.value = []
    return
  }

  await execute(() => {
    return Promise.all(
      favoriteNames.value.map((name) => {
        return getPokemonDetails(name)
      }),
    )
  }, 'Impossibile caricare i pokemon preferiti')
}

watch(favoriteNames, loadFavoritePokemon, { immediate: true })
</script>

<template>
  <main class="page-shell favorites-page">
    <h1 class="page-title">Pokémon preferiti</h1>
    <p
      v-if="favoriteNames.length > 0"
      class="results-count"
    >
      Hai {{ favoriteNames.length }} Pokémon preferiti.
    </p>
    <button
      v-if="favoriteNames.length > 0"
      class="button button--secondary"
      type="button"
      @click="confirmClearFavorites"
    >
      Rimuovi i preferiti
    </button>
    <p
      v-if="loading"
      class="status-message"
    >
      Caricamento dei preferiti
    </p>

    <div
      v-else-if="error"
      class="status-message"
    >
      <p>{{ error }}</p>

      <button
        type="button"
        @click="loadFavoritePokemon"
      >
        Riprova
      </button>
    </div>

    <p
      v-else-if="favoriteNames.length === 0"
      class="empty-state"
    >
      Non hai Pokémon preferiti
    </p>
    <ul
      v-else
      class="pokemon-grid"
    >
      <PokemonCard
        v-for="pokemon in sortedFavoritePokemon"
        :key="pokemon.name"
        :name="pokemon.name"
        :image="pokemon.sprites.front_default"
        :shiny-image="pokemon.sprites.front_shiny"
        :types="pokemon.types.map((pokemonType) => pokemonType.type.name)"
        :favorite="isFavorite(pokemon.name)"
        @select="goToPokemonDetails"
        @toggle-favorite="toggleFavorite"
      />
    </ul>
  </main>
</template>

<style scoped></style>
