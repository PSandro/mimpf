<template>
  <h1>Mimpf!</h1>
  <p>
    <router-link to="/reception">
      Home
    </router-link>
    <router-link to="/reception/appointments">
      (Parkplatz-)Empfang
    </router-link>
  </p>
  <Suspense>
    <template #default>
      <router-view />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<script>

import { useStore } from 'vuex';

export default {
  name: 'App',
  components: {
  },
  setup() {
    const store = useStore();

    store.dispatch('syncDB');
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
