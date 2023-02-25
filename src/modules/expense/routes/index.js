import expensePage from '../views/expense-page'
import { expenseList } from '../cmps';

export const expenseRoutes = [
  {
    path: '/expense',
    component: expensePage,
    children: [
      {
        path: ':groupId',
        component: expenseList,
        name: 'expense-list'
      }
    ]
  }
]
