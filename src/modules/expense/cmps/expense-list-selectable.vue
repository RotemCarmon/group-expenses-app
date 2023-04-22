<template>
  <section class="expense-list-container selectable main-app-container">
    <div class="title container">
      <h3 class="group-name">Expense List</h3>
      <button @click="close" class="close-btn">
        <img src="@/assets/icons/close.svg" />
      </button>
    </div>
    <div class="description container">
      <p>Please select which expenses the new member should be included in.</p>
    </div>

    <main class="list-container">
      <div class="expense-list">
        <div class="select-all">
          <button @click="toggleSelectAll" class="select-toggle-btn">{{ selectBtnText }}</button>
        </div>
        <expense-preview v-for="expense in expenses" :key="expense.id" :expense="expense" :isSelected="selectedExpenses.has(expense.id)" :isSelectable="true" @select="updateSelected" />
      </div>
    </main>
    <div class="footer container">
      <button @click="saveSelectedExpenses" class="btn dark bottom-btn">Save</button>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import expensePreview from './expense-preview.vue';
import { popupService } from '@/modules/common/services/popup.service.js';
const props = defineProps({
  group: { type: Object, required: true },
  memberEmail: { type: String, required: true },
});

const emit = defineEmits(['close', 'closeAndRemove']);

const selectedExpenses = ref(new Set());
const isTouched = ref(true);

const expenses = computed(() => {
  const res = props.group.expenses.reduce((expenses, expense) => {
    expenses.push(prepareExpenseReport(expense));
    return expenses;
  }, []);

  return res.sort((a, b) => a.createdAt - b.createdAt);
});
const selectBtnText = computed(() => (selectedExpenses.value.size ? 'Clear All' : 'Select All'));

function updateSelected(val) {
  if (selectedExpenses.value.has(val)) {
    selectedExpenses.value.delete(val);
  } else {
    selectedExpenses.value.add(val);
  }
}

async function close() {
  if (!isTouched.value) {
    return emit('close');
  }
  const isConfirm = await popupService.confirm({ title: 'Are you sure?', txt: 'If you close now the member won\'t be added.' });
  if (isConfirm) emit('closeAndRemove', props.memberEmail);
}

function saveSelectedExpenses() {
  props.group.expenses.forEach((exp) => {
    if (!selectedExpenses.value.has(exp.id)) {
      exp.exclude.push(props.memberEmail);
    }
  });

  isTouched.value = false;
  close();
}

function toggleSelectAll() {
  if (selectedExpenses.value.size) selectedExpenses.value.clear();
  else {
    expenses.value.forEach((exp) => {
      selectedExpenses.value.add(exp.id);
    });
  }
}

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
</script>
