<template>
  <div>
    <router-view />
  </div>
</template>

<script>
export default {
  created() {
    this.$store.dispatch({type: 'groupStore/loadGroups'})
  },
}
</script>