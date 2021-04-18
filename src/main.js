import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import { locale } from 'element-plus';
import router from '@/router/router';
import App from './App.vue';
import store from '@/store';

import 'element-plus/lib/theme-chalk/index.css';
import lang from 'element-plus/lib/locale/lang/de'

locale(lang);
const app = createApp(App)
  .use(ElementPlus, {locale})
  .use(router)
  .use(store);

app.mount('#app');
