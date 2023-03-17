import { expenseService } from '@/modules/expense/services/expense.service';
import { utilService } from '@/modules/common/services/util.service';

describe('EXPENSE SERVICE', () => {


  describe('getEmptyExpense', () => {
    let spyOnMakeId
    beforeEach(() => {
      spyOnMakeId = jest.spyOn(utilService, 'makeId').mockImplementation(() => 'abcd1234')
    })

    const emptyExpense = {
      id: 'abcd1234',
      amount: '',
      exclude: [],
      description: '',
      currency: '',
      spender: ''
    }

    test('Should return an empty expense if no values were added', () => {
      const exp = expenseService.getEmptyExpense()

      expect(exp).toEqual(emptyExpense)
    })
    test('Should return an empty expense with default values for the values not specified', () => {
      const exp = expenseService.getEmptyExpense()

      expect(exp).toEqual(emptyExpense)
    })
  })
})