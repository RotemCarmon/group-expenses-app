<template>
  <section class="expense-list-container" v-if="expenses && group">
    <div class="title container">
      <h3 class="group-name">{{ group.name }}</h3>
    </div>

    <main class="list-container">
      <div class="expense-list">
        <expense-preview v-for="expense in expenses" :key="expense.id" :expense="expense" @openMenu="toggleMenu" />
      </div>
    </main>
    <div class="footer container">
      <button @click="exportExpenses" class="btn dark bottom-btn">Export</button>
    </div>

    <!-- OPTION MENU -->
    <transition name="menu-bottom" mode="out-in">
      <option-menu v-if="selectedExpense" :title="selectedExpense.description" @edit="goToEditExpense" @remove="removeExpense" @close="toggleMenu"> </option-menu>
    </transition>
  </section>
</template>

<script setup>
import expensePreview from './expense-preview';
import optionMenu from '@/modules/common/cmps/option-menu';
import { popupService } from '@/modules/common/services/popup.service.js';
import getSymbolFromCurrency from 'currency-symbol-map';
import { expenseService } from '../services/expense.service';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useExpenseStore } from '../store';
import { useGroupStore } from '../../group/store';

const expenseStore = useExpenseStore();
const groupStore = useGroupStore();

const route = useRoute();
const router = useRouter();

const group = ref(null);
const selectedExpense = ref(null);

const expenses = computed(() => {
  if (!group.value) return null;
  const res = group.value?.expenses?.reduce((expenses, expense) => {
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

async function getGroup() {
  const { groupId } = route.params;
  if (!groupId) return;
  group.value = await groupStore.getGroupById({ groupId });
  return group.value;
}

function findNameByEmailInGroup(email) {
  return Object.values(group.value.members).find((mem) => mem.email === email)?.name;
}
function goToEditExpense() {
  router.push(`/expense/edit/${group.value.id}/${selectedExpense.value.id}?spender=${selectedExpense.value.spender}`);
}
async function removeExpense() {
  const expense = selectedExpense.value;

  const isConfirm = await popupService.confirm(`Are you sure you want to delete this expense?\n ${expense.description} ${getSymbolFromCurrency(expense.currency)}${expense.amount}`, 'Yes', 'No');
  if (!isConfirm) return;

  expenseStore.removeExpense({ expense, group: group.value });
}
function exportExpenses() {
  expenseService.exportExcel(group.value);
}

// CREATED
getGroup();
</script>
