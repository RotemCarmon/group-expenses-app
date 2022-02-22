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
    this.$router.replace(`group/edit/${this.group.id}`)
  },
  removeGroup() {
    console.log('Removing group', this.group.name);
  },
  goToGroupDetails(){
    this.$router.push('group/'+this.group.id)
    
  }
},
components: {
  actionButtons
}
}
</script>

<style>

</style>