<template>
  <section class="main-app-container">
    <app-header />
    <router-view class="main-container" />
  </section>
</template>

<script>
import { appHeader } from '@/modules/common/cmps';
export default {
  name: 'App',
  components: {
    appHeader,
  },
};
</script>

