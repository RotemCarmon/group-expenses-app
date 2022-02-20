<template>
  <section class="group-details-container" v-if="group">
    <main>
      <div class="page-header">
        <div class="title">{{ group.name }}</div>
        <button class="add-expense-btn btn dark">+ Add Expense</button>
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
            {{ amount }}
          </div>
        </div>
      </template>
      <div v-else class="loader-container">
        <div class="app-loader"></div>
      </div>
    </main>
    <div class="total-spent">
      Total Spent
      <span>{{ totalSpent }}</span>
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
      totalSpent: 120,
      summary: null,
    };
  },
  methods: {
    async getExpenses(expenses) {
      const summary = expenseService.getSummary(expenses);
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
    getTotalExpenses(expenses) {
      this.totalSpent = expenseService.getTotalExpenses(expenses);
    },
  },
  async created() {
    const group = await this.getGroup();
    this.getExpenses(group?.expenses);
    this.getTotalExpenses(group?.expenses);
  },
};
</script>