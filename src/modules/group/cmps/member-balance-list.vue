<template>
  <section class="member-balance-list-container">
    <div class="member" v-for="(amount, member) in balances" :key="member">
      <div class="name" data-testid="member-name">
        {{ findNameByEmailInGroup(member, group) }}
      </div>
      <div class="break-down" :class="{ pos: amount > 0, neg: amount < 0 }" data-testid="member-amount">
        {{ getSymbolFromCurrency(currency) }}
        {{ parseFloat(amount.toFixed(2)) }}
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue';

import { expenseService } from '@/modules/expense/services/expense.service';
import { findNameByEmailInGroup } from '@/modules/common/services/util.service.js';
import getSymbolFromCurrency from 'currency-symbol-map';

const props = defineProps({
  group: { type: Object },
  currency: { type: String },
});

const balances = ref(null);

// FUNCTIONS
async function getBalances(userCurrency) {
  balances.value = await expenseService.getBalances(props.group, userCurrency);
}

getBalances(props.currency);

// watch(props.currency, (val) => {
//   getBalances(val);
// });
</script>
