import { onMounted, ref } from "vue";

export function focusInput() {
  const input = ref(null);
  onMounted(() => input.value.focus());

  return { input }
}