<template>
  <el-form
    label-width="120px"
  >
    <el-form-item label="SSL/TLS">
      <el-switch
        v-model="connectionAttrs.ssl"
        placeholder="SSL"
      />
    </el-form-item>
    <el-form-item label="Datenbank">
      <el-input
        v-model="dbName"
        placeholder="Zielhost der Datenbank"
      />
    </el-form-item>
    <el-form-item label="Host">
      <el-input
        v-model="host"
        placeholder="Zielhost der Datenbank"
      />
    </el-form-item>
    <el-form-item label="Benutzername">
      <el-input
        v-model="user"
        placeholder="Benutzername eintrage"
      />
    </el-form-item>
    <el-form-item label="Passwort">
      <el-input
        v-model="pass"
        type="password"
        placeholder="Passwort eintragen"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="handleConnect"
      >
        Verbinden
      </el-button>
      <el-button
        @click="handleDisconnect"
      >
        Trennen
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { useStore } from 'vuex';
import { ref, computed } from 'vue';
import { VueCookieNext } from 'vue-cookie-next';

export default {
  name: 'EnqueueForm',
  components: {
  },
  setup() {
    const store = useStore();
    
    let connectionAttrs = computed(() => store.getters['getConnectionAttributes']);
    let ssl =  ref(connectionAttrs.value.ssl);
    let host = ref(connectionAttrs.value.host);
    let dbName = ref(connectionAttrs.value.dbName);
    let user = ref(null);
    let pass = ref(null);

    const handleConnect = async () => {
      let attrs =
        {
          ssl: ssl.value,
          host: host.value,
          dbName: dbName.value
        };
      store.commit('setConnectionAttributes', attrs);
      let conAttrs = Object.assign({}, attrs);
      delete conAttrs.pass;
      VueCookieNext.setCookie('conAttrs', conAttrs);
      if (user.value !== null && pass.value !== null) {
        await store.dispatch('login', {
          username: user.value,
          password: pass.value
        });
      }
      store.dispatch('syncDB');
      
    }

    const handleDisconnect = () => {
      store.dispatch('disconnect');
    }

    if (VueCookieNext.isCookieAvailable('conAttrs')) {
      let attrs = VueCookieNext.getCookie('conAttrs');
      ssl.value = attrs.ssl;
      host.value = attrs.host;
      dbName.value = attrs.dbName;
      store.commit('setConnectionAttributes', attrs);
    }


    
    
    return {
      handleConnect,
      handleDisconnect,
      ssl,
      host,
      pass,
      user,
      dbName,
      connectionAttrs
    }
  }
}
</script>
