import Vue from 'vue';
import VueRouter from 'vue-router';

import { authRoutes } from '@/modules/auth/routes'
import { commonRoutes } from '@/modules/common/routes'
import { groupRoutes } from '@/modules/group/routes'
import { expenseRoutes } from '@/modules/expense/routes'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'group'
  },
  ...authRoutes,
  ...commonRoutes,
  ...groupRoutes,
  ...expenseRoutes
]


export const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});


// let _store;
// export const initStore = store => _store = store;


// router.beforeEach(async (to, from, next) => {
//   if (['auth'].includes(to.name)) return next();

//   let loggedInUser = _store.getters['authStore/loggedInUser'];
//   console.log('loggedInUser:', loggedInUser)
//   if(!loggedInUser) {
//     // get loggedInUser from sessionStorage
//   }
//   next()
// })