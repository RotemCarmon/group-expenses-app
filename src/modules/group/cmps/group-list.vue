<template>
  <section class="group-list-container">
    <div class="page-header container">
      <div class="list-header">
        <div class="header-title">My Groups</div>
        <button @click="goToAddGroup" class="add-group top-header-btn" data-testId="add-group-btn" title="add group"><font-awesome-icon icon="fa-regular fa-plus" /></button>
      </div>
    </div>
    <!-- NO GROUPS -->
    <div v-if="!groups || !groups.length" class="no-groups no-data">
      <p>You have no groups</p>
      <p class="add-group-instruction">Click the <font-awesome-icon icon="fa-regular fa-plus" size="sm" /> to create your first group</p>
    </div>
    <!-- GROUPS LIST -->
    <div v-else class="group-list">
      <!-- SEARCH GROUPS -->
      <div class="search-group">
        <input type="search" class="form-input search-input" v-model="searchTxt" />
        <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="magnifying-glass" />
      </div>
      <p v-if="!groupsToShow?.length" class="no-groups">No results</p>
      <transition-group name="fade">
        <group-preview v-for="group in groupsToShow" :key="group.id" :group="group" @openMenu="toggleMenu" />
      </transition-group>
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
const searchTxt = ref(null);

// COMPUTED

const groups = computed(() => groupStore.groups);

const groupsToShow = computed(() =>
  groups.value.filter((g) => {
    const rgx = new RegExp(searchTxt.value, 'i');
    return searchTxt.value ? rgx.test(g.name) : g;
  })
);

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
