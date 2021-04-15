import { createApp } from 'vue'
import router from '@/router/router'
import App from './App.vue'
import store from '@/store'


const app = createApp(App)
  .use(router)
  .use(store);

app.mount('#app');
