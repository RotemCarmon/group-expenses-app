<template>
  <section class="member-preview-container preview-grid">
    <div class="name">
      {{ member.name }}
      <span class="group-owner" v-if="member.isOwner">Owner</span>
    </div>
    <action-buttons @edit="editMember" />
  </section>
</template>

<script>
import { actionButtons } from '@/modules/common/cmps';
export default {
  name: 'member-preview',
  props: {
    member: { type: Object },
  },
  methods: {
    editMember() {
      this.$emit('edit', this.member);
    },
  },
  components: {
    actionButtons,
  },
};
</script>

<style>
</style>