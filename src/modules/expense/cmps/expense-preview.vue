<template>
  <div class="expense-preview-container" :class="{ selectable: isSelectable }">
    <div class="select-box-wrapper" v-if="isSelectable">
      <input type="checkbox" :checked="isSelected" @change="$emit('select', expense.id)" />
    </div>
    <div class="name">{{ expense.name }}</div>
    <div class="date">
      {{ formatDate(expense.createdAt, 'D') }}
    </div>
    <div class="description">{{ expense.description }}</div>
    <div class="amount">{{ getSymbolFromCurrency(expense.currency) }}{{ expense.amount.toFixed(2) }}</div>
    <div class="exclude" v-if="expense.exclude && expense.exclude.length">Exclude: {{ expense.exclude.join(', ') }}</div>

    <div class="ellipsis-icon" v-if="!isSelectable" @click.stop="$emit('openMenu', expense)">
      <img :src="require('@/assets/icons/ellipsis.svg')" />
    </div>
  </div>
</template>

<script setup>
import { formatDate } from '@/modules/common/services/util.service';
import getSymbolFromCurrency from 'currency-symbol-map';

const props = defineProps({
  expense: { type: Object, required: true },
  isSelectable: { type: Boolean, default: false },
  isSelected: { type: Boolean, default: false },
});
</script>
