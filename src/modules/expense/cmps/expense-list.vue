<template>
  <section class="expense-list-container" v-if="expenses">
    <main class="list-container">
      <div v-if="!expenses || !expenses.length" class="no-expenses no-data">
        <p>You have no expenses yet</p>
      </div>
      <div v-else class="expense-list">
        <expense-preview v-for="expense in expenses" :key="expense.id" :expense="expense" @openMenu="toggleMenu" />
      </div>
    </main>
    <!-- <div class="footer container">
      <button @click="exportExpenses" class="btn dark bottom-btn">Export</button>
    </div> -->
    
    <!-- OPTION MENU -->
    <transition name="menu-bottom" mode="out-in">
      <option-menu v-if="selectedExpense" :title="selectedExpense.description" @edit="goToEditExpense" @remove="removeExpense" @close="toggleMenu"> </option-menu>
    </transition>
  </section>
</template>

<script setup>
import expensePreview from './expense-preview.vue';
import optionMenu from '@/modules/common/cmps/option-menu.vue';
import { popupService } from '@/modules/common/services/popup.service.js';
import getSymbolFromCurrency from 'currency-symbol-map';
import { expenseService } from '../services/expense.service';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useExpenseStore } from '../store';
import { useGroupStore } from '../../group/store';

const props = defineProps({
  group: { type: Object },
});

// SETUPS
const expenseStore = useExpenseStore();
const groupStore = useGroupStore();
const route = useRoute();
const router = useRouter();

// VARIABLES
const group = ref(null);
const selectedExpense = ref(null);

// COMPUTED
const expenses = computed(() => {
  if (!props.group) return null;
  const res = props.group?.expenses?.reduce((expenses, expense) => {
    expenses.push(prepareExpenseReport(expense));
    return expenses;
  }, []);

  return res.sort((a, b) => a.createdAt - b.createdAt);
});

// FUNCTIONS
function prepareExpenseReport(expense) {
  return {
    ...expense,
    name: findNameByEmailInGroup(expense.spender),
    exclude: expense.exclude.map((exc) => findNameByEmailInGroup(exc)),
  };
}

function toggleMenu(expense) {
  selectedExpense.value = selectedExpense.value ? null : expense;
}


function findNameByEmailInGroup(email) {
  return Object.values(props.group.members).find((mem) => mem.email === email)?.name;
}
function goToEditExpense() {
  router.push(`/expense/edit/${props.group.id}/${selectedExpense.value.id}?spender=${selectedExpense.value.spender}`);
}
async function removeExpense() {
  const expense = selectedExpense.value;

  const isConfirm = await popupService.confirm({ title: 'Delete Expense', txt: `Are you sure you want to delete this expense?\n ${expense.description} ${getSymbolFromCurrency(expense.currency)}${expense.amount}`, approveTxt: 'Yes', cancelTxt: 'No' });
  if (!isConfirm) return;

  expenseStore.removeExpense({ expense, group: props.group });
}
function exportExpenses() {
  expenseService.exportExcel(props.group);
}
</script>
