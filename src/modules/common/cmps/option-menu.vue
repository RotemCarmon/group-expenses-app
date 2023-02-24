<template>
  <section
    ref="optionMenu"
    tabindex="0"
    @blur="handleBlur"
    class="option-menu-container"
  >
    <div class="option-list">
      <slot name="content-top"></slot>
      <div @click="edit" class="line">Edit</div>
      <div @click="remove" class="line delete">Delete</div>
      <slot name="content-bottom"></slot>
    </div>
  </section>
</template>

<script>
export default {
  name: 'option-menu',
  methods: {
    edit() {
      this.$emit('edit');
    },
    remove() {
      this.$emit('remove');
    },
    handleBlur() {
      this.$emit('close')
    },
  },
  mounted() {
    this.$refs.optionMenu.focus()
  },
};
</script>

<style>
</style>