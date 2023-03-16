import { httpService } from '@/modules/common/services/http.service.js'
import { storageService } from '@/modules/common/services/async-storage.service.js'

import { firebaseService } from '@/modules/common/services/firestore.service.js';

import { makeId } from '@/modules/common/services/util.service.js'

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
  getEmptyMember,
  saveGroup,
  removeGroup
}

function getEmptyGroup() {
  return {
    name: '',
    description: '',
    members: [],
    expenses: {},
    memberEmails: []
  }
}

function getEmptyMember() {
  return {
    name: '',
    email: '',
    id: makeId(8)
  }
}