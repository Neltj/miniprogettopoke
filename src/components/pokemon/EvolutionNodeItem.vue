<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { EvolutionNode } from '@/types/pokemonTypes'

defineOptions({
  name: 'EvolutionNodeItem',
})

const props = defineProps<{
  node: EvolutionNode
}>()
</script>

<template>
  <li class="evolution-node">
    <RouterLink
      class="evolution-node__link"
      :to="{
        name: 'pokemon-details',
        params: {
          name: props.node.species.name,
        },
      }"
    >
      {{ props.node.species.name }}
    </RouterLink>

    <ul
      v-if="props.node.evolves_to.length > 0"
      class="evolution-node__children"
    >
      <EvolutionNodeItem
        v-for="child in props.node.evolves_to"
        :key="child.species.name"
        :node="child"
      />
    </ul>
  </li>
</template>

<style scoped>
.evolution-node {
  display: grid;
  gap: 0.5rem;
}

.evolution-node__link {
  display: inline-block;
  width: fit-content;
  padding: 0.55rem 0.85rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background-color: var(--colo--surface);
  font-weight: 650;
  text-transform: capitalize;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease;
}

.evolution-node__link:hover {
  transform: translateY(-0.15rem);
  background: var(--color-surface-muted);
}

.evolution-node__children {
  display: grid;
  gap: 0.5rem;
  margin-left: 1rem;
  padding-left: 1rem;
  border-left: 2px solid var(--color-border);
  list-style: none;
}
</style>
