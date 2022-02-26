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
            @edit="editMember"
          />
        </div>
      </div>
    </main>
    <button @click="saveGroup" class="btn dark buttom-btn create-btn">
      Save
    </button>

    <transition name="slide-down" mode="out-in">
      <memberEdit
        v-if="isAddMember"
        @close="isAddMember = false"
        @save="saveMember"
        :member="memberToEdit"
      />
    </transition>
  </section>
</template>

<script>
import { groupService } from '../services/group.service.js';
import memberPreview from './member-preview';
import memberEdit from './member-edit';
export default {
  name: 'group-edit',
  data() {
    return {
      edit: false,
      groupToEdit: null,
      isAddMember: false,
      memberToEdit: null,
    };
  },
  methods: {
    editMember(member) {
      if (!member) member = groupService.getEmptyMember();
      this.memberToEdit = { ...member };
      this.isAddMember = true;
    },
    saveMember(member) {
      const idx = this.groupToEdit.members.findIndex((m) => m.id === member.id);
      if (idx === -1) {
        this.groupToEdit.members.push(member);
        this.groupToEdit.memberEmails.push(member.email);
      } else {
        this.groupToEdit.members.splice(idx, 1, member);
      }
      this.isAddMember = false;
      this.memberToEdit = null;
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
      const members = this.groupToEdit.members.map((m) => m.name);
      members.forEach((member) => {
        const lowCaseMember = member.toLowerCase();
        if (!this.groupToEdit.expenses[lowCaseMember]) {
          this.groupToEdit.expenses[lowCaseMember] = [];
        }
      });

      const { id } = await this.$store.dispatch({
        type: 'groupStore/saveGroup',
        group: this.groupToEdit,
      });
      this.$router.push('/group/' + id);
    },
  },
  created() {
    this.getGroup();
  },
  components: {
    memberPreview,
    memberEdit,
  },
};
</script>