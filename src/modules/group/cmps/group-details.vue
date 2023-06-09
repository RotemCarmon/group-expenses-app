<template>
  <section class="group-details-container" data-testid="group-details-container" v-if="group">
    <main>
      <div class="page-header container">
        <h3 class="header-title" data-testid="group-name">{{ group.name }}</h3>
        <div class="ellipsis-icon" @click.stop="toggleMenu" data-testid="group-menu">
          <img src="@/assets/icons/ellipsis.svg" alt="ellipsis" />
        </div>
      </div>
      <!-- <group-expense-summary :total="totalSpent" :currency="userCurrency" /> -->
      <div class="group-expense-summary">
        Total spent: <span>{{ getSymbolFromCurrency(userCurrency) }}{{ parseFloat(totalSpent.toFixed(2)) }}</span>
      </div>
      <tab-nav />
      <router-view :group="group" :currency="userCurrency" :key="userCurrency" />
    </main>

    <!-- OPTION MENU -->
    <transition name="menu-bottom" mode="out-in">
      <option-menu v-if="isMenuOpen" @edit="editGroup" @remove="removeGroup" @close="toggleMenu" />
    </transition>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { useAuthStore } from '@/modules/auth/store/auth.store';
import { useGroupStore } from '../store/';

import getSymbolFromCurrency from 'currency-symbol-map';
import { expenseService } from '@/modules/expense/services/expense.service';
import { useRemoveGroup, goToEditGroup } from '@/composables/group.composable.js';

import optionMenu from '@/modules/common/cmps/option-menu.vue';
import tabNav from '@/modules/common/cmps/tab-nav.vue';

const authStore = useAuthStore();
const groupStore = useGroupStore();

const router = useRouter();
const route = useRoute();

const group = ref(null);
const totalSpent = ref(0);
const isMenuOpen = ref(false);

const loggedInUser = computed(() => authStore.loggedInUser);

const userCurrency = computed(() => loggedInUser.value?.prefs?.currency);

// FUNCTIONS
async function getTotalExpenses(userCurrency = authStore.loggedInUser.prefs.currency) {
  const { expenses } = group.value;
  totalSpent.value = await expenseService.getTotalExpenses(expenses, userCurrency);
}

function editGroup() {
  goToEditGroup(group, router);
}

async function removeGroup() {
  const isRemoved = await useRemoveGroup(group);
  if (isRemoved) router.push('/group/');
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

async function getGroup() {
  const { groupId } = route.params;
  if (!groupId) return;
  const group = await groupStore.getGroupById({ groupId });
  return group;
}

async function created() {
  group.value = await getGroup();
  getTotalExpenses();
}

created();
</script>
