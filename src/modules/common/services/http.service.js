import Axios from 'axios'
import { config } from '@/config/config'
import { loggerService } from '@/modules/common/services/logger.service.js'

import { utilService as utils } from './util.service';

var axios = Axios.create({
    withCredentials: true
})
export const httpService = {
    get(endpoint, params) {
        return ajax(endpoint, 'GET', null, params)
    },
    post(endpoint, data) {
        return ajax(endpoint, 'POST', data)
    },
    put(endpoint, data) {
        return ajax(endpoint, 'PUT', data)
    },
    delete(endpoint, data) {
        return ajax(endpoint, 'DELETE', data)
    }
}

async function ajax(endpoint, method = 'get', data = null, params = {}, headers = {}) {
    try {
        const res = await axios({
            url: `${config.serverUrl}/api/${endpoint}`,
            method,
            data,
            params,
            headers: { ...headers, 'session-id': sessionStorage.sessionId }
        })
        return res.data
    } catch (err) {
        if(endpoint === 'logger') return
        loggerService.error(`Had Issues ${method}ing to the backend, endpoint: ${endpoint}, with data: ${data}`)
        throw err
    }
}
