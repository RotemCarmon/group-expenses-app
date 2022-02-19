<template>
  <section class="add-expense-container">
    <input v-model.number="amount" type="text" />
    <h3>Who spent?</h3>
    <select v-model="spender">
      <option v-for="partic in participents" :key="partic" :value="partic">
        {{ partic }}
      </option>
    </select>
    <h3>Excluded members</h3>
    <div class="participents-list">
      <label v-for="partic in participents" :key="partic">
        <input type="checkbox" v-model="exclude" :value="partic" />
        {{ partic }}
      </label>
    </div>
    <button @click="addAmount">Enter</button>
    <pre>
      {{ exclude }}
    </pre>
  </section>
</template>

<script>
import { expenseService } from '../services/expense.service';
export default {
  name: 'add-expense',
  data() {
    return {
      amount: 0,
      spender: '', // default to current user
      exclude: [],
      participents: null,
    };
  },
  methods: {
    addAmount() {
      const { spender, amount, exclude } = this;
      if (!spender) {
        console.log('Must choose a spender'); // TODO: change to logger
        return;
      }
      const expense = { amount, exclude };
      expenseService.addExpense(spender, expense);
      this.clearExpense();
    },
    clearExpense() {
      this.spender = '';
      this.amount = 0;
      this.exclude = [];
    },
  },
  created() {
    this.participents = expenseService.participents;
  },
};
</script>

<style lang="scss">
.add-expense-container {
  label {
    display: flex;
    align-items: center;
  }
}
</style>