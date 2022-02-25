<template>
  <section class="multi-select-container">
    <div class="box" @click="toggleMenu">
      <span class="placeholder" :class="{ multi: isMulti }">
        {{ isMulti ? placeholder : val }}
      </span>
      <img
        :src="require('@/assets/icons/angle-down.svg')"
        :class="{ open: isOpen }"
      />
    </div>
    <transition name="fade" mode="out-in">
      <div v-if="isOpen" class="drop-down-select">
        <label
          class="drop-down-item"
          v-for="item in items"
          :key="item"
          :class="{ multi: isMulti }"
        >
          <input
            type="checkbox"
            @change="toggleCheck(item)"
            :checked="val.includes(item)"
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
    isMulti: { type: Boolean, default: true },
    value: { type: Array | String },
  },
  data() {
    return {
      isOpen: false,
      val: [],
    };
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen;
    },
    toggleCheck(item) {
      if (!this.isMulti) {
        this.val = item;
      } else {
        const idx = this.val.findIndex((c) => c === item);
        if (idx === -1) {
          this.val.push(item);
        } else {
          this.val.splice(idx, 1);
        }
      }
      this.$emit('input', this.val);
    },
  },
  created() {
    if (this.value) {
      this.val = this.value;
    } else {
      this.val = this.isMulti ? [] : '';
    }
  },
};
</script>