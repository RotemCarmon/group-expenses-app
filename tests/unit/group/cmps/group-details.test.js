import { render, fireEvent, within, waitFor, findByText } from '@testing-library/vue'
import { setActivePinia, createPinia } from 'pinia'
import { useGroupStore } from '@/modules/group/store/';
import { useAuthStore } from '@/modules/auth/store/';
import { currencyService } from '@/modules/common/services/currency.service';
import { group, member1, member2, currencyData } from '../../../data/';
import { router } from '@/router';
import groupDetails from '@/modules/group/cmps/group-details.vue';
import { popupService } from '@/modules/common/services/popup.service';

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
  },
}

describe('Group Details', () => {

  let groupStore
  let authStore
  beforeEach(() => {
    window.localStorage.setItem('loggedInUser', JSON.stringify({ ...member1, prefs: { currency: 'USD' } }))

    setActivePinia(createPinia())
    groupStore = useGroupStore()
    authStore = useAuthStore()
    groupStore.groups = [group]


    vi.spyOn(groupStore, 'getGroupById').mockResolvedValue(group)
    vi.spyOn(currencyService, 'getCurrencyData').mockResolvedValue(currencyData)

  })

  describe('render', () => {
    test('should render component', async () => {

      const { findByText } = render(groupDetails, renderOptions);

      await findByText('Test Group')
    })

    test('Should render all group members in a list', async () => {
      const { findAllByTestId } = render(groupDetails, renderOptions);

      const names = Object.values(group.members).map(member => member.name)


      const nameEls = await findAllByTestId('member-name')
      expect(nameEls).toHaveLength(2)

      nameEls.forEach((nameEl, idx) => {
        within(nameEl).getByText(names[idx])
      })

    })

    test('should render the right amount for each member', async () => {
      const { findAllByTestId } = render(groupDetails, renderOptions);

      const expected = ['$ 10', '$ -10']
      const amountEls = await findAllByTestId('member-amount')

      amountEls.forEach((amountEl, idx) => {
        expect(amountEl.innerHTML).toBe(expected[idx])
      })
    })

    test('should render the total spent value', async () => {
      const { findByTestId } = render(groupDetails, renderOptions);

      const totalSpent = await findByTestId('total-spent')

      expect(totalSpent.querySelector('span').innerHTML).toBe('$ 40')

    })

    describe('present the correct currency symbol', () => {
      test('When user prefered currency is USD', async () => {
        const symbol = '$'
        const { findAllByTestId } = render(groupDetails, renderOptions);

        const amountEl = await findAllByTestId('member-amount')

        expect(amountEl[0].innerHTML).toContain(symbol)
      })
      test('When user prefered currency is EUR', async () => {
        const symbol = '€'
        authStore.loggedInUser.prefs.currency = 'EUR'
        const { findAllByTestId } = render(groupDetails, renderOptions);

        const amountEl = await findAllByTestId('member-amount')

        expect(amountEl[0].innerHTML).toContain(symbol)
      })
      test('When user prefered currency is ILS', async () => {
        const symbol = '₪'
        authStore.loggedInUser.prefs.currency = 'ILS'
        const { findAllByTestId } = render(groupDetails, renderOptions);

        const amountEl = await findAllByTestId('member-amount')

        expect(amountEl[0].innerHTML).toContain(symbol)
      })
    })

    describe('script', () => {
      let spyOnRouterPush
      beforeEach(() => {
        spyOnRouterPush = vi.spyOn(router, 'push')
      })
      test('should navigate to edit expense page with the group id when clicking add expense in option menu', async () => {


        const { findByTestId, getByText } = render(groupDetails, renderOptions);

        const optionsMenu = await findByTestId('group-menu')
        await fireEvent.click(optionsMenu)
        await fireEvent.click(getByText('Add Expense'))


        expect(spyOnRouterPush).toHaveBeenCalledWith('/expense/edit/G1001')
      })
      test('should navigate to expense list with the group id when clicking show all expenses expense in option menu', async () => {

        const { findByTestId, getByText } = render(groupDetails, renderOptions);

        const optionsMenu = await findByTestId('group-menu')
        await fireEvent.click(optionsMenu)
        await fireEvent.click(getByText('Show All Expenses'))


        expect(spyOnRouterPush).toHaveBeenCalledWith('/expense/G1001')
      })

      describe('clicking on edit in option menu', () => {


        test('should navigate to the group edit page if user is the group owner', async () => {
          const { findByTestId, getByText } = render(groupDetails, renderOptions);

          const optionsMenu = await findByTestId('group-menu')
          await fireEvent.click(optionsMenu)
          await fireEvent.click(getByText('Edit'))

          expect(spyOnRouterPush).toHaveBeenCalledWith('/group/edit/G1001')
        })
        test('shouldn\'t navigate to the group edit page if user is not the group owner', async () => {
          authStore.loggedInUser = { ...member2, prefs: { currency: 'USD' } }
          const { findByTestId, getByText } = render(groupDetails, renderOptions);

          const optionsMenu = await findByTestId('group-menu')
          await fireEvent.click(optionsMenu)
          await fireEvent.click(getByText('Edit'))

          expect(spyOnRouterPush).not.toHaveBeenCalled()
        })
      })

      describe('clicking on delete in option menu', () => {

        beforeEach(() => {
          vi.spyOn(groupStore, 'removeGroup').mockImplementation(function ({ groupId }) {
            this.groups = this.groups.filter(group => group.id !== groupId)
            return groupId
          })
        })

        test('should remove the group and navigate to group list, if user is the group owner', async () => {
          const { findByTestId, getByTestId } = render(groupDetails, renderOptions);

          const optionsMenu = await findByTestId('group-menu')
          await fireEvent.click(optionsMenu)
          await fireEvent.click(getByTestId('delete-btn'))


          await fireEvent.click(getByTestId('approve-btn'))

          await waitFor(() => expect(spyOnRouterPush).toHaveBeenCalledWith('/group/'))

        })
        test('should not allow to remove the group if user is not the group owner', async () => {
          authStore.loggedInUser = { ...member2, prefs: { currency: 'USD' } }
          const spyOnConfirm = vi.spyOn(popupService, 'confirm')
          const spyOnWarn = vi.spyOn(popupService, 'warn')

          const { findByTestId, getByTestId } = render(groupDetails, renderOptions);

          const optionsMenu = await findByTestId('group-menu')
          await fireEvent.click(optionsMenu)
          await fireEvent.click(getByTestId('delete-btn'))

          expect(spyOnWarn).toHaveBeenCalledWith('Only the group owner can delete')
          expect(spyOnConfirm).not.toHaveBeenCalled()

        })
      })
    })
  })

})