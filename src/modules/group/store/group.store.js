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
    addGroup(state, { group }) {
      state.groups.push(group)
    },
    updateGroup(state, { group }) {
      const idx = state.groups.findIndex(g => g.id === group.id)
      if (idx === -1) return
      state.groups.splice(idx, 1, group)
    },

    resetState(state) {
      state = initState()
    }
  },
  actions: {
    async loadGroups({ commit }, { filterBy }) {
      commit({ type: 'setLoading', isLoading: true }, { root: true })
      try {
        // set filterBy 
        const groups = await groupService.getGroups(filterBy)
        commit({ type: 'setGroups', groups })
      } catch (err) {
        loggerService.error(err)
      } finally {
        commit({ type: 'setLoading', isLoading: false }, { root: true })
      }
    },
    async getGroupById({commit }, { groupId }) {
      commit({ type: 'setLoading', isLoading: true }, { root: true })
      try {
        return await groupService.getGroupById(groupId)
      } catch (err) {
        loggerService.error(err)
      } finally {
        commit({ type: 'setLoading', isLoading: false }, { root: true })
      }
    },
    async saveGroup({ commit }, { group }) {
      commit({ type: 'setLoading', isLoading: true }, { root: true })
      try {
        const type = (!!group.id) ? 'updateGroup' : 'addGroup'

        const savedGroup = await groupService.saveGroup(group)
        commit({ type, group: savedGroup })
        return savedGroup
      } catch (err) {
        loggerService.error(err)
      } finally {
        commit({ type: 'setLoading', isLoading: false }, { root: true })
      }
    }
  },
};
