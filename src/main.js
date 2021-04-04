import { createApp } from 'vue'
import router from '@/router/router'
import App from './App.vue'
//import VueSocketIO from 'vue-socket.io'


//const optionsVueIO = {
//	debug: true,
//	connection: "http://localhost:3000",
//}

//const app = createApp(App).use(new VueSocketIO(optionsVueIO));
const app = createApp(App).use(router);
app.mount('#app');
