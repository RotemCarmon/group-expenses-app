<template>
  <section class="login-signup-container">
    <div class="page-header">
      <div class="title">Sign In</div>
    </div>
    <form>
      <label class="form-row">
        <span>Email </span>
        <div class="input-wrapper">
          <font-awesome-icon icon="fa-thin fa-at" class="form-icon" />
          <input type="text" v-model="creds.email" class="form-input" ref="input" />
        </div>
        <p class="error" v-show="errors.emailError">{{ errors.emailError }}</p>
      </label>
      <label class="form-row password-field">
        <span>Password </span>
        <img :src="eyeImgUrl" class="toggle-password" @click="isPasswordShowen = !isPasswordShowen" alt="toggle hide/show password" />
        <div class="input-wrapper">
          <font-awesome-icon icon="fa-thin fa-lock" class="form-icon" />
          <input :type="isPasswordShowen ? 'text' : 'password'" autocomplete v-model="creds.password" class="form-input" />
        </div>
        <p class="error" v-show="errors.passwordError">{{ errors.passwordError }}</p>
      </label>

      <button @click.prevent="doLogin" class="btn dark bottom-btn">Sign in</button>

      <div class="no-account">
        <p>Don’t have an account yet?</p>
        <span @click.prevent="goToRegister">Register</span>
      </div>
    </form>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '../store/auth.store';
import { showPassword, focusInput } from '@/composables/auth.composable.js';

const authStore = useAuthStore();

const { isPasswordShowen, eyeImgUrl } = showPassword();
const { input } = focusInput();

const emit = defineEmits(['toggle']);

const creds = reactive({
  email: '',
  password: '',
});

const errors = reactive({
  emailError: '',
  passwordError: '',
});

// FUNCTIONS
function doLogin() {
  const isValid = validateInputs();
  if (!isValid) return;
  authStore.login({ userCreds: creds });
}

function validateInputs() {
  errors.emailError = '';
  errors.passwordError = '';

  let isValid = true;
  if (!creds.email) {
    errors.emailError = 'Must enter email';
    isValid = false;
  }
  if (!creds.password) {
    errors.passwordError = 'Must enter password';
    isValid = false;
  }
  return isValid;
}

function goToRegister() {
  emit('toggle');
}
</script>
