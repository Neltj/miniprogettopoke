<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  normalImage: string | null
  shinyImage: string | null
  alt: string
  variant: 'card' | 'detail'
}>()

const isShiny = ref(false)

const displayImage = computed(() => {
  if (isShiny.value && props.shinyImage) {
    return props.shinyImage
  }
  return props.normalImage
})
</script>

<template>
  <div class="pokemon-image-toggle">
    <img
      v-if="displayImage"
      :class="['pokemon-image', `pokemon-image--${props.variant}`]"
      :src="displayImage"
      :alt="alt"
    />
    <p v-else>No image available</p>
    <button
      class="button button--secondary"
      type="button"
      :disabled="!props.shinyImage"
      :aria-pressed="isShiny"
      @click="isShiny = !isShiny"
    >
      {{ isShiny ? 'Mostra versione normale' : 'Mostra versione shiny' }}
    </button>
  </div>
</template>
<style scoped>
.pokemon-image-toggle {
  display: grid;
  justify-items: center;
  gap: 0.75rem;
  width: 100%;
}

.pokemon-image {
  display: block;
  width: min(100%, 10rem);
  aspect-ratio: 1;
  object-fit: contain;
  image-rendering: pixelated;
}

.pokemon-image--detail {
  width: clamp(10rem, 45vw, 16rem);
  height: auto;
}
</style>
