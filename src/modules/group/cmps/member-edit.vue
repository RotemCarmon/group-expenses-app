<template>
  <section class="member-edit-container container" v-if="memberToEdit">
    <main>
      <button @click="$emit('close')" class="close-btn">
        <img :src="require('@/assets/icons/close.svg')" />
      </button>
      <div class="page-header">
        <div class="title">{{ isEdit ? 'Edit' : 'Add' }} Member</div>
      </div>
      <input type="text" class="form-input" placeholder="Enter Name" v-model="memberToEdit.name" />
      <input type="text" class="form-input" placeholder="Enter Email" v-model="memberToEdit.email" />
    </main>
    <button @click="save" class="btn dark bottom-btn create-btn">Save</button>
  </section>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({
  member: { type: Object },
});
const emit = defineEmits(['save']);

const memberToEdit = ref(props.member);
const isEdit = ref(!!memberToEdit.value?.name);

// FUNCTIONS
function save() {
  emit('save', memberToEdit.value);
}
</script>
