<template>
  <section class="group-list-container">
    <div class="page-header container">
      <div class="list-header">
        <div class="header-title">My Groups</div>
        <button @click="addGroup" class="add-group top-header-btn" data-testId="add-group-btn" title="add group"><font-awesome-icon icon="fa-regular fa-plus" /></button>
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
        <input type="search" class="form-input search-input" placeholder="Search" v-model="searchTxt" />
        <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="magnifying-glass" />
      </div>
      <p v-if="!groupsToShow?.length" class="no-groups">No results</p>
      <transition-group name="fade">
        <group-preview v-for="group in groupsToShow" :key="group.id" :group="group" />
      </transition-group>
    </div>

    <!-- GROUP EDIT -->
    <transition name="slide-down" mode="out-in">
      <group-edit v-if="isOpenEditGroup" :group="selectedGroup" @close="isOpenEditGroup = false" />
    </transition>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useGroupStore } from '../store/';

import groupPreview from './group-preview.vue';
import groupEdit from './group-edit.vue';

const groupStore = useGroupStore();

const isOpenEditGroup = ref(false);
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
function addGroup() {
  selectedGroup.value = null;
  isOpenEditGroup.value = true;
}
</script>
