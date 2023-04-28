<template>
  <section class="group-list-container">
    <div class="page-header container">
      <div class="list-header">
        <div class="title">My Groups</div>
        <button @click="goToAddGroup" class="add-group top-header-btn" data-testId="add-group-btn">Add <img src="@/assets/icons/plus-solid.svg" /></button>
      </div>
    </div>
    <div v-if="!groups || !groups.length" class="no-groups no-data">
      <p>You have no groups</p>
      <p class="add-group-instruction">Click <strong>Add +</strong> to create your first group</p>
    </div>
    <div v-else class="group-list">
      <group-preview v-for="group in groups" :key="group.id" :group="group" @openMenu="toggleMenu" />
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

import groupPreview from './group-preview.vue';
import optionMenu from '@/modules/common/cmps/option-menu.vue';
import { popupService } from '@/modules/common/services/popup.service.js';
import { useRemoveGroup, goToEditGroup } from '@/composables/group.composable.js';

const router = useRouter();
const groupStore = useGroupStore();

const selectedGroup = ref(null);

// COMPUTED
const groups = computed(() => groupStore.groups);

// FUNCTIONS
function goToAddGroup() {
  router.push('/group/edit');
}

function toggleMenu(group) {
  selectedGroup.value = selectedGroup.value ? null : group;
}

function editGroup() {
  goToEditGroup(selectedGroup, router);
}

async function removeGroup() {
  useRemoveGroup(selectedGroup);
}
</script>

<style></style>
