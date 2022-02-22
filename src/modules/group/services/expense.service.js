
function getTotalExpenses(expenses) {
  let sum = 0
  for (const member in expenses) {
    const memberExpenses = expenses[member]
    sum += memberExpenses.reduce((acc, expense) => {
      acc += expense.amount
      return acc
    }, 0)
  }
  return sum
}

// This function get the amount each member HAVE paid
function getSumPerMember(expenses) {
  const membersSum = {}
  const members = Object.keys(expenses)
  members.forEach(member => {
    const sum = expenses[member].reduce((acc, expense) => {
      if (!expense) return acc
      acc += expense.amount
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
    expenses[member].forEach(expense => {
      members.forEach(_member => {
        if (expense.exclude.includes(_member)) return
        equalExpense[_member] += expense.amount / (members.length - expense.exclude.length)
      })
    })
  })
  return equalExpense;
}

// This function calculates the difference between each member paid and what he should've pay
function calcSummary(sumPerMember, equalExpense) {
  const members = Object.keys(sumPerMember)
  const summary = {}
  members.forEach(member => {
    summary[member] = sumPerMember[member] - equalExpense[member]
  })
  return summary
}

function getSummary(expenses) {
  if(!expenses) return 
  const sumPerMember = getSumPerMember(expenses)
  const equalExpense = getEqualExpense(expenses)
  return calcSummary(sumPerMember, equalExpense)
}

export const expenseService = {
  getSumPerMember,
  getEqualExpense,
  getSummary,
  getTotalExpenses
}
