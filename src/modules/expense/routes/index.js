const expensePage = () => import('../views/expense-page.vue')

import { expenseList, expenseEdit } from '../cmps';

export const expenseRoutes = [
  {
    path: '/expense',
    component: expensePage,
    children: [
      {
        path: 'edit/:groupId/:expenseId?',
        component: expenseEdit,
        name: 'expense-edit'
      },
    ]
  }
]
