<template>
  <section class="member-preview-container" @click="editMember">
    <div class="avatar-container letter-avatar">
      <div class="avatar">{{ props.member.name?.charAt(0).toUpperCase() }}</div>
    </div>
    <div class="name" data-testid="member-name">
      {{ member.name }}
    </div>
    <div class="break-down" :class="{ pos: amount > 0, neg: amount < 0 }" data-testid="member-amount">
      {{ getSymbolFromCurrency(props.currency) }}
      {{ parseFloat(amount.toFixed(2)) }}
    </div>
    <div class="amount-spent">Spent: {{ getSymbolFromCurrency(props.currency) }}{{ parseFloat(amountSpent.toFixed(2)) }}</div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import getSymbolFromCurrency from 'currency-symbol-map';
import { expenseService } from '@/modules/expense/services/expense.service';

const props = defineProps({
  member: { type: Object },
  amount: { type: Number },
  currency: { type: String },
});

const emit = defineEmits(['edit']);

const amountSpent = ref(null);
amountSpent.value = await getMemberAmountSpent();

async function getMemberAmountSpent() {
  return expenseService.getTotalExpenses(props.member.expenses, props.currency);
}

function editMember() {
  emit('edit', props.member.email);
}
</script>
