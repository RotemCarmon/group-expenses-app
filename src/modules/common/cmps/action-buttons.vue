<template>
  <section class="action-buttons-container">
    <img @click.stop="edit" src="@/assets/icons/edit.svg" />
    <img @click.stop="remove" src="@/assets/icons/delete.svg" />
  </section>
</template>

<script setup>
const emit = defineEmits(['edit', 'remove']);

function edit() {
  emit('edit');
}
function remove() {
  emit('remove');
}
</script>
