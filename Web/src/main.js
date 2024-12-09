import { createApp } from 'vue';
import App from './App.vue';
import router from "./route/index.js";
import { createPinia } from 'pinia'
import '@/compatibilityProcessing/index.js';
import '@/composition/useEvent.js';
import '@/plugins/index.js'
const app = createApp(App);
app.use(router);
app.use(createPinia())
app.mount('#app');
