import { authService } from '../services/auth.service.js'
import { loggerService } from '@/modules/common/services/logger.service.js'
import { popupService } from '@/modules/common/services/popup.service.js'
import { router } from '@/router'

export default {
  namespaced: true,
  state: {
    loggedInUser: null
  },
  getters: {
    loggedInUser({ loggedInUser }) { return loggedInUser }
  },
  mutations: {
    setLoggedInUser(state, { loggedInUser }) {
      state.loggedInUser = loggedInUser
    }

  },
  actions: {
    async login({commit }, { userCreds }) {
      try {
        const user = await authService.login(userCreds)
        console.log('user:', user)
        commit({ type: 'setLoggedInUser', loggedInUser: user })
        router.push('/')
      } catch (err) {
        loggerService.error(err)
      }
    },
    async signup({ commit }, { userCreds }) {
      try {
        const user = await authService.signup(userCreds)
        console.log('user:', user)
        commit({ type: 'setLoggedInUser', loggedInUser: user })
        popupService.success('User registered successfuly')
        router.push('/')

      } catch (err) {
        loggerService.error(err)
      }
    },
    async signout({ commit }, ) {
      try {
        await authService.signout()
        commit({ type: 'setLoggedInUser', loggedInUser: null })
        router.push('/auth')

      } catch (err) {
        loggerService.error(err)
      }
    }
  },
};
