<template>
  <div class="group-page">
    <router-view />
  </div>
</template>

<script setup>
import { useGroupStore } from '../store/';
import { useAuthStore } from '@/modules/auth/store/auth.store';

const groupStore = useGroupStore();
const authStore = useAuthStore();

groupStore.loadGroups({ filterBy: { array: ['memberEmails', authStore.loggedInUser.email] } });
</script>
