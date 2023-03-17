import { expenseService } from '../services/expense.service.js'
import { loggerService } from '@/modules/common/services/logger.service.js'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async saveExpense({ dispatch }, { expense, group }) {
      try {
        const groupToSave = await expenseService.addExpense(expense, { ...group })
        dispatch({ type: 'groupStore/saveGroup', group: groupToSave }, { root: true })
      } catch (err) {
        loggerService.error(err)
      }
    },
    async removeExpense({ dispatch }, { expense, group }) {
      try {
        const groupToSave = await expenseService.removeExpense(expense, { ...group })
        dispatch({ type: 'groupStore/saveGroup', group: groupToSave }, { root: true })
      } catch (err) {
        loggerService.error(err)
      }
    }
  }
};
