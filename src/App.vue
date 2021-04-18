<template>
  <h1>Mimpf!</h1>
  <p>
    <router-link to="/">
      Home
    </router-link>
    <router-link to="/reception">
      (Parkplatz-)Empfang
    </router-link>
  </p>
  <router-view />
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  created: function() {
    this.$store.dispatch('syncDB');
    
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
