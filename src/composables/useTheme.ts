import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'pokemon-theme'

function getInitialTheme(): Theme {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)

  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const theme = ref<Theme>(getInitialTheme())

function applyTheme(value: Theme): void {
  document.documentElement.dataset.theme = value
}

applyTheme(theme.value)

watch(theme, (newTheme) => {
  applyTheme(newTheme)
  localStorage.setItem(THEME_STORAGE_KEY, newTheme)
})

function toggleTheme(): void {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

export function useTheme() {
  return {
    theme,
    toggleTheme,
  }
}
