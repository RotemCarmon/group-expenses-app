import groupPage from '../views/group-page'
import { groupList, groupEdit, groupDetails, expenseEdit } from '../cmps'


export const groupRoutes = [
  {
    path: '/group',
    name: 'group-page',
    component: groupPage,
    children: [
      {
        path: '/',
        component: groupList,
        name: 'group-list'
      },
      {
        path: 'edit/:groupId?',
        component: groupEdit,
        name: 'group-edit'
      },

      
      {
        path: ':groupId',
        component: groupDetails,
        name: 'group-details'
      },
      {
        path: ':groupId/expense/:expenseId?',
        component: expenseEdit,
        name: 'expense-edit'
      },
    ]
  }
]
