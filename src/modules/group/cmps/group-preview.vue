<template>
  <section class="group-preview-container preview-grid" @click.stop="goToGroupDetails">
    <div class="group-name">{{ group.name }}</div>
    <div class="ellipsis-icon" @click.stop="$emit('openMenu', group)">
      <img :src="require('@/assets/icons/ellipsis.svg')" />
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { actionButtons } from '@/modules/common/cmps';

const router = useRouter();

const props = defineProps({
  group: { type: Object },
});

function goToGroupDetails() {
  router.push('group/' + props.group.id);
}
</script>