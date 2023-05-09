
export function getErrorMessage(errCode) {
  switch (errCode) {
    case 'auth/invalid-email':
      return 'Invalid email address'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Email or password is wrong'
    case 'auth/email-already-in-use':
      return 'Email is already in use'
    default:
      return 'Login failed please try again'
  }
}
