<template>
  <section class="expense-edit-container container">
    <main>
      <div class="page-header">
        <div class="title">{{ edit ? 'Edit' : 'Add' }} Expense</div>
      </div>
      <input type="text" class="form-input" placeholder="Enter Amount" />
      <label for="">
        Currency
        <select class="form-select">
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="NIS">NIS</option>
        </select>
      </label>
      <input type="text" class="form-input" placeholder="Enter Description" />
      <h3>Who is the spender?</h3>
      <select class="form-select">
        <option value="Rotem">Rotem</option>
        <option value="Ben">Ben</option>
        <option value="Nave">Nave</option>
      </select>
      <h3>Exclude</h3>
      <multi-select @change="updateExcludes" :items="members" placeholder="Who to exclude?" />
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
    };
  },
  methods: {
    updateExcludes(excludes) {
      console.log('excludes:', excludes) 
      
    }
  },
  components: {
    multiSelect,
  },
};
</script>