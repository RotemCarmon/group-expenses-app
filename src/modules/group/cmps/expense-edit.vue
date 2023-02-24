<template>
  <section class="expense-edit-container container" v-if="group">
    <main>
      <div class="group-name">
        Group <span>{{ group.name }}</span>
      </div>
      <div class="page-header">
        <div class="title">{{ edit ? 'Edit' : 'Add' }} Expense</div>
      </div>
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

      <h3 class="sub-title">Who is the spender?</h3>
      <multi-select
        :items="members"
        :isMulti="false"
        class="form-row"
        v-model="spender"
      />
      <h3 class="sub-title">Exclude</h3>
      <multi-select
        :items="membersLowerCase"
        placeholder="Who to exclude?"
        v-model="expenseToEdit.exclude"
      />
    </main>
    <button @click="saveExpense" class="btn dark buttom-btn">Submit</button>
  </section>
</template>

<script>
import { expenseService } from '../services/expense.service';
import { multiSelect } from '@/modules/common/cmps/';
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
      return this.group?.members?.map((member) => member.name);
    },
    membersLowerCase() {
      return this.group?.members?.map((member) => member.name.toLowerCase());
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
      if (groupId) {
        const group = await this.$store.dispatch({
          type: 'groupStore/getGroupById',
          groupId,
        });
        this.group = group;
      }
    },
    async getExpense() {
      // check if expenseId exist
      this.expenseToEdit = expenseService.getEmptyExpense();
      this.expenseToEdit.currency = this.userCurrency
    },
    saveExpense() {
      this.group.expenses[this.spender.toLowerCase()].push(this.expenseToEdit);
      this.$store.dispatch({ type: 'groupStore/saveGroup', group: this.group });
      this.$router.go(-1);
    },
  },
  created() {
    this.getGroup();
    this.getExpense();
    this.spender = this.$store.getters['authStore/loggedInUser']?.username;
  },
  components: {
    multiSelect,
  },
};
</script>