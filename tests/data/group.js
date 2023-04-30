import { member1, member2 } from './member';
import { expense1, expense2 } from './expense';



// GROUPS
export const group = {
  id: 'G1001',
  name: 'Test Group',
  description: 'This is a group for testing',
  members: {
    [member1.email]: member1,
    [member2.email]: member2
  },
  expenses: [expense1, expense2],
  memberEmails: [member1.email, member2.email]
}