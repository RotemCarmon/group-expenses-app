import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { userService } from './user.service.js'
import { auth } from '@/firebase';

const USER_SESSION_KEY = 'loggedInUser';

async function login(userCreds) {
  const { email, password } = userCreds
  const { user } = await signInWithEmailAndPassword(auth, email, password)
  const loggedInUser = await userService.getUserById(user.uid)
  saveLocalUser(loggedInUser)
  return loggedInUser

}

async function signup(creds) {
  const { user } = await createUserWithEmailAndPassword(
    auth,
    creds.email,
    creds.password
  );
  const userTosave = { ...creds, prefs: { currency: 'USD' } }
  userTosave.id = user.uid
  userTosave.createdAt = Date.now()

  delete userTosave.password
  const loggedInUser = await userService.updateUser(userTosave)
  saveLocalUser(loggedInUser)
  return loggedInUser
}

async function signout() {
  await signOut(auth)
  clearLoggedUser()
}

export const authService = {
  login,
  signup,
  signout,
  getLoggedinUser,
  saveLocalUser
}

function getLoggedinUser() {
  return JSON.parse(localStorage.getItem(USER_SESSION_KEY));
}

function saveLocalUser(user) {
  if (!user) return
  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
  return user;
}

function clearLoggedUser() {
  localStorage.removeItem(USER_SESSION_KEY);
}