import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { auth } from './firebase'
import "./registerServiceWorker";

import App from "./App.vue";
import { router } from './router';
import './assets/styles/main.scss';


// initStoreForRouter(store);

// Setting vh for mobile view
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);



let app
auth.onAuthStateChanged(() => {
  if (!app) {
    const pinia = createPinia()
    app = createApp(App)
    app.use(pinia).use(router).mount('#app')
  }
})