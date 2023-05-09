<template>
  <!-- @blur="$emit('close')" -->
  <section ref="userMenu" tabindex="0" class="user-menu-container">
    <div class="menu-header">
      <button @click="$emit('close')" class="close-btn">
        <img src="@/assets/icons/close.svg" alt="close button" />
      </button>
    </div>
    <div class="username-greet">
      Hello
      <span> {{ loggedInUser && loggedInUser.username ? loggedInUser.username : 'Guest' }}</span>
    </div>
    <ul class="menu-container">
      <li @click="navigate('group')">
        <font-awesome-icon icon="fa-thin fa-users" class="menu-icon" />
        <span>My Groups</span>
      </li>
      <li v-if="loggedInUser" @click="signout">
        <font-awesome-icon icon="fa-thin fa-right-from-bracket" class="menu-icon" />
        <span>Signout</span>
      </li>
      <li v-else @click="navigate('auth')">
        <font-awesome-icon icon="fa-thin fa-right-to-bracket" class="menu-icon" />
        <span>Signin</span>
      </li>
    </ul>
    <div class="currency">
      <p>Set default currency</p>
      <multi-select :items="currencyCodes" :isMulti="false" :topSelections="topSelections" :hasSearch="true" v-model="currency" class="currency-select" />
      <transition name="fade">
        <button v-if="isCurrencyChange" @click="updateCurrency" class="btn save-btn">Save</button>
      </transition>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import multiSelect from './multi-select.vue';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { useUserStore } from '@/modules/auth/store/user.store';
import { useCommonStore } from '@/modules/common/store/common.store';
import { useRouter } from 'vue-router';

const emit = defineEmits(['close']);

const authStore = useAuthStore();
const userStore = useUserStore();
const commonStore = useCommonStore();

const router = useRouter();

// COMPUTED
const loggedInUser = computed(() => authStore.loggedInUser);
const currencyCodes = computed(() => commonStore.currencyCodes);

// VARS
const topSelections = ['USD', 'EUR'];

const isCurrencyChange = ref(false);
const userMenu = ref(null);
const currency = ref(loggedInUser.value?.prefs?.currency);

// FUNCTIONS
function navigate(to) {
  router.push(`/${to}`);
  emit('close');
}

function signout() {
  emit('close');
  authStore.signout();
}

function updateCurrency() {
  const newUser = {
    ...loggedInUser.value,
    prefs: { ...loggedInUser.value?.prefs, currency: currency.value },
  };
  userStore.updateUser({ user: newUser });
  isCurrencyChange.value = false;
}

onMounted(() => {
  userMenu.value.focus();
});

watch(currency, (newValue, oldValue) => {
  if (oldValue !== newValue) isCurrencyChange.value = true;
});
</script>
