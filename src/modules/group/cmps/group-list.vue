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
    <div v-if="!groups || !groups.length" class="no-groups no-data">
      <p>You have no groups</p>
      <p class="add-group-instruction">
        Click <strong>Add +</strong> to create your first group
      </p>
    </div>
    <transition name="menu-bottom" mode="out-in">
      <option-menu
        v-if="selectedGroup"
        @edit="editGroup"
        @remove="removeGroup"
        @close="toggleMenu"
      >
        <template #content-top>
          <div @click="goToAddGroup" class="line">Add Group</div>
        </template>
      </option-menu>
    </transition>
  </section>
</template>

<script>
import groupPreview from './group-preview';
import { optionMenu } from '@/modules/common/cmps';
import { popupService } from '@/modules/common/services/popup.service.js';
export default {
  name: 'group-list',
  data() {
    return {
      selectedGroup: null,
    };
  },
  methods: {
    goToAddGroup() {
      this.$router.push('/group/edit');
    },
    toggleMenu(group) {
      this.selectedGroup = this.selectedGroup ? null : group;

    },
    editGroup() {
      const isOwner = this.isGroupOwner();
      if (!isOwner) {
        popupService.warn('Only the group owner can edit');
        return;
      }
      this.$router.push(`/group/edit/${this.selectedGroup.id}`);
    },
    async removeGroup() {
      console.log('Removing group');
      const isOwner = this.isGroupOwner();
      if (!isOwner) {
        popupService.warn('Only the group owner can delete');
        return;
      }
      const group = this.selectedGroup;
      const isConfirm = await popupService.confirm(
        `Are you sure you want to delete the group ${group.name}?`,
        'Yes',
        'No'
      );
      if (!isConfirm) return;

      this.$store.dispatch({
        type: 'groupStore/removeGroup',
        groupId: group.id,
      });
    },
    isGroupOwner() {
      const loggedInUser = this.$store.getters['authStore/loggedInUser'];
      const owner = this.selectedGroup?.members.find(
        (member) => member.isOwner
      );
      const ownerEmail = owner?.email;
      const userEmail = loggedInUser?.email;
      return ownerEmail === userEmail;
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