<template>
  <section class="expense-list-container" v-if="expenses">
    <main class="list-container">
      <div v-if="!expenses || !expenses.length" class="no-expenses no-data">
        <p>You have no expenses yet</p>
      </div>
      <div v-else class="expense-list">
        <expense-preview v-for="expense in expenses" :key="expense.id" :expense="expense" @click="goToEditExpense(expense)" />
      </div>
    </main>
    <div class="footer container">
      <button @click="goToAddExpense" class="btn dark bottom-btn">Add Expense</button>
    </div>
  </section>
</template>

<script setup>
import expensePreview from './expense-preview.vue';
import { expenseService } from '../services/expense.service';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

// SETUPS
const props = defineProps({
  group: { type: Object },
});

const router = useRouter();

// VARIABLES
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

function findNameByEmailInGroup(email) {
  return Object.values(props.group.members).find((mem) => mem.email === email)?.name;
}
function goToEditExpense(expense) {
  router.push(`/expense/edit/${props.group.id}/${expense.id}?spender=${expense.spender}`);
}

function goToAddExpense() {
  router.push(`/expense/edit/${props.group.id}`);
}

function exportExpenses() {
  expenseService.exportExcel(props.group);
}
</script>
