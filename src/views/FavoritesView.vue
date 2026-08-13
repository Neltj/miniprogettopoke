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
  <main>
    <h1>Pokemon preferiti</h1>
    <p v-if="favoriteNames.length > 0">Hai {{ favoriteNames.length }} Pokémon preferiti.</p>
    <button
      v-if="favoriteNames.length > 0"
      type="button"
      @click="confirmClearFavorites"
    >
      Rimuovi i preferiti
    </button>
    <p v-if="loading">Caricamento dei preferiti</p>

    <div v-else-if="error">
      <p>{{ error }}</p>

      <button
        type="button"
        @click="loadFavoritePokemon"
      >
        Riprova
      </button>
    </div>

    <p v-else-if="favoriteNames.length === 0">Non hai Pokemon preferiti</p>
    <ul v-else>
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
