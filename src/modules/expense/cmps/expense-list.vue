<template>
  <section class="expense-list-container" v-if="expenses && group">
    <h3 class="group-name">{{ group.name }}</h3>
    <main>
      <div
        class="expense-preview"
        v-for="expense in expenses"
        :key="expense.id"
      >
        <div class="grid-layout">
          <div class="name">{{ expense.name }}</div>
          <div class="amount">
            {{ expense.amount }}{{ getSymbolFromCurrency(expense.currency) }}
          </div>
          <div class="createdAt">
            {{ formatDate(expense.createdAt, 'dd/LL') }}
          </div>
          <div class="description">{{ expense.description }}</div>
        </div>
        <div class="exclude" v-if="expense.exclude && expense.exclude.length">
          <div class="line"></div>
          Exclude: {{ expense.exclude.join(', ') }}
        </div>
      </div>
    </main>
    <div class="footer section-app-container">
      <button class="btn dark bottom-btn">Submit</button>
    </div>
  </section>
</template>

<script>
import { formatDate } from '@/modules/common/services/util.service';
import getSymbolFromCurrency from 'currency-symbol-map';
export default {
  name: 'expense-list',
  data() {
    return {
      group: null,
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
    formatDate,
    getSymbolFromCurrency,
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
  },
  async created() {
    await this.getGroup();
  },
};
</script>