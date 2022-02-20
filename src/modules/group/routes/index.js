import groupPage from '../views/group-page'
import { groupList, groupEdit, groupDetails, expenseEdit } from '../cmps'


export const groupRoutes = [
  {
    path: '/group',
    name: 'group-page',
    component: groupPage,
    children: [
      {
        path: 'list',
        component: groupList,
        name: 'group-list'
      },
      {
        path: 'edit/:groupId?',
        component: groupEdit,
        name: 'group-edit'
      },
      
      {
        path: 'expense/:expenseId?',
        component: expenseEdit,
        name: 'expense-edit'
      },

      {
        path: ':groupId',
        component: groupDetails,
        name: 'group-details'
      }
    ]
  }
]
