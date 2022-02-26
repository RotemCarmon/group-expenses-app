<template>
  <section class="option-menu-container">
    <div class="option-list">
      <div @click="edit" class="line">Edit</div>
      <div @click="remove" class="line delete">Delete</div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'option-menu',
  methods: {
    edit() {
      this.$emit('edit')
    },
    remove() {
      this.$emit('remove')
    }
  },
};
</script>

<style>
</style>