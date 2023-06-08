<template>
  <section class="app-header-container container">
    <div class="left-container">
      <div class="back" @click="back" v-if="hasBack">
        <font-awesome-icon icon="fa-regular fa-arrow-left"  />
      </div>
    </div>
    <div v-if="!isAuthPage" class="avatar-container" @click="isMenuOpen = true" :class="{ 'letter-avatar': loggedInUser && !loggedInUser.imgUrl }">
      <img v-if="!loggedInUser" src="@/assets/imgs/user-avatar.png" class="default-avatar" alt="user avatar image" />
      <img v-else-if="loggedInUser.imgUrl" :src="loggedInUser.imgUrl" alt="user custom image" />
      <div v-else class="avatar">{{ avatarCapital }}</div>
    </div>

    <div class="screen" :class="{ open: isMenuOpen }" @click="isMenuOpen = false"></div>
    <transition name="slide-right">
      <user-menu v-if="isMenuOpen" @close="isMenuOpen = false" />
    </transition>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import userMenu from './user-menu.vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/modules/auth/store/auth.store';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const isMenuOpen = ref(false);

// COMPUTED
const hasBack = computed(() => {
  const noBackCmps = ['group-list', 'login-signup'];
  return !noBackCmps.includes(route.name);
});

const isAuthPage = computed(() => {
  return route.name === 'login-signup';
});

const loggedInUser = computed(() => authStore.loggedInUser);

const avatarCapital = computed(() => loggedInUser.value.username.charAt(0).toUpperCase());

// FUNCTIONS
function back() {
  let homeRoute = '/';
  if (route.path.includes('expense')) {
    homeRoute = `/group/${route.params.groupId}`;
  } else if (route.path.includes('group')) {
    homeRoute = '/group';
  }

  router.replace({ path: homeRoute });
}
</script>
