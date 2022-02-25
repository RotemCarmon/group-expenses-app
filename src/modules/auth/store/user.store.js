import { userService } from '../services/user.service.js'
import { loggerService } from '@/modules/common/services/logger.service.js'
import { popupService } from '@/modules/common/services/popup.service.js'


export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async updateUser({ }, {user}) {
      try {
        const savedUser = await userService.updateUser(user)
      } catch (err) {
        loggerService.error(err)
      }
    }
  }
};
