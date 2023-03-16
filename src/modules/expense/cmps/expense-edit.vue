<template>
  <section class="expense-edit-container container" v-if="group && expenseToEdit">
    <main>
      <div class="expense-header section-app-container">
        <div class="page-header">
          <div class="title">{{ edit ? 'Edit' : 'Add' }} Expense</div>
        </div>
        <div class="group-name">
          Group <span>{{ group.name }}</span>
        </div>
      </div>
      <div class="expense-container section-app-container">
        <div class="card-section">
          <input
            type="text"
            class="form-input form-row"
            placeholder="Enter Amount"
            v-model.number="expenseToEdit.amount"
          />
          <input
            type="text"
            class="form-input form-row"
            placeholder="Enter Description"
            v-model="expenseToEdit.description"
          />
          <div class="currency-select form-row">
            Currency
            <multi-select
              :items="currencyCodes"
              :isMulti="false"
              :hasSearch="true"
              :topSelections="['USD', 'EUR']"
              v-model="expenseToEdit.currency"
            />
          </div>
        </div>
        <div class="card-section">
          <h3 class="sub-title">Who is the spender?</h3>
          <multi-select :items="members" :isMulti="false" class="form-row" v-model="spender" />
          <h3 class="sub-title">Exclude</h3>
          <multi-select :items="members" placeholder="Who to exclude?" v-model="expenseToEdit.exclude" />
        </div>
      </div>
    </main>
    <div class="footer section-app-container">
      <button @click="saveExpense" class="btn dark bottom-btn">Save</button>
    </div>
  </section>
</template>

<script>
import { expenseService } from '../services/expense.service';
import { multiSelect } from '@/modules/common/cmps/';
import { popupService } from '@/modules/common/services/popup.service.js';
export default {
  name: 'expense-edit',
  data() {
    return {
      edit: false,
      group: null,
      expenseToEdit: null,
      spender: '', // loggedInUser
    };
  },
  computed: {
    members() {
      return this.group?.members && Object.values(this.group?.members).map((m) => m.name);
    },
    currencyCodes() {
      return this.$store.getters['commonStore/currencyCodes'];
    },
    loggedInUser() {
      return this.$store.getters['authStore/loggedInUser'];
    },
    userCurrency() {
      return this.loggedInUser?.prefs?.currency;
    },
  },
  methods: {
    async getGroup() {
      const { groupId } = this.$route.params;
      if (!groupId) return;

      const group = await this.$store.dispatch({
        type: 'groupStore/getGroupById',
        groupId,
      });
      this.group = group;
    },
    async getExpense() {
      const { expenseId } = this.$route.params;
      const { spender } = this.$route.query;
      if (expenseId && spender) {
        this.prepareExpenseToEdit(expenseId, spender);
      } else {
        this.expenseToEdit = expenseService.getEmptyExpense();
        this.expenseToEdit.currency = this.userCurrency;
      }
    },
    prepareExpenseToEdit(expenseId, spender) {
      this.expenseToEdit = {};

      const expense = this.group.expenses.find((exp) => exp.id === expenseId);
      expense.exclude = expense.exclude.map((exc) => this.findNameByEmailInGroup(exc));

      this.spender = this.findNameByEmailInGroup(spender);
      this.expenseToEdit = expense;
    },
    findEmailByNameInGroup(name) {
      return Object.values(this.group.members).find((mem) => mem.name === name)?.email;
    },
    findNameByEmailInGroup(email) {
      return Object.values(this.group.members).find((mem) => mem.email === email)?.name;
    },
    async saveExpense() {
      if (!this.expenseToEdit.amount) {
        popupService.warn('Please enter amount');
        return;
      }

      // this can happen in the expense service
      this.expenseToEdit = this.convertExcludesNamesToEmails(this.expenseToEdit);
      this.expenseToEdit.spender = this.findEmailByNameInGroup(this.spender);

      const { expenseId } = this.$route.params;
      if (expenseId) {
        const { spender } = this.$route.query;
        this.expenseToEdit = this.group.expenses.find((exp) => exp.id === expenseId);
        this.group = await expenseService.removeExpense({ ...this.expenseToEdit, spender }, { ...this.group });
      } else {
        this.expenseToEdit.createdAt = Date.now();
      }

      this.$store.dispatch({
        type: 'expenseStore/saveExpense',
        expense: this.expenseToEdit,
        group: this.group,
      });

      // NAVIGATE BACK TO GROUP PAGE
      this.$router.go(-1);
    },
    convertExcludesNamesToEmails(expenseToEdit) {
      expenseToEdit.exclude = expenseToEdit.exclude.map((name) => this.findEmailByNameInGroup(name));
      return expenseToEdit;
    },
  },
  async created() {
    this.spender = this.$store.getters['authStore/loggedInUser']?.username;
    await this.getGroup();
    this.getExpense();
  },
  components: {
    multiSelect,
  },
};
</script>
