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
        <h3 class="members-title">Members</h3>
        <div class="members-list">
          <member-preview
            v-for="member in groupToEdit.members"
            :key="member.id"
            :member="member"
          />
        </div>
        <button
          @click="isAddMember = !isAddMember"
          class="add-member btn-dashed"
        >
          + Add Member
        </button>
      </div>
    </main>
    <button class="btn dark buttom-btn create-btn">Save</button>
    <transition name="slide-down" mode="out-in">
      <memberEdit v-if="isAddMember" @close="isAddMember = false" />
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
    };
  },
  methods: {
    addMember() {},
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
        this.groupToEdit = groupService.getEmptyGroup();
      }
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