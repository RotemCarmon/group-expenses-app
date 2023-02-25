import expensePage from '../views/expense-page'
import { expenseList, expenseEdit } from '../cmps';

export const expenseRoutes = [
  {
    path: '/expense',
    component: expensePage,
    children: [
      {
        path: ':groupId',
        component: expenseList,
        name: 'expense-list'
      },
      {
        path: 'edit/:groupId/:expenseId?',
        component: expenseEdit,
        name: 'expense-edit'
      },
    ]
  }
]
