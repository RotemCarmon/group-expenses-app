<template>
  <section class="member-edit-container main-app-container" v-if="memberToEdit">
    <main>
      <button @click="$emit('close')" class="close-btn">
        <img src="@/assets/icons/close.svg" />
      </button>
      <div class="page-header container">
        <div class="title">{{ isEdit ? 'Edit' : 'Add' }} Member</div>
      </div>
      <div class="form container">
        <input type="text" class="form-input" placeholder="Enter Name" v-model="memberToEdit.name" />
        <input type="text" class="form-input" placeholder="Enter Email" v-model="memberToEdit.email" />
      </div>
    </main>
    <div class="footer container">
      <button @click="save" class="btn dark bottom-btn create-btn">Save</button>
    </div>
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
