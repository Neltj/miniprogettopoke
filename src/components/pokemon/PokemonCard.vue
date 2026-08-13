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

    <button
      type="button"
      @click="emit('select', name)"
    >
      Dettagli
    </button>
    <button
      type="button"
      :aria-pressed="favorite"
      @click="emit('toggle-favorite', name)"
    >
      {{ favorite ? '★ Rimuovi dai preferiti' : '☆ Aggiungi ai preferiti' }}
    </button>
  </li>
</template>

<style scoped>
.pokemon-card {
  border: 1px solid #ccc;
  padding: 16px;
  margin: 16px;
  border-radius: 8px;
}

.pokemon-type {
  color: white;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.85rem;
  text-transform: capitalize;
}

.pokemon-type--fire {
  background-color: #e25822;
}

.pokemon-type--water {
  background-color: #3b82f6;
}

.pokemon-type--grass {
  background-color: #3f9c35;
}

.pokemon-type--electric {
  background-color: #d9a400;
}

.pokemon-types {
  display: flex;
  gap: 0.5rem;
  padding: 0;
  list-style: none;
}

.pokemon-type--bug {
  background-color: #8f9d1a;
}

.pokemon-type--dark {
  background-color: #4b4b4b;
}

.pokemon-type--dragon {
  background-color: #6f35fc;
}

.pokemon-type--fairy {
  background-color: #d685ad;
}

.pokemon-type--fighting {
  background-color: #c22e28;
}

.pokemon-type--flying {
  background-color: #a98ff3;
}

.pokemon-type--ghost {
  background-color: #735797;
}

.pokemon-type--ground {
  background-color: #e2bf65;
  color: #222;
}

.pokemon-type--ice {
  background-color: #96d9d6;
  color: #222;
}

.pokemon-type--normal {
  background-color: #a8a77a;
}

.pokemon-type--poison {
  background-color: #a33ea1;
}

.pokemon-type--psychic {
  background-color: #f95587;
}

.pokemon-type--rock {
  background-color: #b6a136;
}

.pokemon-type--steel {
  background-color: #b7b7ce;
  color: #222;
}
</style>
