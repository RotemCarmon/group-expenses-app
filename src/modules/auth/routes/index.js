const loginSignupPage = () => import('../views/login-signup')

export const authRoutes = [
  {
    path: '/auth',
    name: 'login-signup',
    component: loginSignupPage,
  }
]
