import { ref } from 'vue'
export function useAsyncState<T>() {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function execute(
    task: () => Promise<T>,
    errorMessage: string | ((error: unknown) => string) = 'Si è verificato un errore',
  ): Promise<void> {
    loading.value = true
    error.value = null

    try {
      data.value = await task()
    } catch (err) {
      console.error(err)
      error.value = typeof errorMessage === 'function' ? errorMessage(err) : errorMessage
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    error,
    execute,
  }
}
