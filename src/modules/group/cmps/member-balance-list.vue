<template>
  <section class="member-balance-list-container">
    <main class="list-container">
      <div class="member-list">
        <div class="member" v-for="(amount, member) in balances" :key="member" @click="editMember">
          <div class="avatar-container letter-avatar">
            <div class="avatar">{{ findNameByEmailInGroup(member, group)?.charAt(0).toUpperCase() }}</div>
          </div>
          <div class="name" data-testid="member-name">
            {{ findNameByEmailInGroup(member, group) }}
          </div>
          <div class="break-down" :class="{ pos: amount > 0, neg: amount < 0 }" data-testid="member-amount">
            {{ getSymbolFromCurrency(currency) }}
            {{ parseFloat(amount.toFixed(2)) }}
          </div>
          <div class="amount-spent">Spent: {{ getSymbolFromCurrency(currency) }}{{ parseFloat(getMemberAmountSpent(member).toFixed(2)) }}</div>
        </div>
      </div>
    </main>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

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


function getMemberAmountSpent(memberEmail) {
  return props.group.members[memberEmail]?.amountSpent
}
getBalances(props.currency);
</script>
