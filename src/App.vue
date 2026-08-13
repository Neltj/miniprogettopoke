<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="app-header">
    <img
      alt="pokelogo"
      class="logo"
      src="@/assets/logoapp.png"
      width="125"
      height="125"
    />

    <div class="app-header__inner">
      <h1>PokeNeltusoAPP</h1>

      <nav class="app-nav">
        <RouterLink to="/home">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/experiments">Experiments</RouterLink>
        <RouterLink to="/stories">Stories</RouterLink>
        <RouterLink to="/pokemons">Pokemons</RouterLink>
        <RouterLink :to="{ name: 'favorites' }">Preferiti</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  padding: 1rem;
}

.logo {
  display: block;
  width: clamp(5rem, 18vw, 7.5rem);
  height: auto;
  margin: 0 auto 1rem;
  border-radius: 1rem;
}

nav {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.35rem;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 1rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0.5rem 0.75rem;
  border: 1px solid transparent;
  border-radius: 999px;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    gap: 1.5rem;
    padding: 1rem 1.5rem;
  }

  .logo {
    margin: 0;
  }

  header .app-header__inner {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
    flex: 1;
  }

  nav {
    text-align: left;
    justify-content: flex-start;
    font-size: 1rem;
    margin-top: 1rem;
  }
}

@media (max-width: 480px) {
  nav a {
    flex: 1 1 calc(50% - 0.35rem);
  }
}
</style>
