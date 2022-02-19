// const participents = ['rotem', 'ben', 'nave', 'alon', 'nir', 'tom', 'tomer']
const participents = ['rotem', 'ben', 'nave']


const expenses = {
  'rotem': [{ amount: 10, exclude: ['ben'] }],
  'ben': [{ amount: 21, exclude: [] }],
  'nave': [],
  'alon': [],
  'nir': [],
  'tomas': [],
  'tomer': [],
}


function addExpense(spender, expense) {
  console.log('spender:', spender)
  console.log('expense:', expense)
  if(!expenses[spender]) throw new Error(`The spender ${spender} does not exist in this group`)
  expenses[spender].push(expense)

}

function getBreakDown() {
  const breakDown = {}
  for (const name in expenses) {
    const spender = expenses[name]
    spender.forEach((expense) => {

      participents.forEach(p => {
        if (expense.exclude.includes(p)) return
        if (!breakDown[p]) breakDown[p] = 0
        // needed to pay
        breakDown[p] += expense.amount / (participents.length - expense.exclude.length)
      })
    })
  }
  return breakDown;
}

function getSum() {
  let sum = 0

  for (const name in expenses) {
    const p = expenses[name]
    p.forEach((expense) => {
      sum += (expense.amount / (participents.length - expense.exclude.length))
    })
  }
  return sum
}

function getSumPerParticipent() {
  const perticipentSum = {}
  participents.forEach(partic => {
    const sum = expenses[partic].reduce((acc, expense) => {
      if (!expense) return acc
      acc += expense.amount
      return acc
    }, 0)
    perticipentSum[partic] = sum
  })
  return perticipentSum
}

function calcSummary(breakDown, sumPerParticipent) {
  const names = Object.keys(breakDown)

  const breakDownDiff = {}
  names.forEach(name => {
    breakDownDiff[name] = sumPerParticipent[name] - breakDown[name]
  })
  return breakDownDiff
}

function getSummary() {
  const totalSpent = getTotalSpent()
  const sumPerParticipent = getSumPerParticipent()
  const breakDown = getBreakDown()
  const summaryBreakDown = calcSummary(breakDown, sumPerParticipent)

  return { totalSpent, summaryBreakDown }
}

function getTotalSpent() {
  let total = 0
  for (const name in expenses) {
    const p = expenses[name]
    p.forEach((expense) => {
      total += expense.amount
    })
  }
  return total
}


export const expenseService = {
  getSum,
  getSummary,
  getTotalSpent,
  addExpense,
  participents,
  expenses
}