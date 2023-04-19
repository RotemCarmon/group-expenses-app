<template>
  <section class="group-list-container">
    <div class="page-header container">
      <div class="list-header">
        <div class="title">My Groups</div>
        <button @click="goToAddGroup" class="add-group top-header-btn">Add <img :src="require('@/assets/icons/plus-solid.svg')" /></button>
      </div>
    </div>
    <div class="group-list">
      <group-preview v-for="group in groups" :key="group.id" :group="group" @openMenu="toggleMenu" />
    </div>
    <div v-if="!groups || !groups.length" class="no-groups no-data">
      <p>You have no groups</p>
      <p class="add-group-instruction">Click <strong>Add +</strong> to create your first group</p>
    </div>
    <transition name="menu-bottom" mode="out-in">
      <option-menu v-if="selectedGroup" :title="selectedGroup.name" @edit="editGroup" @remove="removeGroup" @close="toggleMenu" />
    </transition>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { useGroupStore } from '../store/';
import { useAuthStore } from '@/modules/auth/store/auth.store';

import groupPreview from './group-preview';
import optionMenu from '@/modules/common/cmps/option-menu';
import { popupService } from '@/modules/common/services/popup.service.js';

const router = useRouter();
const groupStore = useGroupStore();
const authStore = useAuthStore();

const selectedGroup = ref(null);

// COMPUTED
const groups = computed(() => groupStore.groups);

const isGroupOwner = computed(() => {
  const loggedInUser = authStore.loggedInUser;
  const owner = Object.values(selectedGroup.value?.members).find((member) => member.isOwner);
  const ownerEmail = owner?.email;
  const userEmail = loggedInUser?.email;
  return ownerEmail === userEmail;
});

// FUNCTIONS
function goToAddGroup() {
  router.push('/group/edit');
}

function toggleMenu(group) {
  selectedGroup.value = selectedGroup.value ? null : group;
}

function editGroup() {
  if (!isGroupOwner) {
    popupService.warn('Only the group owner can edit');
    return;
  }
  router.push(`/group/edit/${selectedGroup.value.id}`);
}

async function removeGroup() {
  if (!isGroupOwner) {
    popupService.warn('Only the group owner can delete');
    return;
  }
  const group = selectedGroup.value;
  const isConfirm = await popupService.confirm(`Are you sure you want to delete the group ${group.name}?`, 'Yes', 'No');
  if (!isConfirm) return;

  groupStore.removeGroup({ groupId: group.id });
}
</script>

<style></style>
