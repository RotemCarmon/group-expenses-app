import { httpService } from '@/modules/common/services/http.service.js'
import { storageService } from '@/modules/common/services/async-storage.service.js'

import { firebaseService } from '@/modules/common/services/firestore.service.js';

import { makeId } from '@/modules/common/services/util.service.js'

const COLLECTION_NAME = 'group'

async function getGroups(filterBy = {}) {
  // Build criteria
  return await firebaseService.query(COLLECTION_NAME, filterBy)
}
async function getGroupById(groupId) {
  return await firebaseService.get(COLLECTION_NAME, groupId)
}

async function saveGroup(group) {
  if(group.id) {
    return await firebaseService.put(COLLECTION_NAME, group)
  } else {
    return await firebaseService.post(COLLECTION_NAME, group)
    
  }
}

export const groupService = {
  getGroups,
  getGroupById,
  getEmptyGroup,
  getEmptyMember,
  saveGroup
}

function getEmptyGroup() {
  return {
    name: '',
    description: '',
    members: [],
    expenses: {}
  }
}

function getEmptyMember() {
  return {
    name: '',
    email:'',
    id: makeId(8)
  }
}

function _getDefaultGroups() {
  return [
    {
      id: makeId(8),
      name: 'Bansko 2022',
      description: 'Bansko trip calculating money to split',
      members: [
        { id: 103, name: 'Rotem', email: 'tetch6@gmail.com', isOwner: true },
        { id: 104, name: 'Ben', email: 'benY@gmail.com' },
        { id: 105, name: 'Nave', email: 'nane@gmail.com' },
      ],
      expenses: {
        'Rotem': [{ amount: 10, exclude: ['Ben'] }],
        'Ben': [{ amount: 21, exclude: [] }],
        'Nave': [],
      }
    },
    {
      id: makeId(8),
      name: 'BBQ at Yogev\'s',
      description: 'Spliting money for meat and drinks',
      members: [
        { id: 101, name: 'Popo', email: 'popo@gmail.com', isOwner: true },
        { id: 102, name: 'Momo', email: 'momo@gmail.com' }
      ],
      expenses: {
        'Popo': [],
        'Momo': [],
      }
    }
  ]
}