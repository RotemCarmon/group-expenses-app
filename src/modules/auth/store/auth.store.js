import { defineStore } from 'pinia'
import { useCommonStore } from '@/modules/common/store';
import { authService } from '../services/auth.service.js'
import { getErrorMessage } from '../services/auth.error.js'
import { loggerService } from '@/modules/common/services/logger.service.js'
import { popupService } from '@/modules/common/services/popup.service.js'
import { router } from '@/router'


export const useAuthStore = defineStore('auth', {
  state: () => ({
    loggedInUser: authService.getLoggedinUser()
  }),
  actions: {
    async login({ userCreds }) {
      const commonStore = useCommonStore()
      commonStore.isLoading = true
      try {
        const user = await authService.login(userCreds)
        this.loggedInUser = user
        router.push('/')
      } catch (err) {
        const msg = getErrorMessage(err.code)
        popupService.error(msg)
        loggerService.error(err)
      } finally {
        commonStore.isLoading = false
      }
    },
    async signup({ userCreds }) {
      const commonStore = useCommonStore()
      commonStore.isLoading = true
      try {
        const user = await authService.signup(userCreds)
        this.loggedInUser = user
        popupService.success('User registered successfuly')
        router.push('/')

      } catch (err) {
        const msg = getErrorMessage(err.code)
        popupService.error(msg)
        loggerService.error(err)
      } finally {
        commonStore.isLoading = false
      }
    },
    async signout() {
      try {
        await authService.signout()
        this.loggedInUser = null
        router.push('/auth')

      } catch (err) {
        loggerService.error(err)
      }
    }
  }
});
