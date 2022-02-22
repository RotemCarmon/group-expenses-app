<template>
  <section class="login-signup-container container" @keyup.enter="doLogin">
    <div class="page-header">
      <div class="title">Sign In</div>
    </div>

    <label class="form-row">
      <span>Email </span>
      <input type="text" v-model="creds.email" class="form-input" />
      <p class="error" v-show="emailError">{{ emailError }}</p>
    </label>
    <label class="form-row">
      <span>Password </span>
      <input type="password" v-model="creds.password" class="form-input" />
      <p class="error" v-show="passwordError">{{ passwordError }}</p>
    </label>

    <button @click="doLogin" class="btn dark buttom-btn">Sign in</button>

    <div class="no-account">
      <p>Don’t have an account yet?</p>
      <span @click="goToRegister">Register</span>
    </div>
  </section>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      creds: {
        email: '',
        password: '',
      },
      emailError: '',
      passwordError: '',
    };
  },
  methods: {
    doLogin() {
      const isValid = this.validateInputs();
      if (!isValid) return;
      this.$store.dispatch({ type: 'authStore/login', userCreds: this.creds });
    },
    validateInputs() {
      this.emailError = '';
      this.passwordError = '';
      let isValid = true;
      if (!this.creds.email) {
        this.emailError = 'Must enter email';
        isValid = false;
      }
      if (!this.creds.password) {
        this.passwordError = 'Must enter password';
        isValid = false;
      }
      return isValid;
    },
    goToRegister() {
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