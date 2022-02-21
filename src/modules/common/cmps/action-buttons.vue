<template>
  <section class="action-buttons-container">
    <img @click.stop="edit" :src="require('@/assets/icons/edit.svg')" />
    <img @click.stop="remove" :src="require('@/assets/icons/delete.svg')" />
  </section>
</template>

<script>
export default {
  name: 'action-buttons',
  methods: {
    edit() {
      this.$emit('edit')
    },
    remove() {
      this.$emit('remove')
    }
  },

}
</script>