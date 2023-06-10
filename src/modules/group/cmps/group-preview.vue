<template>
  <section class="group-preview-container" @click.stop="goToGroupDetails" data-testid="group-preview">
    <div class="group-name" data-testid="group-name">{{ group.name }}</div>
    <div class="group-created-at">{{ formatDate(group.createdAt, 'dd/MM/yy') }}</div>
    <div class="group-member-count">Members: <span>{{ memberCount }}</span></div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { formatDate } from '@/modules/common/services/util.service';

const router = useRouter();

const props = defineProps({
  group: { type: Object },
});

const memberCount = computed(() => {
  return Object.keys(props.group?.members ?? {}).length;
});

function goToGroupDetails() {
  router.push('group/' + props.group.id + '/expenses');
}
</script>
