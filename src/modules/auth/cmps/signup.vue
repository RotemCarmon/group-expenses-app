<template>
  <section class="login-signup-container container" >
    <div class="page-header">
      <div class="title">Sign Up</div>
    </div>
    <form>
      <label class="form-row">
        <span>Username </span>
        <input
          type="text"
          v-model="creds.username"
          autocomplete="username"
          class="form-input"
        />
        <p class="error" v-show="usernameError">{{ usernameError }}</p>
      </label>
      <label class="form-row">
        <span>Email </span>
        <input
          type="text"
          v-model="creds.email"
          autocomplete="email"
          class="form-input"
        />
        <p class="error" v-show="emailError">{{ emailError }}</p>
      </label>
      <label class="form-row password-field">
        <span>Password </span>
        <img
          :src="require(`@/assets/icons/${eyeImg}.svg`)"
          class="toggle-password"
          @click="isPasswordShowen = !isPasswordShowen"
        />
        <input
          :type="isPasswordShowen? 'text':'password'"
          autocomplete="new-password"
          v-model="creds.password"
          class="form-input"
        />
        <p class="error" v-show="passwordError">{{ passwordError }}</p>
      </label>

      <button @click.prevent="doSignup" class="btn dark bottom-btn">
        Create Account
      </button>

      <div class="no-account">
        <p>Already have an account?</p>
        <span @click.prevent="goToSignin">Sign In</span>
      </div>
    </form>
  </section>
</template>

<script>
export default {
  name: 'signup',
  data() {
    return {
      creds: {
        username: '',
        email: '',
        password: '',
      },
      usernameError: '',
      emailError: '',
      passwordError: '',
      isPasswordShowen: false,
    };
  },
  methods: {
    async doSignup() {
      const isValid = this.validate();
      if (!isValid) return;
      this.$store.dispatch({
        type: 'authStore/signup',
        userCreds: this.creds,
      });
    },
    validate() {
      this.usernameError = '';
      this.emailError = '';
      this.passwordError = '';
      let isValid = true;
      if (!this.creds.username) {
        this.usernameError = 'Must enter username';
        isValid = false;
      }
      if (!this.creds.email) {
        this.emailError = 'Must enter email';
        isValid = false;
      }
      if (!this.creds.password) {
        this.passwordError = 'Must enter password';
        isValid = false;
      } else if (this.creds.password.length < 6) {
        this.passwordError = 'Password should be at least 6 characters';
        isValid = false;
      }
      return isValid;
    },
    goToSignin() {
      this.$emit('toggle');
    },
  },
  computed: {
    eyeImg() {
      return this.isPasswordShowen ? 'eye-slash-light' : 'eye-light';
    },
  },
  mounted() {
    try {
      this.$el.querySelector('input').focus();
    } catch (e) {}
  },
};
</script>