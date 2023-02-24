<template>
  <section class="member-edit-container container" v-if="memberToEdit">
    <main>
      <button @click="$emit('close')" class="close-btn">
        <img :src="require('@/assets/icons/close.svg')" />
      </button>
      <div class="page-header">
        <div class="title">{{ isEdit ? 'Edit' : 'Add' }} Member</div>
      </div>
      <input
        type="text"
        class="form-input"
        placeholder="Enter Name"
        v-model="memberToEdit.name"
      />
      <input
        type="text"
        class="form-input"
        placeholder="Enter Email"
        v-model="memberToEdit.email"
      />
    </main>
    <button @click="save" class="btn dark buttom-btn create-btn">Save</button>
  </section>
</template>

<script>
export default {
  name: 'member-edit',
  props: {
    member: { type: Object },
  },
  data() {
    return {
      memberToEdit: null,
      isEdit: false,
    };
  },
  methods: {
    save() {
      this.$emit('save', this.memberToEdit);
    },
  },
  created() {
    this.memberToEdit = this.member;
    this.isEdit = this.memberToEdit.name ? true : false;
  },
};
</script>