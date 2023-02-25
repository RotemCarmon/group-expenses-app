<template>
  <section class="login-signup-container container">
    <div class="page-header">
      <div class="title">Sign In</div>
    </div>
    <form>
      <label class="form-row">
        <span>Email </span>
        <input type="text" v-model="creds.email" class="form-input" />
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
          autocomplete
          v-model="creds.password"
          class="form-input"
        />
        <p class="error" v-show="passwordError">{{ passwordError }}</p>
      </label>

      <button @click="doLogin" class="btn dark bottom-btn">Sign in</button>

      <div class="no-account">
        <p>Don’t have an account yet?</p>
        <span @click.prevent="goToRegister">Register</span>
      </div>
    </form>
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
      isPasswordShowen: false,
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
  computed: {
    eyeImg() {
      return this.isPasswordShowen ?  'eye-slash-light' : 'eye-light'
    }
  },
  mounted() {
    try {
      this.$el.querySelector('input').focus();
    } catch (e) {}
  },
};
</script>