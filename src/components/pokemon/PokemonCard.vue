<script setup lang="ts">
import PokemonImageToggle from './PokemonImageToggle.vue'

const props = defineProps<{
  name: string
  image: string | null
  shinyImage: string | null
  favorite: boolean
  types: string[]
}>()

const emit = defineEmits<{
  select: [name: string]
  'toggle-favorite': [name: string]
}>()
</script>

<template>
  <li class="pokemon-card">
    <h2>{{ name }}</h2>
    <ul
      v-if="props.types.length > 0"
      class="pokemon-types"
      aria-label="Tipi del pokemon"
    >
      <li
        v-for="type in props.types"
        :key="type"
        :class="`pokemon-type pokemon-type--${type}`"
      >
        {{ type }}
      </li>
    </ul>

    <PokemonImageToggle
      variant="card"
      :normal-image="props.image"
      :shiny-image="props.shinyImage"
      :alt="props.name"
    />

    <div class="pokemon-card__actions">
      <button
        type="button"
        @click="emit('select', name)"
      >
        Dettagli
      </button>
      <button
        class="button--secondary"
        type="button"
        :aria-pressed="favorite"
        @click="emit('toggle-favorite', name)"
      >
        {{ favorite ? '★ Rimuovi dai preferiti' : '☆ Aggiungi ai preferiti' }}
      </button>
    </div>
  </li>
</template>

<style scoped>
.pokemon-card {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: 0 0.75rem 1.5rem var(--color-shadow);
  text-align: center;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.pokemon-card:hover {
  transform: translateY(-0.25rem);
  box-shadow: 0 1rem 2rem var(--color-shadow);
}

.pokemon-card h2 {
  max-width: 100%;
  overflow-wrap: anywhere;
  font-size: 1.25rem;
  text-transform: capitalize;
}

.pokemon-types {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  min-height: 1.75rem;
}

.pokemon-card__actions {
  display: grid;
  width: 100%;
  gap: 0.5rem;
  margin-top: auto;
}
</style>
