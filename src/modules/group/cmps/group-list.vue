<template>
  <section class="group-list-container">
    <div class="page-header">
      <div class="title">My Groups</div>
    </div>
    <div class="group-list">
      <group-preview v-for="group in groups" :key="group._id" :group="group" />
    </div>
    <button @click="goToAddGroup" class="add-group btn-dashed">
      + Add Group
    </button>
  </section>
</template>

<script>
import { popupService } from '@/modules/common/services/popup.service.js';
import groupPreview from './group-preview';
export default {
  name: 'group-list',
  methods: {
    goToAddGroup() {
      this.$router.push('/group/edit');
    }
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