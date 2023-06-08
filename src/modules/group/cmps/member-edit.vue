<template>
  <form @submit.prevent="save" class="member-edit-container main-app-container" aria-label="form" data-testId="edit-member-form" v-if="memberToEdit">
    <main>
      <button @click="$emit('close')" class="close-btn">
        <img src="@/assets/icons/close.svg" alt="close button" />
      </button>
      <div class="page-header container">
        <div class="header-title">{{ isEdit ? 'Edit' : 'Add' }} Member</div>
      </div>
      <div class="form container">
        <div class="input-wrapper form-row">
          <font-awesome-icon icon="fa-thin fa-user" class="form-icon" />
          <input aria-label="member-name" type="text" class="form-input" placeholder="Enter Name" v-model="memberToEdit.name" />
        </div>
        <div class="input-wrapper form-row">
          <font-awesome-icon icon="fa-thin fa-at" class="form-icon" />
          <input aria-label="member-email" type="text" class="form-input" placeholder="Enter Email" v-model="memberToEdit.email" />
        </div>
      </div>
    </main>
    <div class="footer container">
      <button type="submit" class="btn dark bottom-btn create-btn">Save</button>
    </div>
  </form>
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
