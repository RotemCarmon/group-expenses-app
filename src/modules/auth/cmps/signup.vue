<template>
  <section class="login-signup-container">
    <div class="page-header">
      <div class="title">Sign Up</div>
    </div>
    <form>
      <label class="form-row">
        <span>Username </span>

        <div class="input-wrapper">
          <font-awesome-icon icon="fa-thin fa-user" class="form-icon" />
          <input type="text" v-model="creds.username" autocomplete="username" class="form-input" ref="input" />
        </div>

        <p class="error" v-show="errors.usernameError">{{ errors.usernameError }}</p>
      </label>
      <label class="form-row">
        <span>Email </span>

        <div class="input-wrapper">
          <font-awesome-icon icon="fa-thin fa-at" class="form-icon" />
          <input type="text" v-model="creds.email" autocomplete="email" class="form-input" />
        </div>
        <p class="error" v-show="errors.emailError">{{ errors.emailError }}</p>
      </label>
      <label class="form-row password-field">
        <span>Password </span>
        <img :src="eyeImgUrl" class="toggle-password" @click="isPasswordShowen = !isPasswordShowen" alt="toggle hide/show password" />
        <div class="input-wrapper">
          <font-awesome-icon icon="fa-thin fa-lock" class="form-icon" />
          <input :type="isPasswordShowen ? 'text' : 'password'" autocomplete="new-password" v-model="creds.password" class="form-input" />
        </div>
        <p class="error" v-show="errors.passwordError">{{ errors.passwordError }}</p>
      </label>

      <button :disabled="!isButtonEnabled" @click.prevent="doSignup" class="btn dark bottom-btn">Create Account</button>

      <div class="no-account">
        <p>Already have an account?</p>
        <span @click.prevent="goToSignin">Sign In</span>
      </div>
    </form>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from 'vue';
import { useAuthStore } from '../store/auth.store';
import { showPassword } from '@/composables/auth.composable.js';
import { focusInput } from '@/composables/input.composable.js';

const authStore = useAuthStore();

const { isPasswordShowen, eyeImgUrl } = showPassword();
const { input } = focusInput();

const emit = defineEmits(['toggle']);

const creds = reactive({
  username: '',
  email: '',
  password: '',
});

const isButtonEnabled = computed(() => {
  return creds.username && creds.email && creds.password && creds.password.length >= 6;
});

const errors = reactive({
  usernameError: '',
  emailError: '',
  passwordError: '',
});

// FUNCTIONS
async function doSignup() {
  const isValid = validate();
  if (!isValid) return;
  authStore.signup({ userCreds: creds });
}

function validate() {
  errors.usernameError = '';
  errors.emailError = '';
  errors.passwordError = '';

  let isValid = true;

  if (!creds.username) {
    errors.usernameError = 'Must enter username';
    isValid = false;
  }
  if (!creds.email) {
    errors.emailError = 'Must enter email';
    isValid = false;
  }
  if (!creds.password) {
    errors.passwordError = 'Must enter password';
    isValid = false;
  } else if (creds.password.length < 6) {
    errors.passwordError = 'Password should be at least 6 characters';
    isValid = false;
  }
  return isValid;
}

function goToSignin() {
  emit('toggle');
}
</script>
