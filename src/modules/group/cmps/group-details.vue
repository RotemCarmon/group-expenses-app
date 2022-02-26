<template>
  <section class="group-details-container container" v-if="group">
    <main>
      <div class="page-header">
        <div class="title">{{ group.name }}</div>
        <button class="add-expense-btn btn dark" @click="goToAddExpense">
          + Add Expense
        </button>
      </div>
      <template v-if="summary">
        <div class="member" v-for="(amount, member) in summary" :key="member">
          <div class="name">
            {{ member }}
          </div>
          <div
            class="break-down"
            :class="{ pos: amount >= 0, neg: amount < 0 }"
          >
            {{ parseFloat(amount.toFixed(2)) }} {{ getSymbolFromCurrency(userCurrency) }}
          </div>
        </div>
      </template>
      <div v-else class="loader-container">
        <div class="app-loader"></div>
      </div>
    </main>
    <div class="total-spent">
      Total Spent
      <span>{{ parseFloat(totalSpent.toFixed(2)) }} {{ getSymbolFromCurrency(userCurrency) }}</span>
    </div>
  </section>
</template>

<script>
import getSymbolFromCurrency from 'currency-symbol-map'
import { eventBus } from '@/modules/common/services/event-bus.service.js';
import { expenseService } from '../services/expense.service';
export default {
  name: 'group-details',
  data() {
    return {
      group: null,
      totalSpent: 0,
      summary: null,
      getSymbolFromCurrency,
    };
  },
  computed: {
    loggedInUser() {
      return this.$store.getters['authStore/loggedInUser'];
    },
    userCurrency() {
      return this.loggedInUser?.prefs?.currency;
    }
  },
  methods: {
    async getExpenses(userCurrency) {
      const { expenses } = this.group;
      const summary = await expenseService.getSummary(
        expenses,
        userCurrency
      );
      // make sure this value updates when user pref currency is updated
      this.summary = summary;
    },
    async getGroup() {
      const { groupId } = this.$route.params;
      if (!groupId) return;
      const group = await this.$store.dispatch({
        type: 'groupStore/getGroupById',
        groupId,
      });
      this.group = group;
      return group;
    },
    async getTotalExpenses(userCurrency) {
      const { expenses } = this.group;
      this.totalSpent = await expenseService.getTotalExpenses(
        expenses,
        userCurrency
      );
    },
    goToAddExpense() {
      this.$router.push(`${this.$route.fullPath}/expense`);
    },
    getSummeryData(userCurrency = this.userCurrency) {
      this.getExpenses(userCurrency);
      this.getTotalExpenses(userCurrency);
    },
  },
  async created() {
    await this.getGroup();
    this.getSummeryData();

    eventBus.$on('currency-updated', (userCurrency) => {
      console.log('updated currency:', userCurrency)
      this.getSummeryData(userCurrency);
    });
  },
};
</script>