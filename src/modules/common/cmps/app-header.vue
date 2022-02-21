<template>
  <section class="app-header-container">
    <div class="back" @click="back" v-if="hasBack">
      <img :src="require('@/assets/icons/arrow-left.svg')" />
    </div>
  </section>
</template>

<script>
export default {
  name: 'app-header',
  methods: {
    back() {
      let homeRoute = '/';
      if(this.$route.name === 'expense-edit') {
        homeRoute = `/group/${this.$route.params.groupId}`;

      } else if (this.$route.path.includes('group')) {
        homeRoute = '/group';
      }

      this.$router.replace(homeRoute);
    },
  },
  computed: {
    hasBack() {
      const noBackCmps = ['group-list'];
      return !noBackCmps.includes(this.$route.name);
    },
  }
};
</script>
