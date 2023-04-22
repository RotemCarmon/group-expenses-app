<template>
  <section class="group-details-container" v-if="group">
    <main>
      <div class="page-header container">
        <h3 class="title">{{ group.name }}</h3>
        <div class="ellipsis-icon" @click.stop="toggleMenu">
          <img src="@/assets/icons/ellipsis.svg" />
        </div>
      </div>
      <div class="member-list" v-if="balances">
        <div class="member" v-for="(amount, member) in balances" :key="member">
          <div class="name">
            {{ findNameByEmailInGroup(member, group) }}
          </div>
          <div class="break-down" :class="{ pos: amount > 0, neg: amount < 0 }">
            {{ getSymbolFromCurrency(userCurrency) }}
            {{ parseFloat(amount.toFixed(2)) }}
          </div>
        </div>
      </div>
      <div v-else class="loader-container">
        <div class="app-loader"></div>
      </div>
    </main>
    <div class="total-spent">
      Total Spent
      <span>{{ getSymbolFromCurrency(userCurrency) }} {{ parseFloat(totalSpent.toFixed(2)) }}</span>
    </div>

    <!-- OPTION MENU -->
    <transition name="menu-bottom" mode="out-in">
      <option-menu v-if="isMenuOpen" @edit="editGroup" @remove="removeGroup" @close="toggleMenu">
        <template #content-top>
          <div @click="goToAddExpense" class="line">Add Expense</div>
          <div @click="goToExpenseList" class="line">Show All Expenses</div>
        </template>
      </option-menu>
    </transition>
  </section>
</template>

<script setup>
import getSymbolFromCurrency from 'currency-symbol-map';
import { expenseService } from '@/modules/expense/services/expense.service';
import optionMenu from '@/modules/common/cmps/option-menu.vue';
import { popupService } from '@/modules/common/services/popup.service.js';
import { findNameByEmailInGroup } from '@/modules/common/services/util.service.js';
import { ref, computed, watch } from 'vue';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { useGroupStore } from '../store/';
import { useRouter, useRoute } from 'vue-router';

const authStore = useAuthStore();
const groupStore = useGroupStore();

const router = useRouter();
const route = useRoute();

const group = ref(null);
const totalSpent = ref(0);
const summary = ref(null);
const balances = ref(null);
const isMenuOpen = ref(false);

const loggedInUser = computed(() => authStore.loggedInUser);

const userCurrency = computed(() => loggedInUser.value?.prefs?.currency);

const isGroupOwner = computed(() => {
  const owner = Object.values(group.value?.members).find((member) => member.isOwner);
  const ownerEmail = owner?.email;
  const userEmail = loggedInUser.value?.email;
  return ownerEmail === userEmail;
});

// FUNCTIONS
async function getTotalExpenses(userCurrency) {
  const { expenses } = group.value;
  totalSpent.value = await expenseService.getTotalExpenses(expenses, userCurrency);
}

async function getBalances(userCurrency) {
  balances.value = await expenseService.getBalances(group.value, userCurrency);
}

function getSummeryData(userCurrency = authStore.loggedInUser.prefs.currency) {
  getBalances(userCurrency);
  getTotalExpenses(userCurrency);
}

function editGroup() {
  router.push(`/group/edit/${group.value.id}`);
}

async function removeGroup() {
  const isOwner = isGroupOwner.value;
  if (!isOwner) {
    popupService.warn('Only the group owner can delete');
    return;
  }
  const _group = group.value;
  const isConfirm = await popupService.confirm({title: 'Delete Group', txt: `Are you sure you want to delete the group ${_group.name}?`, approveTxt: 'Yes', cancelTxt: 'No' });
  if (!isConfirm) return;

  await groupStore.removeGroup({ groupId: _group.id });

  router.push('/group/');
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}
function goToExpenseList() {
  router.push(`/expense/${group.value.id}`);
}
function goToAddExpense() {
  router.push(`/expense/edit/${group.value.id}`);
}
async function getGroup() {
  const { groupId } = route.params;
  if (!groupId) return;
  const group = await groupStore.getGroupById({ groupId });
  return group;
}

watch(userCurrency, (val) => {
  getSummeryData(val);
});

async function created() {
  group.value = await getGroup();
  getSummeryData();
}

created();
</script>
