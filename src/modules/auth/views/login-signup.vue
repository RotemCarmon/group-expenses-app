<template>
  <section class="login-signup-container container">
    <login v-if="isLogin" @toggle="toggleSignPage" />
    <signup v-else @toggle="toggleSignPage" />
  </section>
</template>

<script>
import login from '../cmps/login';
import signup from '../cmps/signup';
export default {
  name: 'login-signup',
  data() {
    return {
      isLogin: true,
    };
  },
  methods: {
    toggleSignPage() {
      this.isLogin = !this.isLogin;
    },
  },
  components: {
    login,
    signup
  },
};
</script>