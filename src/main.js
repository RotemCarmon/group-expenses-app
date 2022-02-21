import {auth}  from './firebase'
import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import { store } from './store';
import { router } from './router';
import './assets/styles/main.scss';


import { config } from '@/config/config.js'
// initStoreForRouter(store);

// Setting vh for mobile
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);


Vue.config.productionTip = false;

let app
auth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})