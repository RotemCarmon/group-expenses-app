<template>
  <section class="group-preview-container preview-grid" @click.stop="goToGroupDetails" data-testid="group-preview">
    <div class="group-name" data-testid="group-name">{{ group.name }}</div>
    <div class="ellipsis-icon" @click.stop="$emit('openMenu', group)" data-testid="group-menu" >
      <img src="@/assets/icons/ellipsis.svg" />
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  group: { type: Object },
});

function goToGroupDetails() {
  router.push('group/' + props.group.id);
}
</script>