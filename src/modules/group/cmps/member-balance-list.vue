<template>
  <section class="member-balance-list-container">
    <main class="list-container">
      <Suspense>
        <div class="member-list">
          <member-preview v-for="(amount, memberEmail) in balances" :member="props.group.members[memberEmail]" :amount="amount" :currency="props.currency" :key="memberEmail" @edit="editMember" />
        </div>
      </Suspense>
    </main>
    <div class="footer container">
      <button @click="addMember" class="btn dark bottom-btn">Add Member</button>
    </div>

    <transition name="slide-down" mode="out-in">
      <member-edit v-if="member" :member="member" @save="saveMember" @close="member = null" />
    </transition>
  </section>
</template>

<script setup>
import { ref } from 'vue';

import { expenseService } from '@/modules/expense/services/expense.service';
import { memberService } from '../services/member.service';
import { popupService } from '@/modules/common/services/popup.service.js';

import { useIsGroupOwner } from '@/composables/group.composable.js';

import { useGroupStore } from '../store/';
import { useAuthStore } from '@/modules/auth/store/auth.store';

import memberEdit from './member-edit.vue';
import memberPreview from './member-preview.vue';

const props = defineProps({
  group: { type: Object },
  currency: { type: String },
});
const emit = defineEmits(['save:group']);

const groupStore = useGroupStore();

const authStore = useAuthStore();

const balances = ref(null);
const member = ref(null);

// FUNCTIONS
function editMember(memberEmail) {
  // only owner and member can edit
  const isGroupOwner = useIsGroupOwner(ref(props.group));
  const loggedInUser = authStore.loggedInUser;

  if (!isGroupOwner && memberEmail !== loggedInUser.email) {
    popupService.warn("You don't have permission to edit");
    return;
  }

  member.value = getMemberByEmail(memberEmail);
}

function getMemberByEmail(email) {
  return props.group?.members[email];
}

function addMember() {
  member.value = { name: '', email: '' };
}

async function saveMember(_member) {
  const memberToSave = memberService.createMember({ username: _member.name, email: _member.email });
  const group = await memberService.addMember(memberToSave, props.group);
  await groupStore.saveGroup({ group });

  getBalances(props.currency);
  member.value = null;
}

async function getBalances(userCurrency) {
  balances.value = await expenseService.getBalances(props.group, userCurrency);
}


getBalances(props.currency);
</script>
