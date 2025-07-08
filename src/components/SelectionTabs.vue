<template>
  <div class="selection-tabs-container">
    <div class="tabs">
      <button :class="{ active: activeTab === 'includeUnits' }" @click="activeTab = 'includeUnits'">含めるユニット</button>
      <button :class="{ active: activeTab === 'excludeUnits' }" @click="activeTab = 'excludeUnits'">含めないユニット</button>
      <button :class="{ active: activeTab === 'includeSkills' }" @click="activeTab = 'includeSkills'">含めるスキル</button>
      <button :class="{ active: activeTab === 'excludeSkills' }" @click="activeTab = 'excludeSkills'">含めないスキル</button>
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
      <div v-else-if="activeTab === 'excludeUnits'" class="tab-content-exclude-units">
        <h4>含めないユニットを選択</h4>
        <div class="grid-items">
          <div
            v-for="unit in allUnits"
            :key="unit.name"
            :class="{ 'selected-item': isSelected(unit.name, 'excludeUnits'), 'exclude': isSelected(unit.name, 'excludeUnits') }"
            @click="toggleSelection(unit.name, 'excludeUnits')"
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
      <div v-else-if="activeTab === 'excludeSkills'" class="tab-content-exclude-skills">
        <h4>含めないスキルを選択</h4>
        <div class="grid-items">
          <div
            v-for="skill in allSkills"
            :key="skill.name"
            :class="{ 'selected-item': isSelected(skill.name, 'excludeSkills'), 'exclude': isSelected(skill.name, 'excludeSkills') }"
            @click="toggleSelection(skill.name, 'excludeSkills')"
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
  excludedUnits: { type: Array, default: () => [] },
  includedSkills: { type: Array, default: () => [] },
  excludedSkills: { type: Array, default: () => [] },
});

const emit = defineEmits(['update:includedUnits', 'update:excludedUnits', 'update:includedSkills', 'update:excludedSkills']);

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
  if (category === 'excludeUnits') return props.excludedUnits.includes(name);
  if (category === 'includeSkills') return props.includedSkills.includes(name);
  if (category === 'excludeSkills') return props.excludedSkills.includes(name);
  return false;
}

function toggleSelection(name, category) {
  let currentArray;
  let updateEvent;
  let conflictingArray = [];
  let conflictingUpdateEvent = '';

  if (category === 'includeUnits') {
    currentArray = [...props.includedUnits];
    updateEvent = 'update:includedUnits';
    conflictingArray = [...props.excludedUnits];
    conflictingUpdateEvent = 'update:excludedUnits';
  } else if (category === 'excludeUnits') {
    currentArray = [...props.excludedUnits];
    updateEvent = 'update:excludedUnits';
    conflictingArray = [...props.includedUnits];
    conflictingUpdateEvent = 'update:includedUnits';
  } else if (category === 'includeSkills') {
    currentArray = [...props.includedSkills];
    updateEvent = 'update:includedSkills';
    conflictingArray = [...props.excludedSkills];
    conflictingUpdateEvent = 'update:excludedSkills';
  } else if (category === 'excludeSkills') {
    currentArray = [...props.excludedSkills];
    updateEvent = 'update:excludedSkills';
    conflictingArray = [...props.includedSkills];
    conflictingUpdateEvent = 'update:includedSkills';
  }

  const index = currentArray.indexOf(name);
  if (index > -1) {
    currentArray.splice(index, 1); // Remove if already selected
  } else {
    currentArray.push(name); // Add if not selected

    // Remove from conflicting category if exists
    const conflictingIndex = conflictingArray.indexOf(name);
    if (conflictingIndex > -1) {
      conflictingArray.splice(conflictingIndex, 1);
      emit(conflictingUpdateEvent, conflictingArray);
    }
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

.tab-content-exclude-units .item:hover,
.tab-content-exclude-skills .item:hover {
  border-color: var(--danger-color-hover); /* Red border on hover for excluded items */
}

.selected-item {
  background-color: #4CAF50 !important; /* Green for included */
  color: white;
  border-color: #4CAF50 !important;
}

.selected-item:hover {
  border-color: #45a049 !important; /* Darker green border on hover */
}

/* For excluded items, use a different color */
.selected-item.exclude {
  background-color: #f44336 !important; /* Red for excluded */
  border-color: #f44336 !important;
}

.selected-item.exclude:hover {
  border-color: #da190b !important; /* Darker red border on hover */
}
</style>