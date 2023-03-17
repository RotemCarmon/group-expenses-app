import { firebaseService } from '@/modules/common/services/firestore.service.js';
import { utilService } from '@/modules/common/services/util.service.js'

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

export const groupService = {
  getGroups,
  getGroupById,
  getEmptyGroup,
  saveGroup,
  removeGroup,
  createMember,

}

function getEmptyGroup() {
  return {
    name: '',
    description: '',
    members: {},
    expenses: [],
    memberEmails: []
  }
}


function createMember(options = {}) {
  const { username = '', email = '', id = utilService.makeId(8), isOwner = false } = options
  return {
    name: username,
    email,
    id,
    isOwner,
    expenses: [],
    amountSpent: 0
  }
}