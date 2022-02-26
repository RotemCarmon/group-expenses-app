<template>
  <section class="main-app-container">
    <app-header :class="{load: isLoading}" />
    <router-view class="main-container" />
    <div v-if="isLoading" class="loader-container screen">
      <div class="app-loader"></div>
    </div>
  </section>
</template>

<script>
import { appHeader } from '@/modules/common/cmps';
export default {
  name: 'App',
  computed: {
    isLoading() {
      return this.$store.getters.isLoading;
    },
  },
  created() {
    this.$store.dispatch({ type: 'commonStore/loadCurrencies' });
  },
  components: {
    appHeader,
  },
};
</script>

