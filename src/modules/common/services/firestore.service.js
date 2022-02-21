import { getFirestore, collection, addDoc } from "firebase/firestore"
const db = getFirestore()

async function query(collectionName, filterBy) {

}
async function get(collectionName, filterBy) {

}
async function post(collectionName, data) {
  return await addDoc(collection(db, collectionName), data);
}
async function put(collectionName, data) {

}
async function remove(collectionName, filterBy) {

}

export const firebaseService = {
  query,
  get,
  post,
  put,
  remove
}
