<template>
  <section class="user-menu-container">
    <div class="menu-header">
      <button @click="$emit('close')" class="close-btn">
        <img :src="require('@/assets/icons/close.svg')" />
      </button>
    </div>
    <div class="username-greet">
      Hello
      <span>
        {{
          loggedInUser && loggedInUser.username
            ? loggedInUser.username
            : 'Guest'
        }}</span
      >
    </div>
    <ul class="menu-container">
      <li @click="navigate('group')">My Groups</li>
      <li v-if="loggedInUser" @click="signout">Signout</li>
      <li v-else @click="navigate('auth')">Signin</li>
    </ul>
    <div class="currency">
      <p>Set default currency</p>
      <multi-select :items="currencies" :isMulti="false" />
    </div>
  </section>
</template>

<script>
import multiSelect from './multi-select.vue';
export default {
  name: 'user-menu',
  data() {
    return {
      currencies: ['USD', 'EUR', 'NIS'],
    };
  },
  methods: {
    navigate(to) {
      this.$router.push(`/${to}`);
      this.$emit('close');
    },
    signout() {
      this.$emit('close');
      this.$store.dispatch({ type: 'authStore/signout' });
    },
  },
  computed: {
    loggedInUser() {
      return this.$store.getters['authStore/loggedInUser'];
    },
  },
  components: {
    multiSelect,
  },
};
</script>