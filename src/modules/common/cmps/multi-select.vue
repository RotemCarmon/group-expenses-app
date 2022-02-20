<template>
  <section class="multi-select-container">
    <div class="box" @click="toggleMenu">
      <span class="placeholder">
        {{ placeholder }}
      </span>
      <img
        :src="require('@/assets/icons/angle-down.svg')"
        :class="{ open: isOpen }"
      />
    </div>
    <transition name="fade" mode="out-in">
      <div v-if="isOpen" class="drop-down-select">
        <label class="drop-down-item" v-for="item in items" :key="item">
          <input
            type="checkbox"
            @change="toggleCheck(item)"
            :checked="checked.includes(item)"
          />
          {{ item }}
        </label>
      </div>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'multi-select',
  props: {
    items: { type: Array },
    placeholder: { type: String },
  },
  data() {
    return {
      isOpen: false,
      checked: [],
    };
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen;
    },
    toggleCheck(item) {
      const idx = this.checked.findIndex((c) => c === item);
      if (idx === -1) {
        this.checked.push(item);
      } else {
        this.checked.splice(idx, 1);
      }
      this.$emit('change', this.checked);
    },
  },
};
</script>