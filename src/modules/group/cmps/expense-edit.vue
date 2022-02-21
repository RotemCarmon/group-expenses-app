<template>
  <section class="expense-edit-container container">
    <main>
      <div class="group-name">Group <span>Bansko 2022</span></div>
      <div class="page-header">
        <div class="title">{{ edit ? 'Edit' : 'Add' }} Expense</div>
      </div>
      <input
        type="text"
        class="form-input form-row"
        placeholder="Enter Amount"
      />
      <label class="currency-select form-row">
        Currency
        <multi-select
          :items="currencies"
          :isMulti="false"
          
        />
      </label>
      <input
        type="text"
        class="form-input form-row"
        placeholder="Enter Description"
      />
      <h3 class="sub-title">Who is the spender?</h3>
      <multi-select
        :items="members"
        :isMulti="false"
        class="form-row"
      />
      <h3 class="sub-title">Exclude</h3>
      <multi-select
        :items="members"
        placeholder="Who to exclude?"
      />
    </main>
    <button class="btn dark buttom-btn">Submit</button>
  </section>
</template>

<script>
import { multiSelect } from '@/modules/common/cmps/';
export default {
  name: 'expense-edit',
  data() {
    return {
      edit: false,
      members: ['Rotem', 'Ben', 'Nave'],
      currencies: ['USD', 'EUR', 'NIS'],
    };
  },
  methods: {
    updateExcludes(excludes) {
      console.log('excludes:', excludes);
    },
  },
  components: {
    multiSelect,
  },
};
</script>