import { currencyService } from '../services/currency.service.js'
import { loggerService } from '@/modules/common/services/logger.service.js'

export default {
  namespaced: true,
  state: {
    currencies: []
  },
  getters: {
    currencies({ currencies }) { return currencies },
    currencyCodes({ currencies }) { return Object.keys(currencies).sort() }
  },
  mutations: {
    setCurrencies(state, { currencies }) {
      state.currencies = currencies
    }
  },
  actions: {
    async loadCurrencies({ commit }) {
      try {
        const currencies = await currencyService.getCurrencyCodes();
        commit({ type: 'setCurrencies', currencies })
      } catch (err) {
        loggerService.error(err)
      }
    }
  },
};
