<template>
  <section class="group-edit-container container" v-if="groupToEdit">
    <main>
      <div class="page-header">
        <div class="title">{{ edit ? 'Edit' : 'Add' }} Group</div>
      </div>
      <div class="group-form">
        <input
          class="form-input"
          type="text"
          v-model="groupToEdit.name"
          placeholder="Group Name"
        />
        <textarea
          class="form-textarea"
          v-model="groupToEdit.description"
          placeholder="Group Description"
        />
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
    <button @click="saveGroup" class="btn dark bottom-btn create-btn">
      Save
    </button>

    <!-- MEMBER EDIT -->
    <transition name="slide-down" mode="out-in">
      <member-edit
        v-if="isEditMember"
        @close="toggleEditMember"
        @save="saveMember"
        :member="memberSelected"
      />
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
      // if group have expenses already and the member email was updated - don't allow!

      const idx = this.groupToEdit.members.findIndex((m) => m.id === member.id);
      if (idx === -1) {
        this.groupToEdit.members.push(member);
        this.groupToEdit.memberEmails.push(member.email);
      } else {
        this.groupToEdit.members.splice(idx, 1, member);
      }

      this.closeEditMember();
    },
    closeEditMember() {
      this.isEditMember = false;
      this.memberSelected = null;
    },

    async getGroup() {
      const { groupId } = this.$route.params;

      this.edit = !!groupId;
      if (groupId) {
        const group = await this.$store.dispatch({
          type: 'groupStore/getGroupById',
          groupId,
        });
        this.groupToEdit = JSON.parse(JSON.stringify(group));
      } else {
        const { username, email, id } =
          this.$store.getters['authStore/loggedInUser'];
        const group = groupService.getEmptyGroup();
        group.members.push({ id, email, name: username, isOwner: true });
        group.memberEmails = [email];
        this.groupToEdit = group;
      }
    },
    async saveGroup() {
      if (!this.groupToEdit.name) {
        popupService.error('Please enter group name');
        return;
      }

      const membersEmails = this.groupToEdit.members.map((m) => m.email);
      membersEmails.forEach((memberEmail) => {
        if (!this.groupToEdit.expenses[memberEmail]) {
          this.groupToEdit.expenses[memberEmail] = [];
        }
      });

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
    async removeMember() {
      const member = this.memberSelected;
      if (member.isOwner) {
        popupService.warn("Can't remove the group owner");
        return;
      }
      const isConfirm = await popupService.confirm(
        `Are you sure you want to remove the member ${member.name}?`,
        'Yes',
        'No'
      );
      if (!isConfirm) return;
      this.groupToEdit.members = this.groupToEdit.members.filter(
        (m) => m.id !== member.id
      );
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