<template>
  <section class="group-preview-container preview-grid" @click.stop="goToGroupDetails">
    <div class="group-name">{{group.name}}</div>
    <action-buttons @edit="editGroup" @remove="removeGroup" />
  </section>
</template>

<script>
import {actionButtons} from '@/modules/common/cmps'
export default {
name:'group-preview',
props: {
  group: { type: Object },
},
methods: {
  editGroup() {
    console.log('Editing group', this.group.name);
    this.$router.push(`edit/${this.group._id}`)
  },
  removeGroup() {
    console.log('Removing group', this.group.name);
  },
  goToGroupDetails(){
    this.$router.push(this.group._id)
    
  }
},
components: {
  actionButtons
}
}
</script>

<style>

</style>