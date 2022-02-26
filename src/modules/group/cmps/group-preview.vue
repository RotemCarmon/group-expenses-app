<template>
  <section
    class="group-preview-container preview-grid"
    @click.stop="goToGroupDetails"
  >
    <div class="group-name">{{ group.name }}</div>
    <div class="ellipsis-icon" @click.stop="$emit('openMenu', group.id)">
      <img :src="require('@/assets/icons/ellipsis.svg')" alt="" />
    </div>
  </section>
</template>

<script>
import { actionButtons } from '@/modules/common/cmps';
export default {
  name: 'group-preview',
  props: {
    group: { type: Object },
  },
  methods: {
    goToGroupDetails() {
      this.$router.push('group/' + this.group.id);
    },
  },
  components: {
    actionButtons,
  },
};
</script>

<style>
</style>