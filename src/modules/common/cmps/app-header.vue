<template>
  <section class="app-header-container">
    <div class="left-container">
      <div class="back" @click="back" v-if="hasBack">
        <img :src="require('@/assets/icons/arrow-left.svg')" />
      </div>
    </div>
    <div class="avatar-container" @click="isMenuOpen = true" :class="{'letter-avatar': loggedInUser && !loggedInUser.imgUrl}">
      <img
        v-if="!loggedInUser"
        :src="require('@/assets/icons/avatar.svg')"
        class="default-avatar"
      />
      <img v-else-if="loggedInUser.imgUrl" :src="loggedInUser.imgUrl" />
      <div v-else class="avatar">{{ avatarCapital }}</div>
    </div>

    <div class="screen" :class="{open:isMenuOpen}" ></div>
    <transition name="slide-right" mode="out-in">
      <user-menu v-if="isMenuOpen" @close="isMenuOpen = false" />
    </transition>

  </section>
</template>

<script>
import userMenu from './user-menu';
export default {
  name: 'app-header',
  data() {
    return {
      isMenuOpen: false,
    };
  },
  methods: {
    back() {
      let homeRoute = '/';
      if (this.$route.name === 'expense-edit') {
        homeRoute = `/group/${this.$route.params.groupId}`;
      } else if (this.$route.path.includes('group')) {
        homeRoute = '/group';
      }

      this.$router.replace(homeRoute);
    },
  },
  computed: {
    hasBack() {
      const noBackCmps = ['group-list', 'login-signup'];
      return !noBackCmps.includes(this.$route.name);
    },
    loggedInUser() {
      const user = this.$store.getters['authStore/loggedInUser'];
      return user
    },
    avatarCapital() {
      return this.loggedInUser.username.charAt(0).toUpperCase();
    },
  },
  components: {
    userMenu,
  },
};
</script>
