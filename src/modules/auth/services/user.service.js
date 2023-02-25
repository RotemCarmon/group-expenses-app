import { firebaseService } from '@/modules/common/services/firestore.service.js';

const COLLECTION_NAME = 'user'

async function addUser(user) {
  await firebaseService.post(COLLECTION_NAME, user)
  return user
}
async function updateUser(user) {
  await firebaseService.put(COLLECTION_NAME, user)
  return user
}

async function getUserById(userId) {
  return await firebaseService.get(COLLECTION_NAME, userId)
}
async function getUserByEmail(email) {
  return await firebaseService.query(COLLECTION_NAME, { eq: ['email', email] })
}

export const userService = {
  addUser,
  getUserById,
  updateUser,
  getUserByEmail
}


