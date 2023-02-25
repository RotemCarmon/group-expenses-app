<template>
  <div class="expense-preview-container">
    <div class="name">{{ expense.name }}</div>
    <div class="date">
      {{ formatDate(expense.createdAt, 'D') }}
    </div>
    <div class="description">{{ expense.description }}</div>
    <div class="amount">
      {{ getSymbolFromCurrency(expense.currency)
      }}{{ expense.amount.toFixed(2) }}
    </div>
    <div class="exclude" v-if="expense.exclude && expense.exclude.length">
      Exclude: {{ expense.exclude.join(', ') }}
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/modules/common/services/util.service';
import getSymbolFromCurrency from 'currency-symbol-map';
export default {
  name: 'expense-preview',
  props: {
    expense: { type: Object, required: true },
  },
  methods:{
formatDate,
getSymbolFromCurrency
  }
};
</script>

<style>
</style>