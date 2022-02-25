import axios from 'axios';
import { storageService } from './storage.service'

const API_KEY = '50f13780-964b-11ec-9134-29068c847baf'

async function getCurrencyCodes() {
  const expTime = 1000 * 60 * 60 * 24 * 5 // 24h
  try {
    let currencyData = storageService.load('currency')

    if (!currencyData || !Object.keys(currencyData?.data).length || currencyData.exp < Date.now()) {
      const res = await axios.get(`https://freecurrencyapi.net/api/v2/latest?apikey=${API_KEY}`)

      currencyData = {
        exp: Date.now() + expTime,
        data: res.data.data

      }
      let currencyData = storageService.save('currency', currencyData)
    }
    return currencyData.data


  } catch (err) {
    console.error(err);
  }
}

export const currencyService = {
  getCurrencyCodes
}