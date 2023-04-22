const loginSignupPage = () => import('../views/login-signup.vue')

export const authRoutes = [
  {
    path: '/auth',
    name: 'login-signup',
    component: loginSignupPage,
  }
]
