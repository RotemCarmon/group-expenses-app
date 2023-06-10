<template>
  <section class="group-edit-container">
    <main>
      <div class="page-header container">
        <div class="header-title" :style="{ color: groupToEdit.color }">{{ edit ? 'Edit' : 'Create a new' }} group</div>
        <font-awesome-icon icon="fa-regular fa-xmark" @click="$emit('close')" />
      </div>
      <div class="group-edit-form">
        <div class="group-form">
          <input class="form-input" type="text" v-model="groupToEdit.name" aria-label="group name" placeholder="Group Name" />
          <textarea class="form-textarea" v-model="groupToEdit.description" aria-label="group description" placeholder="Group Description" />
        </div>
        <div class="color-picker">
          <div class="title">Pick a color</div>
          <div class="colors">
            <div v-for="color in colors" class="color" @click="groupToEdit.color = color" :class="{ selected: color === groupToEdit.color }" :style="{ backgroundColor: color }"></div>
          </div>
        </div>
      </div>
    </main>
    <div class="footer container">
      <button @click="saveGroup" class="btn dark bottom-btn create-btn">Save</button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';

import { useGroupStore } from '../store';
import { useAuthStore } from '@/modules/auth/store/auth.store';

import { groupService } from '../services/group.service.js';
import { popupService } from '@/modules/common/services/popup.service.js';
import { memberService } from '@/modules/group/services/member.service.js';

const groupStore = useGroupStore();
const authStore = useAuthStore();

const props = defineProps({
  group: { type: Object },
});

const emit = defineEmits(['close']);

const edit = ref(false);
const groupToEdit = ref(null);

const colors = computed(() => groupService.groupColors);

function setGroupToEdit() {
  if (!props.group) {
    edit.value = false;
    groupToEdit.value = getNewGroup();
  } else {
    edit.value = true;
    groupToEdit.value = structuredClone(props.group);
  }
}

function getNewGroup() {
  const group = groupService.getEmptyGroup();
  group.color = colors.value?.[0];

  // create a member from the loggedin user
  const { username, email, id } = authStore.loggedInUser;
  const member = memberService.createMember({ username, email, id, isOwner: true });

  memberService.addMember(member, group);
  return group;
}

async function saveGroup() {
  if (!groupToEdit.value.name) {
    popupService.warn('Please enter group name');
    return;
  }
  await groupStore.saveGroup({ group: groupToEdit.value });
  emit('close');
}

setGroupToEdit();
</script>
