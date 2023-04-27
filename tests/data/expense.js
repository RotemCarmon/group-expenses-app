import { member1, member2 } from './member';

// EXPENSES
export const expense1 = {
  id: 'E1001',
  amount: 20,
  exclude: [],
  description: 'Test description',
  currency: 'USD',
  spender: member1.email
}
export const expense2 = {
  id: 'E1002',
  amount: 20,
  exclude: [member1.email],
  description: 'Test description 2',
  currency: 'USD',
  spender: member2.email
}