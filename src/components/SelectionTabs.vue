<template>
  <div class="selection-tabs-container">
    <div class="selection-list">
      <div class="tab-content-include-units">
        <h4>含めるユニットを選択</h4>
        <div class="unit-selection-table-container">
          <table class="unit-selection-table">
            <thead>
              <tr>
                <th></th>
                <th
                  v-for="colRole in columnRoles"
                  :key="colRole"
                  @click="toggleSkillSelectionByRole(colRole)"
                  :class="{ 'selected-header': isRoleHeaderSelected(colRole) }"
                >
                  {{ translateRoleName(colRole) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rowRole in rowRoles" :key="rowRole">
                <th
                  @click="toggleSkillSelectionByRole(rowRole)"
                  :class="{ 'selected-header': isRoleHeaderSelected(rowRole) }"
                >
                  {{ translateRoleName(rowRole) }}
                </th>
                <td v-for="colRole in columnRoles" :key="colRole">
                  <div class="unit-cell-content">
                    <div
                    v-for="unit in unitsByRoleIntersection[rowRole][colRole]"
                    :key="unit.name"
                    class="unit-item"
                    :class="{ 'selected-item': isSelected(unit.name, 'includeUnits') }"
                    @click="toggleSelection(unit.name, 'includeUnits')"
                  >
                    {{ unit.name }}
                  </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { UNIT_ATTRIBUTES, SKILL_CONDITIONS, ROLE_ORDER } from '../logic.js';

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

const columnRoles = ['tank', 'fighter', 'assassin', 'shooter', 'thrower', 'avenger'];
const rowRoles = ['elite', 'clan', 'ace', 'undead', 'goblin'];

// ロールごとにユニットをグループ化
const unitsByRoleIntersection = computed(() => {
  const grouped = {};
  rowRoles.forEach(rowRole => {
    grouped[rowRole] = {};
    columnRoles.forEach(colRole => {
      grouped[rowRole][colRole] = allUnits.value.filter(unit =>
        unit.role.includes(rowRole) && unit.role.includes(colRole)
      );
    });
  });
  return grouped;
});

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

function translateRoleName(roleName) {
  return roleTranslations[roleName] || roleName;
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

function toggleSkillSelectionByRole(roleName) {
  const skillsForRole = allSkills.value.filter(skill => skill.role === roleName);
  const currentIncludedSkills = [...props.includedSkills];

  const allSkillsInRoleSelected = skillsForRole.every(skill =>
    currentIncludedSkills.includes(skill.name)
  );

  if (allSkillsInRoleSelected) {
    // すべて選択されている場合は解除
    skillsForRole.forEach(skill => {
      const index = currentIncludedSkills.indexOf(skill.name);
      if (index > -1) {
        currentIncludedSkills.splice(index, 1);
      }
    });
  } else {
    // 一部または全く選択されていない場合はすべて選択
    skillsForRole.forEach(skill => {
      if (!currentIncludedSkills.includes(skill.name)) {
        currentIncludedSkills.push(skill.name);
      }
    });
  }
  emit('update:includedSkills', currentIncludedSkills);
}

const isRoleHeaderSelected = computed(() => (roleName) => {
  const skillsForRole = allSkills.value.filter(skill => skill.role === roleName);
  if (skillsForRole.length === 0) return false; // そのロールにスキルがない場合は選択状態ではない
  return skillsForRole.every(skill => props.includedSkills.includes(skill.name));
});
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

.unit-selection-table-container {
  overflow-x: auto;
  border: 1px solid #eee;
  border-radius: 8px;
}

.unit-selection-table {
  width: 100%;
  border-collapse: collapse;
}

.unit-selection-table th,
.unit-selection-table td {
  border: 1px solid #eee;
  padding: 8px;
  text-align: center;
  vertical-align: top;
}

.unit-selection-table th {
  background-color: #f9f9f9;
  font-weight: bold;
  white-space: nowrap;
  cursor: pointer; /* Add cursor pointer for clickable headers */
  transition: background-color 0.2s ease; /* Add transition for hover effect */
}

.unit-selection-table th:hover {
  background-color: #e0e0e0; /* Lighter background on hover */
}

.unit-selection-table th.selected-header {
  background-color: #4CAF50; /* Green background for selected headers */
  color: white;
}

.unit-selection-table thead th {
  position: sticky;
  top: 0;
  background-color: #f9f9f9;
  z-index: 1;
}

.unit-selection-table tbody th {
  position: sticky;
  left: 0;
  background-color: #f9f9f9;
  z-index: 1;
}

.unit-cell-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-height: 50px; /* Adjust as needed */
}

.unit-item {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f0f0f0;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.2s ease, border-color 0.2s ease;
  white-space: nowrap;
}

.unit-item:hover {
  border-color: var(--primary-color-hover);
}

.unit-item.selected-item {
  background-color: #4CAF50 !important;
  color: white;
  border-color: #4CAF50 !important;
}

.unit-item.selected-item:hover {
  background-color: #45a049 !important;
  border-color: #45a049 !important;
}

</style>