import { render, fireEvent, within, waitFor, waitForElementToBeRemoved, findByTestId } from '@testing-library/vue'
import { setActivePinia, createPinia } from 'pinia'
import { useGroupStore } from '@/modules/group/store/';
import { useAuthStore } from '@/modules/auth/store/';
import { currencyService } from '@/modules/common/services/currency.service';
import { group, member1, member2, currencyData } from '../../../data/';
import { router } from '@/router';
import groupEdit from '@/modules/group/cmps/group-edit.vue';
import { popupService } from '@/modules/common/services/popup.service';
import { memberService } from '@/modules/group/services/member.service';
import * as VueRouter from 'vue-router';

// mocking firebase service
vi.mock('@/modules/common/services/firestore.service.js', () => ({}))

vi.mock('vue-router', async () => {
  const actual = await vi.importActual("vue-router")
  return {
    ...actual,
    useRoute: vi.fn().mockReturnValue({ params: { groupId: 'G1001' } })
  }
})

const renderOptions = {
  global: {
    plugins: [router],
    stubs: [
      'font-awesome-icon'
    ]
  },
}


describe('Group Edit', () => {
  let groupStore
  let authStore
  let spyOnAddMember
  let spyOnConfirm
  beforeEach(() => {
    window.localStorage.setItem('loggedInUser', JSON.stringify({ ...member1, username: member1.name, prefs: { currency: 'USD' } }))

    setActivePinia(createPinia())
    groupStore = useGroupStore()
    authStore = useAuthStore()
    groupStore.groups = [group]


    vi.spyOn(groupStore, 'getGroupById').mockResolvedValue(group)
    vi.spyOn(currencyService, 'getCurrencyData').mockResolvedValue(currencyData)
    spyOnAddMember = vi.spyOn(memberService, 'addMember')
    spyOnConfirm = vi.spyOn(popupService, 'confirm')

  })

  // afterEach(()=>{
  //   vi.clearAllMocks();
  // })

  describe('Render', () => {
    describe('component header', () => {
      test('should set header to add if adding new group', async () => {
        vi.spyOn(VueRouter, 'useRoute').mockReturnValueOnce({ params: {} })

        const { findByText } = render(groupEdit, renderOptions);

        const el = await findByText('Add Group')
        expect(el).toBeTruthy()
      })

      test('should set header to edit if editing a group', async () => {
        const { findByText } = render(groupEdit, renderOptions);

        const el = await findByText('Edit Group')
        expect(el).toBeTruthy()
      })
    })


    describe('group to edit', () => {
      test('should set the group name in the right field', async () => {
        const { findByRole } = render(groupEdit, renderOptions);
        const expectedText = 'Test Group'

        const elInput = await findByRole('textbox', { name: 'group name' })
        expect(elInput.value).toBe(expectedText)
      })
      test('should set the group description in the right field', async () => {
        const { findByRole } = render(groupEdit, renderOptions);
        const expectedText = 'This is a group for testing'


        const elInput = await findByRole('textbox', { name: 'group description' })
        expect(elInput.value).toBe(expectedText)
      })

      test('should render a list of members in the group', async () => {
        const { findByRole, debug } = render(groupEdit, renderOptions);
        const expectedMemberNames = ['Test Member', 'Test Member 2']

        const members = await findByRole('generic', { name: 'members-list' })
        const memberNamesEls = await within(members).findAllByTestId('member-name')
        const memberNames = memberNamesEls.map(m => m.textContent)

        expect(memberNames).toHaveLength(2)
        expect(memberNames).toEqual(expectedMemberNames)
      })
      test('should render a "Owner" text next to the group owner\'s name', async () => {
        const { findByRole } = render(groupEdit, renderOptions);

        const members = await findByRole('generic', { name: 'members-list' })
        const ownerMemberDiv = (await within(members).findByText('Test Member')).closest("div")
        const groupOwnerEl = within(ownerMemberDiv).getByTestId('group-owner')

        expect(groupOwnerEl.textContent).toBe('Owner')
      })
    })

    describe('new group', () => {

      test('should have the logged in user as the group owner', async () => {
        vi.spyOn(VueRouter, 'useRoute').mockReturnValueOnce({ params: {} })

        const { findByRole, debug } = render(groupEdit, renderOptions);

        const members = await findByRole('generic', { name: 'members-list' })
        const memberNamesEls = await within(members).findAllByTestId('member-name')

        expect(memberNamesEls).toHaveLength(1)
        expect(memberNamesEls[0].textContent).toBe('Test Member')

      })
    })

  })
  describe('Script', () => {
    describe('add member', () => {

      test('should render empty edit member form', async () => {
        const { findByRole, findByTestId } = render(groupEdit, renderOptions);

        const addMemberBtn = await findByTestId('add-member')
        await fireEvent.click(addMemberBtn)

        const elMemberForm = await findByRole('form')
        const elName = within(elMemberForm).getByRole('textbox', { name: 'member-name' })
        const elEmail = within(elMemberForm).getByRole('textbox', { name: 'member-email' })

        expect(elMemberForm).toMatchSnapshot()
        expect(elName.value).toBe('')
        expect(elEmail.value).toBe('')
      })

      test('should popup an error if member already exists', async () => {
        const spyOnError = vi.spyOn(popupService, 'error')
        const { findByRole, findByTestId } = render(groupEdit, renderOptions);

        const newMemberName = 'New Member'
        const existingMemberEmail = 'test2@example.com'
        const expectedError = 'Member already exist with this email'

        const addMemberBtn = await findByTestId('add-member')

        await fireEvent.click(addMemberBtn)

        const elMemberForm = await findByRole('form')
        const elName = within(elMemberForm).getByRole('textbox', { name: 'member-name' })
        const elEmail = within(elMemberForm).getByRole('textbox', { name: 'member-email' })

        await fireEvent.update(elName, newMemberName)
        await fireEvent.update(elEmail, existingMemberEmail)

        await fireEvent.submit(elMemberForm)


        expect(spyOnError).toHaveBeenCalledWith(expectedError)
      })

      test('should add the member to the to the group', async () => {
        vi.spyOn(groupStore, 'getGroupById').mockResolvedValue({ ...group, expenses: [] })

        const { findByRole, findByTestId } = render(groupEdit, renderOptions);

        const newMemberName = 'New Member'
        const existingMemberEmail = 'new_member@example.com'

        const addMemberBtn = await findByTestId('add-member')
        await fireEvent.click(addMemberBtn)

        const elMemberForm = await findByRole('form')
        const elName = within(elMemberForm).getByRole('textbox', { name: 'member-name' })
        const elEmail = within(elMemberForm).getByRole('textbox', { name: 'member-email' })

        await fireEvent.update(elName, newMemberName)
        await fireEvent.update(elEmail, existingMemberEmail)

        await fireEvent.submit(elMemberForm)


        expect(spyOnAddMember).toHaveBeenCalled()
      })

      describe('To active group', () => {
        test('should inform the user that neeed to select expenses for the new member', async () => {
          const { findByRole, findByTestId } = render(groupEdit, renderOptions);
          const expectedConfirmObj = { title: 'Add New Member', txt: "In order to add a new member to an active group, you'll need to select which expenses to include them in." }

          const newMemberName = 'New Member'
          const existingMemberEmail = 'new_member@example.com'

          const addMemberBtn = await findByTestId('add-member')
          await fireEvent.click(addMemberBtn)

          const elMemberForm = await findByRole('form')
          const elName = within(elMemberForm).getByRole('textbox', { name: 'member-name' })
          const elEmail = within(elMemberForm).getByRole('textbox', { name: 'member-email' })

          await fireEvent.update(elName, newMemberName)
          await fireEvent.update(elEmail, existingMemberEmail)

          await fireEvent.submit(elMemberForm)


          const elConfirm = await findByTestId('confirm')
          const elCancelBtn = await within(elConfirm).findByTestId('cancel-btn')
          await fireEvent.click(elCancelBtn)
          await waitForElementToBeRemoved(elConfirm)

          expect(spyOnConfirm).toHaveBeenCalledWith(expectedConfirmObj)
        })

        test('should not add member if user choose not to select expenses', async () => {
          const { findByRole, findByTestId } = render(groupEdit, renderOptions);

          const newMemberName = 'New Member'
          const existingMemberEmail = 'new_member@example.com'

          const addMemberBtn = await findByTestId('add-member')
          await fireEvent.click(addMemberBtn)

          const elMemberForm = await findByRole('form')
          const elName = within(elMemberForm).getByRole('textbox', { name: 'member-name' })
          const elEmail = within(elMemberForm).getByRole('textbox', { name: 'member-email' })

          await fireEvent.update(elName, newMemberName)
          await fireEvent.update(elEmail, existingMemberEmail)

          await fireEvent.submit(elMemberForm)

          const elConfirm = await findByTestId('confirm')
          const elCancelBtn = await within(elConfirm).findByTestId('cancel-btn')
          await fireEvent.click(elCancelBtn)

          await waitForElementToBeRemoved(elConfirm)
          expect(spyOnAddMember).not.toHaveBeenCalled()
        })
        test('should render expense list selectable component', async () => {

          const { findByRole, findByTestId, findByText } = render(groupEdit, renderOptions);

          const newMemberName = 'New Member'
          const existingMemberEmail = 'new_member@example.com'

          const addMemberBtn = await findByTestId('add-member')
          await fireEvent.click(addMemberBtn)

          const elMemberForm = await findByRole('form')
          const elName = within(elMemberForm).getByRole('textbox', { name: 'member-name' })
          const elEmail = within(elMemberForm).getByRole('textbox', { name: 'member-email' })

          await fireEvent.update(elName, newMemberName)
          await fireEvent.update(elEmail, existingMemberEmail)

          await fireEvent.submit(elMemberForm)

          const elConfirm = await findByTestId('confirm')
          const elApproveBtn = await within(elConfirm).findByTestId('approve-btn')
          await fireEvent.click(elApproveBtn)
          await waitForElementToBeRemoved(elConfirm)

          const elExpenseListElextable = await findByText('Please select which expenses the new member should be included in.')
          expect(elExpenseListElextable).toBeTruthy()
        })
      })
    })
  })




  // Adding new member to active group - 

  // closing the exepnse list selecable before saving will remove the member from the group

  // removeing a member - 
  // not an owner - should warn that only the owner can delete
  // ask if sure to wish to ermove the member
  // remove member from list
  // remove member's email from memberEmails
  // remove the member email from the exclude of all expenses
  // remove all the expenses the removed member is the spender of

  // saving a group - 
  // must contain group name
  // add group to groups list
  // navigate to '/group/' + id

})