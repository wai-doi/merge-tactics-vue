<template>
  <div class="selection-tabs-container">
    <div class="tabs">
      <button :class="{ active: activeTab === 'includeUnits' }" @click="activeTab = 'includeUnits'">含めるユニット</button>
      <button :class="{ active: activeTab === 'includeSkills' }" @click="activeTab = 'includeSkills'">含めるスキル</button>
    </div>

    <div class="selection-list">
      <div v-if="activeTab === 'includeUnits'" class="tab-content-include-units">
        <h4>含めるユニットを選択</h4>
        <div class="grid-items">
          <div
            v-for="unit in allUnits"
            :key="unit.name"
            :class="{ 'selected-item': isSelected(unit.name, 'includeUnits') }"
            @click="toggleSelection(unit.name, 'includeUnits')"
            class="item"
          >
            {{ unit.name }}
          </div>
        </div>
      </div>
      <div v-else-if="activeTab === 'includeSkills'" class="tab-content-include-skills">
        <h4>含めるスキルを選択</h4>
        <div class="grid-items">
          <div
            v-for="skill in allSkills"
            :key="skill.name"
            :class="{ 'selected-item': isSelected(skill.name, 'includeSkills') }"
            @click="toggleSelection(skill.name, 'includeSkills')"
            class="item"
          >
            {{ translateSkillName(skill.name) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { UNIT_ATTRIBUTES, SKILL_CONDITIONS } from '../logic.js';

const props = defineProps({
  includedUnits: { type: Array, default: () => [] },
  includedSkills: { type: Array, default: () => [] },
});

const emit = defineEmits(['update:includedUnits', 'update:includedSkills']);

const activeTab = ref('includeUnits'); // Default active tab

const allUnits = ref(UNIT_ATTRIBUTES);
const allSkills = ref(SKILL_CONDITIONS);

const roleTranslations = {
  'ace': 'エース',
  'assassin': 'アサシン',
  'avenger': 'アベンジャー',
  'fighter': 'ファイター',
  'clan': 'クラン',
  'goblin': 'ゴブリン',
  'tank': 'タンク',
  'elite': 'エリート',
  'shooter': 'シューター',
  'thrower': 'スロワー',
  'undead': 'アンデッド',
};

function translateSkillName(skillName) {
  const match = skillName.match(/^([a-z]+)(\d*)$/);
  if (match) {
    const rolePart = match[1];
    const numberPart = match[2];
    const translatedRole = roleTranslations[rolePart] || rolePart;
    return translatedRole + numberPart;
  }
  return skillName;
}

function isSelected(name, category) {
  if (category === 'includeUnits') return props.includedUnits.includes(name);
  if (category === 'includeSkills') return props.includedSkills.includes(name);
  return false;
}

function toggleSelection(name, category) {
  let currentArray;
  let updateEvent;

  if (category === 'includeUnits') {
    currentArray = [...props.includedUnits];
    updateEvent = 'update:includedUnits';
  } else if (category === 'includeSkills') {
    currentArray = [...props.includedSkills];
    updateEvent = 'update:includedSkills';
  }

  const index = currentArray.indexOf(name);
  if (index > -1) {
    currentArray.splice(index, 1); // Remove if already selected
  } else {
    currentArray.push(name); // Add if not selected
  }
  emit(updateEvent, currentArray);
}
</script>

<style scoped>
:root {
  --primary-color: #4CAF50;
  --primary-color-hover: #45a049;
  --danger-color: #f44336;
  --danger-color-hover: #da190b;
}

.selection-tabs-container {
  margin-top: 20px;
  margin-bottom: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #eee;
}

.tabs button {
  flex: 1;
  padding: 10px 15px;
  border: none;
  background-color: #f9f9f9;
  cursor: pointer;
  font-weight: bold;
  color: #555;
  transition: background-color 0.3s ease;
  outline: none;
}

.tabs button:hover {
  background-color: #e0e0e0;
}

.tabs button.active {
  background-color: #fff;
  color: #333;
  border-bottom: 2px solid #ccc;
  box-shadow: 0 -2px 0 0 #ccc inset; /* Add this line */
  font-weight: 700; /* Make it bolder */
}

.selection-list {
  padding: 15px;
}

.selection-list h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
}

.grid-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); /* Adjust column width as needed */
  gap: 10px;
}

.item {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f0f0f0;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.2s ease, border-color 0.2s ease;
  white-space: nowrap; /* 改行しないように設定 */
}

.item:hover {
  border-color: var(--primary-color-hover); /* Change border color on hover */
}

.selected-item {
  background-color: #4CAF50 !important; /* Green for included */
  color: white;
  border-color: #4CAF50 !important;
}
</style>