<template>
  <section class="expense-list-container" v-if="expenses && group">
    <div class="title section-app-container">
      <h3 class="group-name">{{ group.name }}</h3>
    </div>
    <main>
      <expense-preview
        v-for="expense in expenses"
        :key="expense.id"
        :expense="expense"
        @openMenu="toggleMenu"
      />
    </main>
    <div class="footer section-app-container">
      <button class="btn dark bottom-btn">Export</button>
    </div>

    <!-- OPTION MENU -->
    <transition name="menu-bottom" mode="out-in">
      <option-menu
        v-if="selectedExpense"
        @edit="goToEditExpense"
        @remove="removeExpense"
        @close="toggleMenu"
      >
      </option-menu>
    </transition>
  </section>
</template>

<script>
import expensePreview from './expense-preview';
import { optionMenu } from '@/modules/common/cmps';
export default {
  name: 'expense-list',
  data() {
    return {
      group: null,
      selectedExpense: null,
    };
  },
  computed: {
    expenses() {
      const res = [];

      const expenses = this.group?.expenses;
      for (const email in expenses) {
        const name = this.findNameByEmailInGroup(email);
        const currUserExpenses = expenses[email];

        const expenseReports = currUserExpenses.map((expense) => {
          return {
            amount: expense.amount,
            description: expense.description,
            name,
            email,
            exclude: expense.exclude.map((exc) =>
              this.findNameByEmailInGroup(exc)
            ),
            currency: expense.currency,
            id: expense.id,
            createdAt: expense.createdAt,
          };
        });
        res.push(...expenseReports);
      }

      return res.sort((a, b) => a.createdAt - b.createdAt);
    },
  },
  methods: {
    toggleMenu(expense) {
      this.selectedExpense = this.selectedExpense ? null : expense;
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
    findNameByEmailInGroup(email) {
      return this.group.members.find((mem) => mem.email === email)?.name;
    },
    goToEditExpense() {
      this.$router.push(
        `/expense/edit/${this.group.id}/${this.selectedExpense.id}?spender=${this.selectedExpense.email}`
      );
    },
  },
  async created() {
    await this.getGroup();
  },
  components: {
    expensePreview,
    optionMenu,
  },
};
</script>