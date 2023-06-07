// import { render, fireEvent, within, waitFor, waitForElementToBeRemoved, findByTestId } from '@testing-library/vue'
// import { setActivePinia, createPinia } from 'pinia'
// import { useGroupStore } from '@/modules/group/store/';
// import { useAuthStore } from '@/modules/auth/store/';
// import { currencyService } from '@/modules/common/services/currency.service';
// import { group, member1, member2, currencyData } from '../../../data/';
// import { router } from '@/router';
// import groupEdit from '@/modules/group/cmps/group-edit.vue';
// import { popupService } from '@/modules/common/services/popup.service';
// import { memberService } from '@/modules/group/services/member.service';
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

describe('EXPENSE LIST SELECTABLE', () => {
  describe('Render', () => {
    
  })
})