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

<script setup>
const props = defineProps({
  member: { type: Object },
});

const emit = defineEmits(['edit','toggleMenu']);

function editMember() {
  emit('edit', props.member);
}
</script>
