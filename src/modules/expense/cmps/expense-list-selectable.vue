<template>
  <section class="expense-list-container selectable">
    <div class="title container">
      <h3 class="group-name">Expense List Selectable</h3>
      <button @click="close" class="close-btn">
        <img :src="require('@/assets/icons/close.svg')" />
      </button>
    </div>
    <div class="description container">
      <p>Please select which expenses the new member should be included in</p>
    </div>

    <main class="list-container">
      <div class="expense-list">
        <div class="select-all" style="background-color: white; padding: 4px">
          <button @click="toggleSelectAll" class="btn secondary">{{ selectBtnText }}</button>
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
  expenses: { type: Array, required: true },
  memberEmail: { type: String, required: true },
});

const emit = defineEmits(['close', 'save']);

const selectedExpenses = ref(new Set());
const isTouched = ref(true);

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
  const isConfirm = await popupService.confirm('Are you sure you wish to close?\nIf you close now the member will be excluded of all expenses');
  if (isConfirm) emit('close');
}

function saveSelectedExpenses() {
  props.expenses.forEach((exp) => {
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
    props.expenses.forEach((exp) => {
      selectedExpenses.value.add(exp.id);
    });
  }
}
</script>
