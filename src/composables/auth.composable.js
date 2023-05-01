import { onMounted, ref, computed } from "vue";


export function showPassword() {
  const isPasswordShowen = ref(false);
  const eyeImg = computed(() => (isPasswordShowen.value ? 'eye-slash-light' : 'eye-light'));
  const eyeImgUrl = computed(() => new URL(`/src/assets/icons/${eyeImg.value}.svg`, import.meta.url).href);

  return { eyeImgUrl, isPasswordShowen }
}


export function focusInput() {
  const input = ref(null);
  onMounted(() => input.value.focus());

  return { input }
}
