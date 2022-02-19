<template>
  <section class="main-app-container">
    <add-expense />
    <button @click="isShowSummary=!isShowSummary">{{isShowSummary? 'Hide': 'Show'}} summary</button>
    <summary-page v-if="isShowSummary" />
  </section>
</template>

<script>
import summaryPage from '../cmps/summary-page';
import addExpense from '../cmps/add-expense';

export default {
  name: 'main-app',
  data() {
    return {
      isShowSummary: false
    }
  },
  created () {
    
  },
  components: {
    summaryPage,
    addExpense
  },
};
</script>

<style>
</style>