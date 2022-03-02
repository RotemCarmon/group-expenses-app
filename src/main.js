import { auth } from './firebase'
import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import { store } from './store';
import { router, initStore as initStoreForRouter } from './router';
import './assets/styles/main.scss';


initStoreForRouter(store);

// Setting vh for mobile view
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