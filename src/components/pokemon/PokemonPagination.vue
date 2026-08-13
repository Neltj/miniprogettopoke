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
  <nav
    class="pokemon-pagination"
    aria-label="Paginazione iniziale"
  >
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
    <span class="pokemon-pagination__summary">
      Pagina {{ currentPage }} di {{ totalPages }} · {{ totalPokemon }} Pokémon totali
    </span>
  </nav>
</template>

<style scoped>
.pokemon-pagination {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin: 1.5rem 0;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-muted);
}

.pokemon-pagination__summary {
  color: var(--color-text);
  font-size: 0.9rem;
  text-align: center;
}

@media (max-width: 480px) {
  .pokemon-pagination button {
    flex: 1 1 8rem;
  }

  .pokemon-pagination__summary {
    flex-basis: 100%;
  }
}
</style>
