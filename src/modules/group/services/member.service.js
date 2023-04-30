import { utilService } from '@/modules/common/services/util.service.js'

function addMember(member, group) {
  group.members[member.email] = member;
  group.memberEmails.push(member.email);
}

function removeMember(member, group) {
  delete group.members[member.email];
  group.memberEmails = group.memberEmails.filter((email) => email !== member.email);
  

  group.expenses = group.expenses.filter((expense) => {
    // Removes the member email from the exclude of all expenses
    if (expense.exclude && expense.exclude.includes(member.email)) {
      expense.exclude.splice(expense.exclude.indexOf(member.email), 1);
    }
    // Removes all the expenses the removed member is the spender
    return expense.spender != member.email;
  });
}

function createMember(options = {}) {
  const { username = '', email = '', id = utilService.makeId(8), isOwner = false } = options
  return {
    name: username,
    email,
    id,
    isOwner,
    expenses: [],
    amountSpent: 0
  }
}


export const memberService = {
  addMember,
  removeMember,
  createMember
}