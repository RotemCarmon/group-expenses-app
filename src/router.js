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
