import { ref, watch } from 'vue'

const FAVORITES_STORE_KEY = 'pokemon-favorites'

const favoriteNames = ref<string[]>(loadFavoriteNames())

function loadFavoriteNames(): string[] {
  const storedFavoriteNames = localStorage.getItem(FAVORITES_STORE_KEY)
  if (!storedFavoriteNames) {
    return []
  }

  try {
    const parsedFavoriteNames: unknown = JSON.parse(storedFavoriteNames)

    if (
      !Array.isArray(parsedFavoriteNames) ||
      !parsedFavoriteNames.every((favoriteName) => {
        return typeof favoriteName === 'string'
      })
    ) {
      return []
    }

    return parsedFavoriteNames as string[]
  } catch {
    return []
  }
}

watch(favoriteNames, (newFavoriteNames) => {
  localStorage.setItem(FAVORITES_STORE_KEY, JSON.stringify(newFavoriteNames))
})

function isFavorite(name: string): boolean {
  return favoriteNames.value.includes(name)
}

function toggleFavorite(name: string): void {
  if (isFavorite(name)) {
    favoriteNames.value = favoriteNames.value.filter((favoriteName) => {
      return favoriteName !== name
    })

    return
  }

  favoriteNames.value = [...favoriteNames.value, name]
}

function clearFavorites(): void {
  favoriteNames.value = []
}

export function usePokemonFavorites() {
  return {
    favoriteNames,
    isFavorite,
    toggleFavorite,
    clearFavorites,
  }
}
