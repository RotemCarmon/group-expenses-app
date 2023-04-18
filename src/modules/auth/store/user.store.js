import { defineStore } from 'pinia'
import { useAuthStore } from './auth.store'
import { userService } from '../services/user.service.js'
import { loggerService } from '@/modules/common/services/logger.service.js'
import { popupService } from '@/modules/common/services/popup.service.js'



export const useUserStore = defineStore('user', {
  actions: {
    async updateUser({ user }) {
      const authStore = useAuthStore()
      try {
        const savedUser = await userService.updateUser(user)
        authStore.loggedInUser = savedUser
      } catch (err) {
        loggerService.error(err)
      }
    }
  }
})
