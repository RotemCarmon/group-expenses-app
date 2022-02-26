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
      <group-preview
        v-for="group in groups"
        :key="group.id"
        :group="group"
        @openMenu="toggleMenu"
      />
    </div>
    <transition name="menu-bottom" mode="out-in">
      <option-menu
        v-if="selectedGroupId"
        @edit="editGroup"
        @remove="removeGroup"
        @close="toggleMenu"
      >
      </option-menu>
    </transition>
  </section>
</template>

<script>
import groupPreview from './group-preview';
import { optionMenu } from '@/modules/common/cmps';
export default {
  name: 'group-list',
  data() {
    return {
      selectedGroupId: null,
    };
  },
  methods: {
    goToAddGroup() {
      this.$router.push('/group/edit');
    },
    toggleMenu(groupId) {
      this.selectedGroupId = this.selectedGroupId ? null : groupId;
    },
    editGroup() {
      this.$router.push(`/group/edit/${this.selectedGroupId}`);
    },
    removeGroup() {
      console.log('Removing group');
    },
  },
  computed: {
    groups() {
      return this.$store.getters['groupStore/groups'];
    },
  },
  components: {
    groupPreview,
    optionMenu,
  },
};
</script>

<style>
</style>