import { firebaseService } from '@/modules/common/services/firestore.service.js';

const COLLECTION_NAME = 'user'

async function addUser(user) {
  await firebaseService.post(COLLECTION_NAME, user)
  return user
}

async function getUserById(userId) {
  return await firebaseService.get(COLLECTION_NAME, userId)
}

export const userService = {
  addUser,
  getUserById
}


