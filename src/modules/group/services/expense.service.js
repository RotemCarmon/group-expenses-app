import { currencyService } from '@/modules/common/services/currency.service.js'
import { loggerService } from '@/modules/common/services/logger.service.js'
import { makeId } from '@/modules/common/services/util.service.js'


var gCurrencyData


async function getTotalExpenses(expenses, userCurrency) {
  gCurrencyData = await _getCurrencyRate()
  let sum = 0
  for (const member in expenses) {
    const memberExpenses = expenses[member]
    sum += memberExpenses.reduce((acc, expense) => {
      const amount = _convertToBase(expense.amount, expense.currency)
      acc += amount
      return acc
    }, 0)
  }
  return _convertFromBase(sum, userCurrency)
}

// This function get the amount each member HAVE paid
function getSumPerMember(expenses) {
  const membersSum = {}
  const members = Object.keys(expenses)
  members.forEach(member => {
    const sum = expenses[member].reduce((acc, expense) => {
      if (!expense) return acc
      // convert to base currency
      const amount = _convertToBase(expense.amount, expense.currency)
      acc += amount
      return acc
    }, 0)
    membersSum[member] = sum
  })
  return membersSum
}

// This function gets the amout each member should have paid
function getEqualExpense(expenses) {
  const equalExpense = {}
  const members = Object.keys(expenses)

  // Map initial members
  members.forEach(member => {
    equalExpense[member] = 0
  })

  members.forEach(member => {
    if (!equalExpense[member]) equalExpense[member] = 0
    expenses[member].forEach(expense => {
      members.forEach(_member => {
        if (expense.exclude.includes(_member)) return
        if (!equalExpense[_member]) equalExpense[_member] = 0
        // convert to base currency => expense.amount
        const amount = _convertToBase(expense.amount, expense.currency)
        equalExpense[_member] += amount / (members.length - expense.exclude.length)
      })
    })
  })
  return equalExpense;
}

// This function calculates the difference between each member paid and what he should've pay
function calcSummary(sumPerMember, equalExpense, userCurrency) {
  const members = Object.keys(sumPerMember)
  const summary = {}
  members.forEach(member => {
    // convert to user pref currency
    const amountDiff = sumPerMember[member] - equalExpense[member]
    const amount = _convertFromBase(amountDiff, userCurrency)
    summary[member] = amount
  })
  return summary
}

async function getSummary(expenses, userCurrency) {
  try {
    if (!expenses) return
    gCurrencyData = await _getCurrencyRate()
    const sumPerMember = getSumPerMember(expenses)
    const equalExpense = getEqualExpense(expenses)
    return calcSummary(sumPerMember, equalExpense, userCurrency)
  } catch (err) {
    loggerService.error(err)
  }
}

export const expenseService = {
  getSumPerMember,
  getEqualExpense,
  getSummary,
  getTotalExpenses,
  getEmptyExpense
}

function getEmptyExpense() {
  return {
    id: makeId(),
    amount: 0,
    exclude: [],
    description: '',
    currency: ''
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