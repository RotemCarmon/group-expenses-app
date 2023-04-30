import { memberService } from '@/modules/group/services/member.service';
import { utilService } from '@/modules/common/services/util.service';

// mocking firebase service
vi.mock('@/modules/common/services/firestore.service.js', () => ({}))

describe('MEMBER SERVICE', () => {


  describe('createMember', () => {
    let spyOnMakeId
    beforeEach(() => {
      spyOnMakeId = vi.spyOn(utilService, 'makeId').mockImplementation(() => 'abcd1234')
    })
    const emptyMember = {
      name: '',
      email: '',
      id: 'abcd1234',
      isOwner: false,
      expenses: [],
      amountSpent: 0
    }

    test('Should return an empty member if no values were added', () => {
      const member = memberService.createMember()

      expect(member).toEqual(emptyMember)
    })
    test('Should return an empty expense with default values for the values not specified', () => {
      const member = memberService.createMember({ username: 'Popo', email: 'popo@gmail.com' })

      expect(member).toEqual({ ...emptyMember, name: 'Popo', email: 'popo@gmail.com' })
    })

  })
})