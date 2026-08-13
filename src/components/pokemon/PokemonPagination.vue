<script setup lang="ts">
defineProps<{
  currentPage: number
  totalPages: number
  totalPokemon: number
  loading: boolean
}>()

const emit = defineEmits<{
  previous: []
  next: []
}>()
</script>
<template>
  <nav aria-label="Paginazione iniziale">
    <button
      type="button"
      :disabled="loading || currentPage === 1"
      @click="emit('previous')"
    >
      Precedenti
    </button>
    <button
      type="button"
      :disabled="loading || currentPage >= totalPages"
      @click="emit('next')"
    >
      Successivi
    </button>
    <span> Pagina {{ currentPage }} di {{ totalPages }} - {{ totalPokemon }} pokemon totali </span>
  </nav>
</template>

<style scoped></style>
