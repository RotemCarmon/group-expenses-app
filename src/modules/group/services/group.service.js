import { httpService } from '@/modules/common/services/http.service.js'
import { storageService } from '@/modules/common/services/async-storage.service.js'

import { makeId } from '@/modules/common/services/util.service.js'

const BASE_URL = 'group'

async function getGroups(filterBy = {}) {
  // return await httpService.get(BASE_URL, { ...filterBy })

  let groups = await storageService.query(BASE_URL)
  if (!groups || !groups.length) {
    groups = _getDefaultGroups()
    storageService.postMany(BASE_URL, groups)
  }
  return groups
}


async function getGroupById(groupId) {
  console.log('groupId:', groupId)
  // return await httpService.get(`${BASE_ID}/${groupId})

  return await storageService.get(BASE_URL, groupId)
}

export const groupService = {
  getGroups,
  getGroupById,
  getEmptyGroup
}

function getEmptyGroup() {
  return {
    name: '',
    description: '',
    members: [],
    expenses: {}
  }
}

function _getDefaultGroups() {
  return [
    {
      _id: makeId(8),
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
      _id: makeId(8),
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