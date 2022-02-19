<template>
  <section class="summary-container">
    <p>Total spent: {{ summary.totalSpent }}</p>
    <p
      class="break-down-diff"
      v-for="(amount, name) in summary.summaryBreakDown"
      :key="name"
    >
      {{ name }}:
      <span :class="{ pos: amount >= 0, neg: amount < 0 }">
        {{ amount }}
      </span>
    </p>
    <pre>
      {{expenseService.expenses}}
    </pre>
  </section>
</template>

<script>
import { expenseService } from '../services/expense.service';
export default {
  name: 'summary-page',
  data() {
    return {
      summary: null,
      expenseService
    };
  },
  created() {
    const summary = expenseService.getSummary();
    this.summary = summary;
  },
};
</script>

<style lang="scss">
.summary-container {
  .pos {
    color: green;
  }
  .neg {
    color: red;
  }
}
</style>