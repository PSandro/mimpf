<template>
  <el-form
    label-width="120px"
  >
    <el-form-item label="SSL/TLS">
      <el-switch
        v-model="ssl"
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
        v-model="password"
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
      <el-button>Zurücksetzen</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { useStore } from 'vuex';
import { ref } from 'vue';

export default {
  name: 'EnqueueForm',
  components: {
  },
  setup() {
    const store = useStore();
    
    const handleConnect = () => {
      store.dispatch('syncDB');
    }

    const ssl = ref(store.state.ssl);
    const host = ref(store.state.host);
    const user = ref(store.state.user);
    const password = ref(store.state.pass);
    const dbName = ref(store.state.dbName);
    
    return {
      handleConnect,
      ssl,
      host,
      password,
      user,
      dbName,
    }
  }
}
</script>
