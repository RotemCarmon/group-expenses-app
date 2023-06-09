<template>
  <section class="group-details-container" data-testid="group-details-container" v-if="group">
    <main>
      <div class="page-header container">
        <h3 class="header-title" data-testid="group-name">{{ group.name }}</h3>
        <div class="ellipsis-icon" @click.stop="toggleMenu" data-testid="group-menu">
          <img src="@/assets/icons/ellipsis.svg" alt="ellipsis" />
        </div>
      </div>
      <div class="member-list" v-if="balances">
      <tab-nav />
      <router-view />
        <div class="member" v-for="(amount, member) in balances" :key="member">
          <div class="name" data-testid="member-name">
            {{ findNameByEmailInGroup(member, group) }}
          </div>
          <div class="break-down" :class="{ pos: amount > 0, neg: amount < 0 }" data-testid="member-amount">
            {{ getSymbolFromCurrency(userCurrency) }}
            {{ parseFloat(amount.toFixed(2)) }}
          </div>
        </div>
      </div>
      <div v-else class="loader-container">
        <div class="app-loader"></div>
      </div>
    </main>
    <div v-if="balances" class="total-spent" data-testid="total-spent">
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
import tabNav from '@/modules/common/cmps/tab-nav.vue';
import { popupService } from '@/modules/common/services/popup.service.js';
import { findNameByEmailInGroup } from '@/modules/common/services/util.service.js';
import { useRemoveGroup, goToEditGroup } from '@/composables/group.composable.js';
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
  goToEditGroup(group, router);
}

async function removeGroup() {
  const isRemoved = await useRemoveGroup(group);
  if(isRemoved) router.push('/group/');
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
