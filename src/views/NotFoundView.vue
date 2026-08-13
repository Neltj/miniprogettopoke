<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="page-shell not-found-page">
    <h1 class="page-title">Errore 404: pagina non trovata</h1>
    <p>La pagina richiesta non esiste.</p>
    <RouterLink
      class="back-link"
      :to="{
        name: 'home',
      }"
      >Torna alla home</RouterLink
    >
  </main>
</template>

<style scoped></style>
