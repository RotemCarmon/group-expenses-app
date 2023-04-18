import { defineStore } from 'pinia';
import { currencyService } from '../services/currency.service.js'
import { loggerService } from '@/modules/common/services/logger.service.js'

export const useCommonStore = defineStore('common', {
  state: () => ({
    isLoading: false,
    currencies: []
  }),
  getters: {
    currencyCodes({ currencies }) { return Object.keys(currencies) },
  },
  actions: {
    async loadCurrencies() {
      try {
        this.currencies = await currencyService.getCurrencyData();
      } catch (err) {
        loggerService.error(err)
      }
    }
  },
});
