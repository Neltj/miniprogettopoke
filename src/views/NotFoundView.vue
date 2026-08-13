<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <main>
    <h1>Errore 404 -Page not found-</h1>
    <h1>La pagina non esiste</h1>
    <RouterLink
      :to="{
        name: 'home',
      }"
      >Torna alla home</RouterLink
    >
  </main>
</template>

<style scoped></style>
