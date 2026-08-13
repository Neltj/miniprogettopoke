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
  <img
    v-if="displayImage"
    :class="['pokemon-image', `pokemon-image--${props.variant}`]"
    :src="displayImage"
    :alt="alt"
  />
  <p v-else>No image available</p>
  <button
    type="button"
    :disabled="!props.shinyImage"
    :aria-pressed="isShiny"
    @click="isShiny = !isShiny"
  >
    {{ isShiny ? 'Mostra versione normale' : 'Mostra versione shiny' }}
  </button>
</template>
<style scoped>
.pokemon-image {
  display: block;
  image-rendering: pixelated;
}

.pokemon-image--detail {
  width: 12rem;
  height: 12rem;
}
</style>
