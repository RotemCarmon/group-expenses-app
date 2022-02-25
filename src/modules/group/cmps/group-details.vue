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
            {{ parseFloat(amount.toFixed(2)) }} {{currencySymble}}
          </div>
        </div>
      </template>
      <div v-else class="loader-container">
        <div class="app-loader"></div>
      </div>
    </main>
    <div class="total-spent">
      Total Spent
      <span>{{ parseFloat(totalSpent.toFixed(2)) }} {{currencySymble}}</span>
    </div>
  </section>
</template>

<script>
import { expenseService } from '../services/expense.service';
export default {
  name: 'group-details',
  data() {
    return {
      group: null,
      totalSpent: 0,
      summary: null,
    };
  },
  computed: {
    loggedInUser() {
      return this.$store.getters['authStore/loggedInUser'];
    },
    userCurrency() {
      return this.loggedInUser?.prefs?.currency
    },
    currencySymble(){
      const res = new Intl.NumberFormat({}, { style: 'currency', currency: this.userCurrency }).format(this.totalSpent)
      return res.charAt(0)
    }

  },
  methods: {
    async getExpenses(expenses) {
      const summary = await expenseService.getSummary(
        expenses,
        this.userCurrency
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
    async getTotalExpenses(expenses) {
      this.totalSpent = await expenseService.getTotalExpenses(expenses, this.userCurrency);
    },
    goToAddExpense() {
      this.$router.push(`${this.$route.fullPath}/expense`);
    },
  },
  async created() {
    const group = await this.getGroup();
    this.getExpenses(group?.expenses);
    this.getTotalExpenses(group?.expenses);
  },
};
</script>