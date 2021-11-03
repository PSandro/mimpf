<template>
  <p>
    {{ status }}
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
import { computed } from 'vue';
import { VueCookieNext } from 'vue-cookie-next';

export default {
  name: 'App',
  components: {
  },
  setup() {
    const store = useStore();
    if (VueCookieNext.isCookieAvailable('conAttrs')) {
      let attrs = VueCookieNext.getCookie('conAttrs');
      store.commit('setConnectionAttributes', attrs);
    }

    //try to sync database
    store.dispatch('syncDB');
    
    return {
      status: computed(() => store.getters['getStatus']),
    };
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
