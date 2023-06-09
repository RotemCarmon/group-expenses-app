const groupPage = () => import('../views/group-page.vue')
const expenseList = () => import('@/modules/expense/cmps/expense-list.vue')
import { groupList, groupEdit, groupDetails, memberBalanceList } from '../cmps'


export const groupRoutes = [
  {
    path: '/group',
    component: groupPage,
    children: [
      {
        path: '',
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
        name: 'group-details',
        children: [
          {
            path: 'expenses',
            component: expenseList,
            name: 'expense-list'
          },
          {
            path: 'members',
            component: memberBalanceList,
            name: 'member-balance-list'
          }
        ]
      }
    ]
  }
]
