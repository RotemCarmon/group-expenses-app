<template>
  <section class="login-signup-container container">
    <login v-if="isLogin" @toggle="toggleSignPage" />
    <signup v-else @toggle="toggleSignPage" />
  </section>
</template>

<script setup>
import { ref } from 'vue';
import login from '../cmps/login.vue';
import signup from '../cmps/signup.vue';

const isLogin = ref(true);
function toggleSignPage() {
  isLogin.value = !isLogin.value;
}
</script>
