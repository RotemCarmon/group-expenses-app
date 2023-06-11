<template>
  <section class="multi-select-container" tabindex="0" @blur="handleBlur" ref="container">
    <div class="box" @click="toggleMenu" ref="elBox">
      <input v-if="hasSearch" type="search" class="search-input" :placeholder="isMulti ? placeholder : val" v-model="searchTerm" ref="search" tabindex="1" @blur="handleBlur" />
      <span v-else class="placeholder" :class="{ multi: isMulti }">
        {{ isMulti ? (isShowSelectedOpts ? val.join(', ') : placeholder) : val }}
      </span>
      <img src="@/assets/icons/angle-down.svg" :class="{ open: isOpen }" alt="arrow down - expand menu" />
    </div>
    <transition name="fade" mode="out-in">
      <div v-if="isOpen" class="drop-down-select" :style="{ transform: `translateY(${dropYPos}px)` }">
        <div class="top-selection" v-if="topSelections && !searchTerm">
          <label class="drop-down-item" v-for="item in topSelections" :key="item" :class="{ multi: isMulti }">
            <input type="checkbox" @change="toggleCheck(item)" :checked="val.includes(item)" />
            {{ item }}
          </label>
        </div>

        <label class="drop-down-item" v-for="item in itemsToShow" :key="item" :class="{ multi: isMulti }">
          <input type="checkbox" @change="toggleCheck(item)" :checked="val.includes(item)" />
          {{ item }}
        </label>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  items: { type: Array, default: () => [] },
  modelValue: [String, Array],
  hasSearch: { type: Boolean, default: false },
  placeholder: { type: String },
  isMulti: { type: Boolean, default: true },
  topSelections: { type: Array, required: false },
  isShowSelectedOpts: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const val = ref([]);
const searchTerm = ref('');
const search = ref(null);
const elBox = ref(null);
const container = ref(null);

const dropYPos = ref('');

const itemsToShow = computed(() =>
  props.items.filter((item) => {
    if (!searchTerm.value) return item;
    return item.includes(searchTerm.value.toUpperCase());
  })
);

// FUNCTIONS
function toggleMenu(e) {
  // the search-box is the focused element
  if (search.value == document.activeElement) {
    openDropdown(e);
    return;
  }

  if (!isOpen.value) {
    openDropdown(e);
  } else {
    isOpen.value = false;
    // clean search term when closing dropdown
    searchTerm.value = '';
  }
}

function openDropdown(e) {
  setDropdownPosition(e);
  isOpen.value = true;
}

function setDropdownPosition(e) {
  const screenHeight = e.view.innerHeight;

  const dropdownHeight = 180;
  const dropdownGap = 6;
  const bottomPad = 12;
  const totalDropdown = dropdownHeight + dropdownGap + bottomPad;

  const { bottom, height } = elBox.value?.getBoundingClientRect();
  const availableSpace = screenHeight - bottom;

  dropYPos.value = availableSpace < totalDropdown ? -(dropdownHeight + height + dropdownGap) : dropdownGap;
}

function handleBlur(e) {
  // Set parent as container
  const parent = container.value;

  if (!parent.contains(e.relatedTarget)) {
    isOpen.value = false;
  }
}

function toggleCheck(item) {
  if (!props.isMulti) {
    val.value = item;
    searchTerm.value = item;
  } else {
    const idx = val.value.findIndex((c) => c === item);
    if (idx === -1) {
      val.value.push(item);
    } else {
      val.value.splice(idx, 1);
    }
  }
  emit('update:modelValue', val.value);

  if (!props.isMulti) {
    toggleMenu();
  }
}

(function created() {
  if (props.modelValue) {
    val.value = props.modelValue;
  } else {
    val.value = props.isMulti ? [] : '';
  }
})();
</script>
