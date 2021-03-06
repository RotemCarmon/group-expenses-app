import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import { store } from './store';
import { router } from './router';
import './assets/styles/main.scss';

let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);


Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
