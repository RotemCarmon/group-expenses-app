import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/modules/auth/store'

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


router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const loggedInUser = authStore.loggedInUser


  if (!loggedInUser) {
    if (['login-signup'].includes(to.name)) return next();
    return next('/auth').catch(() => { });
  } else {
    if (['login-signup'].includes(to.name)) {
      return next('/')
    }
  }
  next()
})