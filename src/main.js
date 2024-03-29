import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'virtual:windi.css';
import './assets/css/style.css';
import socket from 'socket.io-client';
import { createPinia } from 'pinia';
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
export const $cookies = cookies;
export const $io = socket('http://localhost:5000/');

const Vue = createApp(App);
const pinia = createPinia();

Vue.config.globalProperties.$io = $io;
Vue.config.globalProperties.$cookies = $cookies;

Vue.use(pinia);
Vue.use(router);
Vue.use(store);
Vue.mount('#app');
