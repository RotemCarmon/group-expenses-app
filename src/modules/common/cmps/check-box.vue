<template>
  <label class="check-box-container">
    <input class="checkbox" type="checkbox" :checked="isChecked" @change="$emit('update:isChecked', !isChecked)" />
    <span class="checkmark"></span>
  </label>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  isChecked: { type: Boolean, default: false },
});
</script>
