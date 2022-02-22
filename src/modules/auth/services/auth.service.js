import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { userService } from './user.service.js'
const auth = getAuth()

const USER_SESSION_KEY = 'loggedInUser';

async function login(userCreds) {
  const { email, password } = userCreds
  const { user } = await signInWithEmailAndPassword(auth, email, password)
  const loggedInUser = await userService.getUserById(user.uid)
  _saveLocalUser(loggedInUser)
  return loggedInUser

}

async function signup(creds) {
  const { user } = await createUserWithEmailAndPassword(
    auth,
    creds.email,
    creds.password
  );
  creds.id = user.uid
  delete creds.password
  const loggedInUser = await userService.addUser(creds)
  _saveLocalUser(loggedInUser)
  return loggedInUser
}

async function signout() {
  await signOut(auth)
  clearLoggedUser
}

export const authService = {
  login,
  signup,
  signout,
  getLoggedinUser
}

function getLoggedinUser() {
  return JSON.parse(sessionStorage.getItem(USER_SESSION_KEY));
}

function _saveLocalUser(user) {
  if (!user) return
  sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
  return user;
}

function clearLoggedUser() {
  sessionStorage.removeItem(USER_SESSION_KEY);
}