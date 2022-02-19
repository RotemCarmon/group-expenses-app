import Vue from 'vue';
import Vuex from 'vuex';

import authStore from '@/modules/auth/store'
import commonStore from '@/modules/common/store'
import groupStore from '@/modules/group/store'
import expenseStore from '@/modules/expense/store'

Vue.use(Vuex);

export const store = new Vuex.Store({
  strict: process.env.NODE_ENV === "development",
  state: {},
  getters: {},
  mutations: {},
  modules: {
    ...authStore,
    ...commonStore,
    ...groupStore,
    ...expenseStore
  }
})