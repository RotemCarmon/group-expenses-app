import { groupService } from '../services/group.service.js'
import { loggerService } from '@/modules/common/services/logger.service.js'


const initialState = () => {
  return {
    groups: null
  }
}

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    groups({ groups }) { return groups }
  },
  mutations: {
    setGroups(state, { groups }) {
      state.groups = groups
    },
    resetState(state) {
      state = initState()
    }
  },
  actions: {
    async loadGroups({ commit }, { filterBy }) {
      try {
        const groups = await groupService.getGroups()
        commit({ type: 'setGroups', groups })
      } catch (err) {
        loggerService.error(err)
      }
    },
    async getGroupById({ }, {groupId}) {
      try {
        return await groupService.getGroupById(groupId)
      } catch (err) {
        loggerService.error(err)
      }
    }
  },
};
