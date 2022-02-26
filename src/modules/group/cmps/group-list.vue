<template>
  <section class="group-list-container">
    <div class="page-header">
      <div class="list-header">
        <div class="title">My Groups</div>
        <button @click="goToAddGroup" class="add-group top-header-btn">
          Add <img :src="require('@/assets/icons/plus-solid.svg')" />
        </button>
      </div>
    </div>
    <div class="group-list">
      <group-preview v-for="group in groups" :key="group.id" :group="group" />
    </div>
  </section>
</template>

<script>
import groupPreview from './group-preview';
export default {
  name: 'group-list',
  methods: {
    goToAddGroup() {
      this.$router.push('/group/edit');
    },
  },
  computed: {
    groups() {
      return this.$store.getters['groupStore/groups'];
    },
  },
  components: {
    groupPreview,
  },
};
</script>

<style>
</style>