<template>
  <div class="selector-container">
    <h3>ユニット選択</h3>
    <div v-for="unit in units" :key="unit.name" class="item">
      <span>{{ unit.name }}</span>
      <div class="options">
        <button 
          :class="{ active: selection[unit.name] === 'include' }" 
          @click="toggleSelection(unit.name, 'include')">含める</button>
        <button 
          :class="{ active: selection[unit.name] === 'exclude' }" 
          @click="toggleSelection(unit.name, 'exclude')">含めない</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { UNIT_ATTRIBUTES } from '../logic.js';

const props = defineProps({
  selection: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['update:selection']);

const units = ref(UNIT_ATTRIBUTES);

function toggleSelection(unitName, type) {
  const newSelection = { ...props.selection };
  if (newSelection[unitName] === type) {
    delete newSelection[unitName];
  } else {
    newSelection[unitName] = type;
  }
  emit('update:selection', newSelection);
}
</script>

<style scoped>
.selector-container {
  margin-top: 20px;
  margin-bottom: 20px;
}
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.options button {
  margin-left: 5px;
  padding: 3px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
}
.options button.active {
  color: white;
}
.options button:nth-child(1).active {
  background-color: #28a745; /* 緑 */
  border-color: #28a745;
}
.options button:nth-child(2).active {
  background-color: #dc3545; /* 赤 */
  border-color: #dc3545;
}
</style>
