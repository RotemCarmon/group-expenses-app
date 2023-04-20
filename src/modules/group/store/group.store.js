import { defineStore } from 'pinia';
import { useCommonStore } from '@/modules/common/store';
import { groupService } from '../services/group.service.js'
import { loggerService } from '@/modules/common/services/logger.service.js'



export const useGroupStore = defineStore('group', {
  state: () => ({
    groups: []
  }),
  actions: {
    async loadGroups({ filterBy }) {
      const commonStore = useCommonStore()
      commonStore.isLoading = true
      try {
        // set filterBy 
        this.groups = await groupService.getGroups(filterBy)
        return this.groups
      } catch (err) {
        loggerService.error(err)
      } finally {
        commonStore.isLoading = false
      }
    },
    async getGroupById({ groupId }) {
      const commonStore = useCommonStore()
      commonStore.isLoading = true
      try {
        return await groupService.getGroupById(groupId)
      } catch (err) {
        loggerService.error(err)
      } finally {
        commonStore.isLoading = false
      }
    },
    async saveGroup({ group }) {
      const commonStore = useCommonStore()
      commonStore.isLoading = true
      try {
        const savedGroup = await groupService.saveGroup({ ...group })

        if (!!group.id) {
          const idx = this.groups.findIndex(g => g.id === group.id)
          if (idx === -1) return
          this.groups.splice(idx, 1, savedGroup)
        } else {
          this.groups.push(savedGroup)
        }

        return savedGroup
      } catch (err) {
        loggerService.error(err)
      } finally {
        commonStore.isLoading = false
      }
    },
    async removeGroup({ groupId }) {
      const commonStore = useCommonStore()
      commonStore.isLoading = true
      try {
        await groupService.removeGroup(groupId)
        this.groups = this.groups.filter(group => group.id !== groupId)

      } catch (error) {
        loggerService.error(err)
      } finally {
        commonStore.isLoading = false

      }
    }
  }
})