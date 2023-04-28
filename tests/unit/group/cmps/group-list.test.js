import { render, fireEvent, within, waitFor } from '@testing-library/vue'
import { setActivePinia, createPinia } from 'pinia'
import { useGroupStore } from '@/modules/group/store/';
import { useAuthStore } from '@/modules/auth/store/';
import { group, member1, member2 } from '../../../data/';
import { router } from '@/router';

// mocking firebase service
vi.mock('@/modules/common/services/firestore.service.js', () => ({}))

import groupList from '@/modules/group/cmps/group-list.vue';

const renderOptions = {
  global: {
    plugins: [router],
  },
}


describe('Group List', () => {

  let groupStore
  let authStore
  beforeEach(() => {
    window.sessionStorage.setItem('loggedInUser', JSON.stringify(member1))

    setActivePinia(createPinia())
    groupStore = useGroupStore()
    authStore = useAuthStore()
    groupStore.groups = [group]
  })
  describe('Render', () => {

    test('should render group list', async () => {
      const { getByText } = render(groupList, renderOptions);

      getByText('Test Group')
    })

    test('should render no groups yet if no groups in store', async () => {
      groupStore.groups = []

      const text = 'You have no groups'
      const { getByText } = render(groupList, renderOptions);

      getByText(text)
    })

    test('should open the option menu for the clicked group', async () => {
      const { getByTestId } = render(groupList, renderOptions);

      await fireEvent.click(getByTestId('group-menu'))
      getByTestId('option-menu')
    })

    test('should present the clicked group\'s name in the option menu', async () => {
      const { getByTestId } = render(groupList, renderOptions);

      await fireEvent.click(getByTestId('group-menu'))

      within(getByTestId('option-menu')).getByText('Test Group')
    })

  })

  describe('CRUD', () => {
    test('should navigate to group details when clicking a group', async () => {
      const spyOnRouterPush = vi.spyOn(router, 'push')

      const { getByTestId } = render(groupList, renderOptions);
      await fireEvent.click(getByTestId('group-preview'))

      expect(spyOnRouterPush).toHaveBeenCalledWith('group/G1001')
    })

    test('should navigate to group edit when clicking the add button', async () => {
      const spyOnRouterPush = vi.spyOn(router, 'push')

      const { getByTestId } = render(groupList, renderOptions);
      await fireEvent.click(getByTestId('add-group-btn'))

      expect(spyOnRouterPush).toHaveBeenCalledWith('/group/edit')
    })


    test('should navigate to group edit with the group id when clicking edit button in the options menu', async () => {
      const spyOnRouterPush = vi.spyOn(router, 'push')

      const { getByTestId } = render(groupList, renderOptions);

      // opening the option menu
      await fireEvent.click(getByTestId('group-menu'))

      await fireEvent.click(getByTestId('edit-btn'))

      expect(spyOnRouterPush).toHaveBeenCalledWith('/group/edit/G1001')
    })
    test('should not allow to navigate to group edit if the logged in user is not the group\'s owner', async () => {
      const spyOnRouterPush = vi.spyOn(router, 'push')
      authStore.loggedInUser = member2

      const { getByTestId } = render(groupList, renderOptions);

      // opening the option menu
      await fireEvent.click(getByTestId('group-menu'))

      await fireEvent.click(getByTestId('edit-btn'))

      expect(spyOnRouterPush).not.toHaveBeenCalled()
    })


    test('should remove the selected group when clicking delete button in the options menu', async () => {
      const { getByTestId, getByText } = render(groupList, renderOptions);

      vi.spyOn(groupStore, 'removeGroup').mockImplementation(function ({ groupId }) {
        this.groups = this.groups.filter(group => group.id !== groupId)
      })

      // opening the option menu
      await fireEvent.click(getByTestId('group-menu'))
      await fireEvent.click(getByTestId('delete-btn'))


      await fireEvent.click(getByTestId('approve-btn'))

      getByText('You have no groups')
    })

    test('should not allow to delete a group if the logged in user is not the group\'s owner', async () => {
      authStore.loggedInUser = member2
      const spyOnRemoveGroup = vi.spyOn(groupStore, 'removeGroup')
      const { getByTestId } = render(groupList, renderOptions);


      // opening the option menu
      await fireEvent.click(getByTestId('group-menu'))
      await fireEvent.click(getByTestId('delete-btn'))


      expect(spyOnRemoveGroup).not.toHaveBeenCalled()
    })

    test('should not remove group if the user denied the action', async () => {
      const spyOnRemoveGroup = vi.spyOn(groupStore, 'removeGroup')
      const { getByTestId } = render(groupList, renderOptions);


      // opening the option menu
      await fireEvent.click(getByTestId('group-menu'))
      await fireEvent.click(getByTestId('delete-btn'))

      await fireEvent.click(getByTestId('cancel-btn'))

      expect(spyOnRemoveGroup).not.toHaveBeenCalled()
    })


  })

})