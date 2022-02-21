import { getFirestore, collection, setDoc, doc, getDoc } from "firebase/firestore"
const db = getFirestore()

const COLLECTION_NAME = 'user'
const USER_SESSION_KEY = 'loggedInUser';

async function addUser(user) {
  await setDoc(doc(db, COLLECTION_NAME, user.id), user);
  return user
}

async function getUserById(userId) {
  const docRef = doc(db, COLLECTION_NAME, userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    throw new Error('Can\'t find user with id: ' + userId)
  }
}

export const userService = {
  addUser,
  getUserById
}


