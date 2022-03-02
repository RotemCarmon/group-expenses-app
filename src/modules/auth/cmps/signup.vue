<template>
  <section class="login-signup-container container" @keyup.enter="doSignup">
    <div class="page-header">
      <div class="title">Sign Up</div>
    </div>
    <form>
      <label class="form-row">
        <span>Username </span>
        <input type="text" v-model="creds.username" autocomplete="username" class="form-input" />
        <p class="error" v-show="usernameError">{{ usernameError }}</p>
      </label>
      <label class="form-row">
        <span>Email </span>
        <input type="text" v-model="creds.email" autocomplete="email" class="form-input" />
        <p class="error" v-show="emailError">{{ emailError }}</p>
      </label>
      <label class="form-row">
        <span>Password </span>
        <input type="password" autocomplete="new-password" v-model="creds.password" class="form-input" />
        <p class="error" v-show="passwordError">{{ passwordError }}</p>
      </label>
      <label class="form-row">
        <span>Repeat Password </span>
        <input type="password" autocomplete="new-password" v-model="passwordConfirm" class="form-input" />
        <p class="error" v-show="passwordConfirmError">
          {{ passwordConfirmError }}
        </p>
      </label>

      <button @click.prevent="doSignup" class="btn dark buttom-btn">
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
      passwordConfirm: '',
      usernameError: '',
      emailError: '',
      passwordError: '',
      passwordConfirmError: '',
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
      this.passwordConfirmError = '';
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
      if (this.passwordConfirm !== this.creds.password) {
        this.passwordConfirmError = "Passwords don't match";
        isValid = false;
      }
      return isValid;
    },
    goToSignin() {
      this.$emit('toggle');
    },
  },
  mounted() {
    try {
      this.$el.querySelector('input').focus();
    } catch (e) {}
  },
};
</script>