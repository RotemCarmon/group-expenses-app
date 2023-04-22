<template>
  <section class="group-edit-container" v-if="groupToEdit">
    <main>
      <div class="page-header container">
        <div class="title">{{ edit ? 'Edit' : 'Add' }} Group</div>
      </div>
      <div class="group-edit-form">
        <div class="group-form container">
          <input class="form-input" type="text" v-model="groupToEdit.name" placeholder="Group Name" />
          <textarea class="form-textarea" v-model="groupToEdit.description" placeholder="Group Description" />
        </div>
        <div class="members-list-container">
          <div class="list-header container">
            <h3 class="members-title">Members</h3>
            <button @click="editMember()" class="add-member top-header-btn">Add <img :src="require('@/assets/icons/plus-solid.svg')" /></button>
          </div>
          <div class="member-list-wrapper container">
            <div class="members-list">
              <member-preview v-for="member in members" :key="member.id" :member="member" @toggleMenu="toggleMenu" />
            </div>
          </div>
        </div>
      </div>
    </main>
    <div class="footer container">
      <button @click="saveGroup" class="btn dark bottom-btn create-btn">Save</button>
    </div>

    <!-- MEMBER EDIT -->
    <transition name="slide-down" mode="out-in">
      <member-edit v-if="isEditMember" @close="toggleEditMember" @save="saveMember" :member="memberSelected" />
    </transition>

    <!-- EXPENSE LIST - EDIT MODE -->
    <transition name="slide-down" mode="out-in">
      <expense-list-selectable v-if="newMemberEmail" :group="groupToEdit" :memberEmail="newMemberEmail" @close="newMemberEmail = null" @closeAndRemove="closeAndRemoveNewMember" />
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
import expenseList from '@/modules/expense/cmps/expense-list';
import expenseListSelectable from '@/modules/expense/cmps/expense-list-selectable';
import { popupService } from '@/modules/common/services/popup.service.js';
import { ref, computed } from 'vue';
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

const newMemberEmail = ref(null);

// COMPUTED
const members = computed(() => {
  return Object.values(groupToEdit.value.members).sort((a, b) => {
    if (a.isOwner) return -1;
    if (b.isOwner) return 1;
    return b.name > a.name ? -1 : 1;
  });
});

const isGroupOwner = computed(() => {
  return memberSelected.value?.isOwner;
});
const isGroupActive = computed(() => {
  return groupToEdit.value.expenses && groupToEdit.value.expenses.length;
});
const isEditEnabled = computed(() => {
  return !isGroupOwner.value && !isGroupActive.value;
});

// FUNCTIONS
function editMember() {
  if (!memberSelected.value) {
    memberSelected.value = groupService.createMember();
  }
  isEditMember.value = true;
  isMenuOpen.value = false;
}

async function saveMember(member) {
  const isMemeberExist = !!groupToEdit.value.members[member.email];
  if (isMemeberExist) {
    popupService.error('Member already exist with this email');
  } else {
    if (isGroupActive.value) {
      const confirm = await popupService.confirm({ title: 'Add New Member', txt: "In order to add a new member to an active group, you'll need to select which expenses to include them in." });
      if (!confirm) closeEditMember();

      newMemberEmail.value = member.email;
    }

    groupToEdit.value.members[member.email] = member;
    groupToEdit.value.memberEmails.push(member.email);
  }
  closeEditMember();
}

function closeAndRemoveNewMember(memberEmail) {
  delete groupToEdit.value.members[memberEmail];
  const idx = groupToEdit.value.memberEmails.indexOf(memberEmail);
  if (idx !== -1) groupToEdit.value.memberEmails.splice(idx, 1);

  newMemberEmail.value = null;
  closeEditMember();
}

async function removeMember() {
  if (isGroupOwner.value) {
    popupService.warn("Can't remove the group owner");
    return;
  }

  if (isGroupActive.value) {
    // group is active
    popupService.warn("Can't remove a member from an active group");
    return;
  }

  const member = memberSelected.value;
  const isConfirm = await popupService.confirm({ title: 'Remove member?', txt: `Are you sure you want to remove the member ${member.name}?`, approveTxt: 'Yes', cancelTxt: 'No' });

  if (!isConfirm) return;
  delete groupToEdit.value.members[member.email];
  groupToEdit.value.memberEmails = groupToEdit.value.memberEmails.filter((email) => email !== member.email);
}

function toggleEditMember() {
  isEditMember.value = !isEditMember.value;
  if (!isEditMember.value) {
    memberSelected.value = null;
  }
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
