<template>
  <section class="member-preview-container preview-grid">
    <div class="name">
      <font-awesome-icon :icon="['fat', iconName]" class="member-icon" size="xs" />
      <span data-testId="member-name">{{ member.name }}</span>
      <span class="group-owner" data-testId="group-owner" v-if="member.isOwner">Owner</span>
    </div>
    <div class="ellipsis-icon" @click.stop="$emit('toggleMenu', member)">
      <img src="@/assets/icons/ellipsis.svg" alt="ellipsis" />
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  member: { type: Object },
});

const emit = defineEmits(['edit', 'toggleMenu']);
const iconName = computed(() => (props.member.isOwner ? 'fa-crown' : 'fa-gem'));

function editMember() {
  emit('edit', props.member);
}
</script>
