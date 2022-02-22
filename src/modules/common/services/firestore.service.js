import { getFirestore, collection, getDoc, setDoc, addDoc, doc, query as _query, where, getDocs } from "firebase/firestore"
import { loggerService } from '@/modules/common/services/logger.service.js'
const db = getFirestore()

async function query(collectionName, filterBy) {
  try {
    const q = _query(collection(db, collectionName));
    const querySnapshot = await getDocs(q);
    const data = []
    querySnapshot.forEach((doc) => {
      data.push(doc.data())
    });
    return data

  } catch (err) {
    loggerService.error(`Had issue quering documents from ${collectionName} collection`)
    throw err
  }
}
async function get(collectionName, id) {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.data()
  } catch (err) {
    loggerService.error(`Had issue getting document from ${collectionName} collection with id: ${id}`)
    throw err
  }
}
async function post(collectionName, data) {
  try {
    const docRef = doc(collection(db, collectionName));
    data.id = docRef.id
    await setDoc(docRef, data);
    return data
  } catch (err) {
    loggerService.error(`Had issue saving document to ${collectionName} collection with data: ${data}`)
    throw err
  }
}
async function put(collectionName, data) {
  try {

  } catch (err) {
    loggerService.error(`Had issue updating document in ${collectionName} collection with data: ${data}`)
    throw err
  }

}
async function remove(collectionName, id) {
  try {

  } catch (err) {
    loggerService.error(`Had issue removing document from ${collectionName} collection with id: ${id}`)
    throw err
  }
}

export const firebaseService = {
  query,
  get,
  post,
  put,
  remove
}
