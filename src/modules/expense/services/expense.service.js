import * as XLSX from "xlsx";
import { currencyService } from '@/modules/common/services/currency.service.js'
import { loggerService } from '@/modules/common/services/logger.service.js'
import { makeId, formatDate, findEmailByNameInGroup, findNameByEmailInGroup } from '@/modules/common/services/util.service.js'


var gCurrencyData

async function getTotalExpenses(expenses, userCurrency) {
  gCurrencyData = await _getCurrencyRate()

  const sum = expenses.reduce((sum, expense) => {
    sum += _convertToBase(expense.amount, expense.currency)
    return sum
  }, 0)
  return _convertFromBase(sum, userCurrency)
}

async function getBalances(group, userCurrency) {
  gCurrencyData = await _getCurrencyRate()

  const balances = {}
  // Get the mount each member paied
  for (const member of Object.values(group.members)) {
    balances[member.email] = member.amountSpent
  }

  // For each expense
  const totalMemberCount = group.memberEmails.length

  for (const expense of group.expenses) {
    const memberCount = totalMemberCount - expense.exclude.length
    const amountPerMember = _convertToBase(expense.amount, expense.currency) / memberCount


    for (const member of Object.values(group.members)) {
      if (!expense.exclude.includes(member.email)) {
        balances[member.email] -= amountPerMember
      }
    }
  }

  for (const member in balances) {
    balances[member] = _convertFromBase(balances[member], userCurrency)
  }

  return balances
}




// EXCEL
function exportExcel(group) {
  const data = prepareExpenseData(group)

  const wb = XLSX.utils.book_new(); // create a new empty workbook
  const ws = XLSX.utils.json_to_sheet(data, { header: ['spender', 'description', 'amount', 'currency', 'exclude', 'email', 'createdAt'] }); // create a sheet from json
  XLSX.utils.book_append_sheet(wb, ws, "Expenses"); // appends sheet to workbook
  XLSX.writeFile(
    wb,
    `${group.name || 'Expenses'}-${formatDate(new Date())}.xlsx`
  ); // download file

}

function prepareExpenseData(group) {
  const expenses = group.expenses

  const res = expenses.reduce((acc, expense) => {
    const name = findNameByEmailInGroup(expense.spender, group)

    acc.push({
      spender: name,
      amount: expense.amount,
      description: expense.description,
      exclude: expense.exclude.map((_email) => findNameByEmailInGroup(_email, group)).join(', '),
      currency: expense.currency,
      email: expense.spender,
      createdAt: formatDate(expense.createdAt),
    })
    return acc
  }, [])

  return res
}

// PREPARE EXPENSE
async function prepareExpense(expense, group) {
  gCurrencyData = await _getCurrencyRate()

  const { spender, amount, exclude } = expense
  group.expenses.push(expense)
  group.members[expense.spender].expenses.push(expense)
  group.members[expense.spender].amountSpent += _convertToBase(amount, expense.currency)

  return group
}

async function removeExpense(expense, group) {
  gCurrencyData = await _getCurrencyRate()

  const { spender, amount, currency, id } = expense
  const idx = group.expenses.findIndex((exp) => exp.id === id);
  if (idx !== -1) {
    group.expenses.splice(idx, 1);
  }

  const memIdx = group.members[spender].expenses.findIndex((exp) => exp.id === id);
  if (memIdx !== -1) {
    group.members[spender].expenses.splice(memIdx, 1);
  }

  group.members[spender].amountSpent -= _convertToBase(amount, currency)

  return group
}

export const expenseService = {
  getTotalExpenses,
  getEmptyExpense,
  exportExcel,
  prepareExpense,
  getBalances,
  removeExpense
}

function getEmptyExpense() {
  return {
    id: makeId(),
    amount: '',
    exclude: [],
    description: '',
    currency: '',
    spender: ''
  }
}


function _convertToBase(amount = 0, currency) {
  const rate = gCurrencyData[currency]?.value || 1
  return amount / rate
}

function _convertFromBase(amount = 0, currency) {
  const rate = gCurrencyData[currency]?.value || 1
  return amount * rate
}

async function _getCurrencyRate() {
  return await currencyService.getCurrencyData()
}