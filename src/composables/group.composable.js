import { computed } from "vue";
import { useGroupStore } from '@/modules/group/store/group.store';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { popupService } from '@/modules/common/services/popup.service.js';

export function useIsGroupOwner(group) {
  const authStore = useAuthStore();
  const loggedInUser = authStore.loggedInUser

  const isGroupOwner = computed(() => {
    const owner = Object.values(group.value?.members).find((member) => member.isOwner);
    const ownerEmail = owner?.email;
    const userEmail = loggedInUser?.email;
    return ownerEmail === userEmail;
  });

  return isGroupOwner.value
}

export function goToEditGroup(group, router) {
  const isGroupOwner = useIsGroupOwner(group);

  if (!isGroupOwner) {
    popupService.warn('Only the group owner can edit');
    return;
  }
  router.push(`/group/edit/${group.value?.id}`);
}


export async function useRemoveGroup(group) {
  const groupStore = useGroupStore()
  const isGroupOwner = useIsGroupOwner(group);

  if (!isGroupOwner) {
    popupService.warn('Only the group owner can delete');
    return;
  }

  const _group = group.value;
  const isConfirm = await popupService.confirm({
    title: 'Delete Group',
    txt: `Are you sure you want to delete the group ${_group.name}?`,
    approveTxt: 'Yes',
    cancelTxt: 'No'
  });

  if (!isConfirm) return;

  return await groupStore.removeGroup({ groupId: _group.id });
}