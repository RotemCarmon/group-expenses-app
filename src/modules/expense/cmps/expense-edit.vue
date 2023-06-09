<template>
  <section class="expense-edit-container" v-if="group && expenseToEdit">
    <main>
      <div class="expense-header container">
        <div class="page-header">
          <div class="header-title">{{ edit ? 'Edit' : 'Add' }} Expense</div>
        </div>
        <div class="group-name">
          Group <span>{{ group.name }}</span>
        </div>
      </div>
      <div class="expense-container">
        <div class="card-section container">
          <div class="input-wrapper form-row">
            <font-awesome-icon icon="fa-thin fa-coins" class="form-icon" />
            <input type="text" class="form-input" placeholder="Enter Amount" v-model.number="expenseToEdit.amount" />
          </div>
          
          <div class="input-wrapper form-row">
            <font-awesome-icon icon="fa-thin fa-message-lines" class="form-icon" />
            <input type="text" class="form-input" placeholder="Enter Description" v-model="expenseToEdit.description" />
          </div>
          <div class="currency-select form-row">
            Currency
            <multi-select :items="currencyCodes" :isMulti="false" :hasSearch="true" :topSelections="['USD', 'EUR']" v-model="expenseToEdit.currency" />
          </div>
        </div>
        <div class="card-section container">
          <h3 class="sub-title">Who is the spender?</h3>
          <multi-select :items="members" :isMulti="false" class="form-row" v-model="expenseSpender" />
          <h3 class="sub-title">Exclude</h3>
          <multi-select :items="members" placeholder="Who to exclude?" v-model="expenseToEdit.exclude" :isShowSelectedOpts="true" />
        </div>
      </div>
    </main>
    <div class="footer container">
      <button v-if="edit" class="btn scondary delete-btn no-height" @click="removeExpense">Delete</button>
      <button @click="saveExpense" class="btn dark bottom-btn">Save</button>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import { expenseService } from '../services/expense.service';
import { popupService } from '@/modules/common/services/popup.service.js';
import { useCommonStore } from '../../common/store';
import { useAuthStore } from '../../auth/store/auth.store';
import { useRoute, useRouter } from 'vue-router';
import { useGroupStore } from '../../group/store';
import { useExpenseStore } from '../../expense/store';
import multiSelect from '@/modules/common/cmps/multi-select.vue';
import getSymbolFromCurrency from 'currency-symbol-map';

const commonStore = useCommonStore();
const authStore = useAuthStore();
const groupStore = useGroupStore();
const expenseStore = useExpenseStore();

const router = useRouter();
const route = useRoute();

const members = computed(() => group.value?.members && Object.values(group.value?.members).map((m) => m.name));

const loggedInUser = computed(() => authStore.loggedInUser);
const currencyCodes = computed(() => commonStore.currencyCodes);
const userCurrency = computed(() => loggedInUser.value?.prefs?.currency);

const edit = ref(false);
const group = ref(null);
const expenseToEdit = ref(null);
const expenseSpender = ref(loggedInUser.value?.username);

// FUNCTIONS
async function getGroup() {
  const { groupId } = route.params;
  if (!groupId) return;

  group.value = await groupStore.getGroupById({ groupId });
}
async function getExpense() {
  const { expenseId } = route.params;
  const { spender } = route.query;

  if (expenseId && spender) {
    edit.value = true
    prepareExpenseToEdit(expenseId, spender);
  } else {
    edit.value = false
    expenseToEdit.value = expenseService.getEmptyExpense();
    expenseToEdit.value.currency = userCurrency.value;
  }
}
function prepareExpenseToEdit(expenseId, spender) {
  expenseToEdit.value = {};

  const expense = group.value.expenses.find((exp) => exp.id === expenseId);
  expense.exclude = expense.exclude.map((exc) => findNameByEmailInGroup(exc));

  expenseSpender.value = findNameByEmailInGroup(spender);
  expenseToEdit.value = expense;
}
function findEmailByNameInGroup(name) {
  return Object.values(group.value.members).find((mem) => mem.name === name)?.email;
}
function findNameByEmailInGroup(email) {
  return Object.values(group.value.members).find((mem) => mem.email === email)?.name;
}
async function saveExpense() {
  if (!validateAmount(expenseToEdit.value.amount)) {
    popupService.warn('Please enter a valid amount');
    return;
  }

  // this can happen in the expense service
  expenseToEdit.value = convertExcludesNamesToEmails(expenseToEdit.value);
  expenseToEdit.value.spender = findEmailByNameInGroup(expenseSpender.value);

  const { expenseId } = route.params;

  if (expenseId) {
    const { spender } = route.query;
    expenseToEdit.value = group.value.expenses.find((exp) => exp.id === expenseId);
    group.value = await expenseService.removeExpense({ ...expenseToEdit.value, spender }, { ...group.value });
  } else {
    expenseToEdit.value.createdAt = Date.now();
  }
  expenseStore.saveExpense({
    expense: expenseToEdit.value,
    group: group.value,
  });

  // NAVIGATE BACK TO GROUP PAGE
  router.go(-1);
}
async function removeExpense() {
  const expense = expenseToEdit.value;
  
  const isConfirm = await popupService.confirm({ title: 'Delete Expense', txt: `Are you sure you want to delete this expense?\n ${expense.description} ${getSymbolFromCurrency(expense.currency)}${expense.amount}`, approveTxt: 'Yes', cancelTxt: 'No' });
  if (!isConfirm) return;
  
  expenseStore.removeExpense({ expense, group: group.value });
  router.go(-1);
}

function validateAmount(amount) {
  return amount && amount > 0 && typeof amount === 'number';
}

function convertExcludesNamesToEmails(expenseToEdit) {
  expenseToEdit.exclude = expenseToEdit.exclude.map((name) => findEmailByNameInGroup(name));
  return expenseToEdit;
}

(async function created() {
  await getGroup();
  getExpense();
})();
</script>
