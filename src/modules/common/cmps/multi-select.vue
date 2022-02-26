<template>
  <section class="multi-select-container">
    <div class="box" @click="toggleMenu">
      <input
        v-if="hasSearch"
        type="search"
        class="search-input"
        :placeholder="isMulti ? placeholder : val"
        v-model="searchTerm"
        ref="search"
      />
      <span v-else class="placeholder" :class="{ multi: isMulti }">
        {{ isMulti ? placeholder : val }}
      </span>
      <img
        :src="require('@/assets/icons/angle-down.svg')"
        :class="{ open: isOpen }"
      />
    </div>
    <transition name="fade" mode="out-in">
      <div v-if="isOpen" class="drop-down-select">
        <div class="top-selection" v-if="topSelections && !searchTerm">
          <label
            class="drop-down-item"
            v-for="item in topSelections"
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
        <label
          class="drop-down-item"
          v-for="item in itemsToShow"
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
    hasSearch: { type: Boolean, default: false },
    items: { type: Array, default: () => [] },
    placeholder: { type: String },
    isMulti: { type: Boolean, default: true },
    value: { type: Array | String },
    topSelections: { type: Array, required: false },
  },
  data() {
    return {
      isOpen: false,
      val: [],
      searchTerm: '',
    };
  },
  computed: {
    itemsToShow() {
      return this.items.filter((item) => {
        if (!this.searchTerm) return item;
        return item.includes(this.searchTerm.toUpperCase());
      });
    },
  },
  methods: {
    toggleMenu() {
      if (this.$refs.search == document.activeElement) {
        this.isOpen = true;
        return;
      }
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.searchTerm = '';
      }
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
      if (!this.isMulti) {
        this.toggleMenu();
      }
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