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
      store.commit('setConnectionAttributes', 
        {
          ssl: ssl.value,
          host: host.value,
          pass: pass.value,
          user: user.value,
          dbName: dbName.value
        });
      store.dispatch('syncDB');
    }

    let connectionAttrs = store.getters['getConnectionAttributes'];
    let ssl =  ref(connectionAttrs.ssl);
    let host = ref(connectionAttrs.host);
    let pass = ref(connectionAttrs.pass);
    let user = ref(connectionAttrs.user);
    let dbName = ref(connectionAttrs.dbName);

    
    
    return {
      handleConnect,
      ssl,
      host,
      pass,
      user,
      dbName
    }
  }
}
</script>
