import { firebaseService } from '@/modules/common/services/firestore.service.js';

const COLLECTION_NAME = 'group'

async function getGroups(filterBy) {
  return await firebaseService.query(COLLECTION_NAME, filterBy)
}
async function getGroupById(groupId) {
  return await firebaseService.get(COLLECTION_NAME, groupId)
}

async function saveGroup(group) {
  if (group.id) {
    return await firebaseService.put(COLLECTION_NAME, group)
  } else {
    return await firebaseService.post(COLLECTION_NAME, group)
  }
}

async function removeGroup(groupId) {
  return await firebaseService.remove(COLLECTION_NAME, groupId)
}

const groupColors = [
  '#E26463',
  '#FF914D',
  '#FFDE5C',
  '#74C864',
  '#0079FF',
  '#A970FA',
  '#FA7DA2',
]

export const groupService = {
  getGroups,
  getGroupById,
  getEmptyGroup,
  saveGroup,
  removeGroup,
  groupColors

}

function getEmptyGroup() {
  return {
    name: '',
    description: '',
    members: {},
    expenses: [],
    memberEmails: [],
    color: null
  }
}


