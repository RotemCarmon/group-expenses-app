const groupPage = () => import('../views/group-page')
import { groupList, groupEdit, groupDetails } from '../cmps'
import { expenseEdit } from '@/modules//expense/cmps';


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
        name: 'group-details'
      }
    ]
  }
]
