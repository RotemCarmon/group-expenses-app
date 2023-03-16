<template>
  <section ref="optionMenu" tabindex="0" @blur="handleBlur" class="option-menu-container">
    <div class="option-list">
      <slot name="content-top"></slot>
      <div v-if="isShowEdit" @click="edit" class="line">Edit</div>
      <div v-if="isShowRemove" @click="remove" class="line delete">Delete</div>
      <slot name="content-bottom"></slot>
    </div>
  </section>
</template>

<script>
export default {
  name: 'option-menu',
  props: {
    isShowEdit: { type: Boolean, default: true },
    isShowRemove: { type: Boolean, default: true },
  },
  methods: {
    edit() {
      this.$emit('edit');
    },
    remove() {
      this.$emit('remove');
    },
    handleBlur() {
      this.$emit('close');
    },
  },
  mounted() {
    this.$refs.optionMenu.focus();
  },
};
</script>

<style></style>
