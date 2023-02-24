<template>
  <section class="member-preview-container preview-grid">
    <div class="name">
      {{ member.name }}
      <span class="group-owner" v-if="member.isOwner">Owner</span>
    </div>
    <div class="ellipsis-icon" @click.stop="$emit('toggleMenu', member)">
      <img :src="require('@/assets/icons/ellipsis.svg')" />
    </div>
  </section>
</template>

<script>
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
};
</script>

<style>
</style>