<template>
  <section class="group-details-container container" v-if="group">
    <main>
      <div class="page-header">
        <h3 class="title">{{ group.name }}</h3>
        <div class="ellipsis-icon" @click.stop="toggleMenu">
          <img :src="require('@/assets/icons/ellipsis.svg')" />
        </div>
      </div>
      <template v-if="balances">
        <div class="member" v-for="(amount, member) in balances" :key="member">
          <div class="name">
            {{ member }}
          </div>
          <div class="break-down" :class="{ pos: amount >= 0, neg: amount < 0 }">
            {{ parseFloat(amount.toFixed(2)) }}
            {{ getSymbolFromCurrency(userCurrency) }}
          </div>
        </div>
      </template>
      <div v-else class="loader-container">
        <div class="app-loader"></div>
      </div>
    </main>
    <div class="total-spent">
      Total Spent
      <span>{{ parseFloat(totalSpent.toFixed(2)) }} {{ getSymbolFromCurrency(userCurrency) }}</span>
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

<script>
import getSymbolFromCurrency from 'currency-symbol-map';
import { eventBus } from '@/modules/common/services/event-bus.service.js';
import { expenseService } from '@/modules/expense/services/expense.service';
import { optionMenu } from '@/modules/common/cmps';
import { popupService } from '@/modules/common/services/popup.service.js';
export default {
  name: 'group-details',
  data() {
    return {
      group: null,
      totalSpent: 0,
      summary: null,
      balances: null,
      isMenuOpen: false,
      getSymbolFromCurrency,
    };
  },
  computed: {
    loggedInUser() {
      return this.$store.getters['authStore/loggedInUser'];
    },
    userCurrency() {
      return this.loggedInUser?.prefs?.currency;
    },
  },
  methods: {
    async getTotalExpenses(userCurrency) {
      const { expenses } = this.group;
      this.totalSpent = await expenseService.getTotalExpenses(expenses, userCurrency);
    },

    async getBalances(userCurrency) {
      this.balances = await expenseService.getBalances(this.group, userCurrency);
    },
    getSummeryData(userCurrency = this.userCurrency) {
      this.getBalances(userCurrency);
      this.getTotalExpenses(userCurrency);
    },
    editGroup() {
      this.$router.push(`/group/edit/${this.group.id}`);
    },
    async removeGroup() {
      console.log('Removing group');
      const isOwner = this.isGroupOwner();
      if (!isOwner) {
        popupService.warn('Only the group owner can delete');
        return;
      }
      const group = this.group;
      const isConfirm = await popupService.confirm(
        `Are you sure you want to delete the group ${group.name}?`,
        'Yes',
        'No'
      );
      if (!isConfirm) return;

      await this.$store.dispatch({
        type: 'groupStore/removeGroup',
        groupId: group.id,
      });

      this.$router.push('/group/');
    },
    isGroupOwner() {
      const loggedInUser = this.$store.getters['authStore/loggedInUser'];
      const owner = Object.values(this.group.members).find((member) => member.isOwner);

      const ownerEmail = owner?.email;
      const userEmail = loggedInUser?.email;
      return ownerEmail === userEmail;
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    goToExpenseList() {
      this.$router.push(`/expense/${this.group.id}`);
    },
    goToAddExpense() {
      this.$router.push(`/expense/edit/${this.group.id}`);
    },
    async getGroup() {
      const { groupId } = this.$route.params;
      if (!groupId) return;
      const group = await this.$store.dispatch({
        type: 'groupStore/getGroupById',
        groupId,
      });
      this.group = group;
      return group;
    },
  },
  async created() {
    await this.getGroup();
    this.getSummeryData();

    eventBus.$on('currency-updated', (userCurrency) => {
      this.getSummeryData(userCurrency);
    });
  },
  components: {
    optionMenu,
  },
};
</script>
