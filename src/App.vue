<template>
  <section class="main-app-container">
    <app-header />
    <router-view class="main-container" />
    <div v-if="isLoading" class="loader-container screen">
      <div class="app-loader"></div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useCommonStore } from './modules/common/store';
import appHeader from '@/modules/common/cmps/app-header.vue';

const commonStore = useCommonStore();
const isLoading = computed(() => commonStore.isLoading);

// CREATED
async function created() {
  await commonStore.loadCurrencies();
}
created()
</script>
