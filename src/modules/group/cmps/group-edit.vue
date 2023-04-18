<template>
  <section class="group-edit-container container" v-if="groupToEdit">
    <main>
      <div class="page-header">
        <div class="title">{{ edit ? 'Edit' : 'Add' }} Group</div>
      </div>
      <div class="group-form">
        <input class="form-input" type="text" v-model="groupToEdit.name" placeholder="Group Name" />
        <textarea class="form-textarea" v-model="groupToEdit.description" placeholder="Group Description" />
      </div>
      <div class="members-list-container">
        <div class="list-header">
          <h3 class="members-title">Members</h3>
          <button @click="editMember()" class="add-member top-header-btn">Add <img :src="require('@/assets/icons/plus-solid.svg')" /></button>
        </div>
        <div class="members-list">
          <member-preview v-for="member in groupToEdit.members" :key="member.id" :member="member" @toggleMenu="toggleMenu" />
        </div>
      </div>
    </main>
    <button @click="saveGroup" class="btn dark bottom-btn create-btn">Save</button>

    <!-- MEMBER EDIT -->
    <transition name="slide-down" mode="out-in">
      <member-edit v-if="isEditMember" @close="toggleEditMember" @save="saveMember" :member="memberSelected" />
    </transition>

    <!-- OPTION MENU -->
    <transition name="menu-bottom" mode="out-in">
      <option-menu v-if="isMenuOpen" :title="memberSelected.name" @remove="removeMember" @close="toggleMenu" :isShowEdit="isEditEnabled" />
    </transition>
  </section>
</template>

<script setup>
import { useGroupStore } from '../store/';
import { useAuthStore } from '@/modules/auth/store/auth.store';

import { groupService } from '../services/group.service.js';
import memberPreview from './member-preview';
import memberEdit from './member-edit';
import optionMenu from '@/modules/common/cmps/option-menu';
import { popupService } from '@/modules/common/services/popup.service.js';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const groupStore = useGroupStore();
const authStore = useAuthStore();

const route = useRoute();
const router = useRouter();

const edit = ref(false);
const groupToEdit = ref(null);
const isEditMember = ref(false);
const isMenuOpen = ref(false);
const memberSelected = ref(null);

function editMember() {
  if (!memberSelected.value) {
    memberSelected.value = groupService.createMember();
  }
  isEditMember.value = true;
  isMenuOpen.value = false;
}

function toggleEditMember() {
  isEditMember.value = !isEditMember.value;
  if (!isEditMember.value) {
    memberSelected.value = null;
  }
}

async function saveMember(member) {
  const isMemeberExist = !!groupToEdit.value.members[member.email];
  if (isMemeberExist) {
    popupService.error('Member already exist with this email');
  } else {
    groupToEdit.value.members[member.email] = member;
    groupToEdit.value.memberEmails.push(member.email);
  }

  closeEditMember();
}

async function removeMember() {
  const member = memberSelected.value;
  if (member.isOwner) {
    popupService.warn("Can't remove the group owner");
    return;
  }

  if (groupToEdit.value.expenses?.length) {
    // group is active
    popupService.warn("Can't remove a member from an active group");
    return;
  }

  const isConfirm = await popupService.confirm(`Are you sure you want to remove the member ${member.name}?`, 'Yes', 'No');

  if (!isConfirm) return;
  delete groupToEdit.value.members[member.email];
  groupToEdit.value.memberEmails = groupToEdit.value.memberEmails.filter((email) => email !== member.email);
}

function closeEditMember() {
  isEditMember.value = false;
  memberSelected.value = null;
}

async function getGroup() {
  const { groupId } = route.params;

  edit.value = !!groupId;
  if (groupId) {
    getGroupById(groupId);
  } else {
    getNewGroup();
  }
}

async function getGroupById(groupId) {
  const group = await groupStore.getGroupById({ groupId });
  groupToEdit.value = JSON.parse(JSON.stringify(group));
}

function getNewGroup() {
  const group = groupService.getEmptyGroup();

  // create a member from the loggedin user
  const { username, email, id } = authStore.loggedInUser;
  const member = groupService.createMember({ username, email, id, isOwner: true });

  // add member to group
  group.members[email] = member;
  group.memberEmails = [email];

  groupToEdit.value = group;
}

async function saveGroup() {
  if (!groupToEdit.value.name) {
    popupService.warn('Please enter group name');
    return;
  }

  const { id } = await groupStore.saveGroup({ group: groupToEdit.value });
  router.push('/group/' + id);
}

function toggleMenu(member) {
  memberSelected.value = memberSelected.value ? null : { ...member };
  isMenuOpen.value = !isMenuOpen.value;
}

// CREATED
getGroup();
</script>
