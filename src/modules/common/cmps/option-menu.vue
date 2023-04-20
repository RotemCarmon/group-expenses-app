<template>
  <section ref="optionMenu" tabindex="0" @blur="$emit('close')" class="option-menu-container main-app-container">
    <h3 v-if="title" class="option-menu-title">{{ title }}</h3>
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
  title: { type: String, required: false },
});

const optionMenu = ref(null);

onMounted(() => {
  optionMenu.value.focus();
});
</script>

<style></style>
