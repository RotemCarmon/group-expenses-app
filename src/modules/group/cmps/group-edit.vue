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
          <button @click="editMember()" class="add-member top-header-btn">
            Add <img :src="require('@/assets/icons/plus-solid.svg')" />
          </button>
        </div>
        <div class="members-list">
          <member-preview
            v-for="member in groupToEdit.members"
            :key="member.id"
            :member="member"
            @toggleMenu="toggleMenu"
          />
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
      <option-menu v-if="isMenuOpen" @remove="removeMember" @close="toggleMenu" :isShowEdit="false"></option-menu>
    </transition>
  </section>
</template>

<script>
import { groupService } from '../services/group.service.js';
import memberPreview from './member-preview';
import memberEdit from './member-edit';
import { optionMenu } from '@/modules/common/cmps';
import { popupService } from '@/modules/common/services/popup.service.js';
export default {
  name: 'group-edit',
  data() {
    return {
      edit: false,
      groupToEdit: null,
      isEditMember: false,
      isMenuOpen: false,
      memberSelected: null,
    };
  },
  methods: {
    editMember() {
      if (!this.memberSelected) {
        this.memberSelected = groupService.getEmptyMember();
      }
      this.isEditMember = true;
      this.isMenuOpen = false;
    },
    toggleEditMember() {
      this.isEditMember = !this.isEditMember;
      if (!this.isEditMember) {
        this.memberSelected = null;
      }
    },
    async saveMember(member) {
      const isMemeberExist = !!this.groupToEdit.members[member.email];
      if (isMemeberExist) {
        popupService.error('Member already exist with this email');
      } else {
        this.groupToEdit.members[member.email] = member;
        this.groupToEdit.memberEmails.push(member.email);
      }

      this.closeEditMember();
    },
    async removeMember() {
      const member = this.memberSelected;
      if (member.isOwner) {
        popupService.warn("Can't remove the group owner");
        return;
      }

      if (this.groupToEdit.expenses?.length) {
        // group is active
        popupService.warn("Can't remove a member from an active group");
        return;
      }

      const isConfirm = await popupService.confirm(
        `Are you sure you want to remove the member ${member.name}?`,
        'Yes',
        'No'
      );

      if (!isConfirm) return;
      delete this.groupToEdit.members[member.email];
      this.groupToEdit.memberEmails = this.groupToEdit.memberEmails.filter((email) => email !== member.email);
    },
    closeEditMember() {
      this.isEditMember = false;
      this.memberSelected = null;
    },

    async getGroup() {
      const { groupId } = this.$route.params;
      this.edit = !!groupId;
      if (groupId) {
        this.getGroupById(groupId);
      } else {
        this.getNewGroup();
      }
    },
    async getGroupById(groupId) {
      const group = await this.$store.dispatch({
        type: 'groupStore/getGroupById',
        groupId,
      });
      this.groupToEdit = JSON.parse(JSON.stringify(group));
    },

    getNewGroup() {
      const group = groupService.getEmptyGroup();

      // create a member from the loggedin user
      const { username, email, id } = this.$store.getters['authStore/loggedInUser'];
      const member = groupService.createMember({ username, email, id, isOwner: true });

      // add member to group
      group.members[email] = member;
      group.memberEmails = [email];

      this.groupToEdit = group;
    },
    async saveGroup() {
      if (!this.groupToEdit.name) {
        popupService.warn('Please enter group name');
        return;
      }

      const { id } = await this.$store.dispatch({
        type: 'groupStore/saveGroup',
        group: this.groupToEdit,
      });
      this.$router.push('/group/' + id);
    },
    toggleMenu(member) {
      this.memberSelected = this.memberSelected ? null : { ...member };
      this.isMenuOpen = !this.isMenuOpen;
    },
  },
  created() {
    this.getGroup();
  },
  components: {
    memberPreview,
    memberEdit,
    optionMenu,
  },
};
</script>
