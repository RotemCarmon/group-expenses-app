<template>
  <!-- @blur="$emit('close')" -->
  <section ref="userMenu" tabindex="0" class="user-menu-container">
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
      <multi-select
        :items="currencyCodes"
        :isMulti="false"
        :topSelections="topSelections"
        :hasSearch="true"
        v-model="currency"
        class="currency-select"
      />
      <transition name="fade">
        <button
          v-if="isCurrencyChange"
          @click="updateCurrency"
          class="btn save-btn"
        >
          Save
        </button>
      </transition>
    </div>
  </section>
</template>

<script>
import { eventBus } from '@/modules/common/services/event-bus.service.js';
import multiSelect from './multi-select.vue';
export default {
  name: 'user-menu',
  data() {
    return {
      currency: this.loggedInUser && this.loggedInUser.prefs.currency,
      topSelections: ['USD', 'EUR'],
      isCurrencyChange: false,
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
    updateCurrency() {
      const newUser = {
        ...this.loggedInUser,
        prefs: { ...this.loggedInUser?.prefs, currency: this.currency },
      };
      this.$store.dispatch({ type: 'userStore/updateUser', user: newUser });
      this.isCurrencyChange = false;
      eventBus.$emit('currency-updated', this.currency);
    },
  },
  computed: {
    loggedInUser() {
      return this.$store.getters['authStore/loggedInUser'];
    },
    currencyCodes() {
      return this.$store.getters['commonStore/currencyCodes'];
    },
  },
  mounted() {
    this.$refs.userMenu.focus();
  },
  created() {
    this.currency = this.loggedInUser?.prefs?.currency;
  },
  components: {
    multiSelect,
  },
  watch: {
    currency(val) {
      if (val === this.loggedInUser?.prefs?.currency) return;
      this.isCurrencyChange = true;
    },
  },
};
</script>