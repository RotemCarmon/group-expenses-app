<template>
  <section ref="optionMenu" tabindex="0" @blur="$emit('close')" class="option-menu-container">
    <div class="option-list">
      <slot name="content-top"></slot>
      <div v-if="isShowEdit" @click="$emit('edit')" class="line">Edit</div>
      <div v-if="isShowRemove" @click="$emit('remove')" class="line delete">Delete</div>
      <slot name="content-bottom"></slot>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
  isShowEdit: { type: Boolean, default: true },
  isShowRemove: { type: Boolean, default: true },
});

// const emit = defineEmits(['edit', 'remove', 'close']);

const optionMenu = ref(null);

onMounted(() => {
  optionMenu.value.focus();
});
</script>

<style></style>
