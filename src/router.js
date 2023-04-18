import { createRouter, createWebHashHistory } from 'vue-router'

import { authRoutes } from '@/modules/auth/routes'
import { commonRoutes } from '@/modules/common/routes'
import { groupRoutes } from '@/modules/group/routes'
import { expenseRoutes } from '@/modules/expense/routes'



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


export const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});


// let _store;
// export const initStore = store => _store = store;


// router.beforeEach(async (to, from, next) => {
//   let loggedInUser = _store.getters['authStore/loggedInUser'];
//   if (!loggedInUser) {
//     if (['login-signup'].includes(to.name)) return next();
//     return router.push('/auth').catch(() => { });
//   } else {
//     if (['login-signup'].includes(to.name)) {
//       return next('/')
//     }
//   }
//   next()
// })