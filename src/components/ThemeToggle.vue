<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { theme, toggleTheme } = useTheme()

const isDark = computed(() => {
  return theme.value === 'dark'
})

const themeLabel = computed(() => {
  return isDark.value ? 'Passa al tema chiaro' : 'Passa al tema scuro'
})
</script>

<template>
  <button
    class="theme-toggle"
    type="button"
    :aria-label="themeLabel"
    :aria-pressed="isDark"
    @click="toggleTheme"
  >
    <span aria-hidden="true">{{ isDark ? '☀️' : '🌙' }}</span>
  </button>
</template>

<style scoped>
.theme-toggle {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 2.5rem;
  padding: 0.55rem 0.8rem;
  border: 1px solid var(--color-border-hover);
  border-radius: 999px;
  color: var(--color-heading);
  background: var(--color-surface);
  box-shadow: 0 0.5rem 1.25rem var(--color-shadow);
  font-size: 0.85rem;
  white-space: nowrap;
}

.theme-toggle:hover {
  color: var(--color-heading);
  background: var(--color-surface-muted);
}

@media (max-width: 480px) {
  .theme-toggle {
    top: 0.75rem;
    right: 0.75rem;
    padding: 0.55rem 0.7rem;
  }
}
</style>
