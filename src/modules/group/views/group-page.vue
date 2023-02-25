<template>
  <div class="group-page">
    <router-view />
  </div>
</template>

<script>
export default {
  created() {
    const loggedInUser = this.$store.getters['authStore/loggedInUser'];
    this.$store.dispatch({
      type: 'groupStore/loadGroups',
      filterBy: { array: [ 'memberEmails', loggedInUser.email ] },
    });
  },
};
</script>