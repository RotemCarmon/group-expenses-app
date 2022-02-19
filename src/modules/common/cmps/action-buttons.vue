<template>
  <section class="action-buttons-container">
    <img @click="edit" :src="require('@/assets/icons/edit.svg')" />
    <img @click="remove" :src="require('@/assets/icons/delete.svg')" />
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