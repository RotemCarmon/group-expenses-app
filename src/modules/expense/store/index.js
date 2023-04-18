import { defineStore } from 'pinia'
import { expenseService } from '../services/expense.service.js'
import { loggerService } from '@/modules/common/services/logger.service.js'
import { useGroupStore } from '@/modules/group/store';

export const useExpenseStore = defineStore('expense', {
  actions: {
    async saveExpense({ expense, group }) {
      const groupStore = useGroupStore()
      try {
        const groupToSave = await expenseService.addExpense(expense, { ...group })
        groupStore.saveGroup({ group: groupToSave })
      } catch (err) {
        loggerService.error(err)
      }
    },
    async removeExpense({ expense, group }) {
      const groupStore = useGroupStore()
      try {
        const groupToSave = await expenseService.removeExpense(expense, { ...group })
        groupStore.saveGroup({ group: groupToSave })
      } catch (err) {
        loggerService.error(err)
      }
    }
  }
})