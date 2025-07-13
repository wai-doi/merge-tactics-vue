<template>
  <div class="selection-tabs-container">
    <div class="tabs">
      <div class="tab-item" :class="{ active: activeTab === 'includeUnits' }" @click="activeTab = 'includeUnits'">ユニット選択</div>
      <div class="tab-item" :class="{ active: activeTab === 'includeSkills' }" @click="activeTab = 'includeSkills'">スキル選択</div>
    </div>

    <div class="selection-list">
      <div v-if="activeTab === 'includeUnits'" class="tab-content-include-units">
        <div class="unit-selection-table-container">
          <table class="unit-selection-table">
            <thead>
              <tr>
                <th></th>
                <th
                  v-for="colRole in columnRoles"
                  :key="colRole"
                  :class="[colRole]"
                >
                  {{ translateRoleName(colRole) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rowRole in rowRoles" :key="rowRole">
                <th
                  :class="[rowRole]"
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

      <div v-if="activeTab === 'includeSkills'" class="tab-content-include-skills">
        <div class="skill-selection-grid">
          <div v-for="role in orderedRoles" :key="role" class="skill-role-group" :class="[role]">
            <h5 :class="[role]">{{ translateRoleName(role) }}</h5>
            <div class="skill-items">
              <div
                v-for="skill in skillsByRole[role]"
                :key="skill.name"
                class="skill-item"
                :class="{ 'selected-item': isSelected(skill.name, 'includeSkills') }"
                @click="toggleSelection(skill.name, 'includeSkills')"
              >
                {{ translateSkillName(skill.name) }}
              </div>
            </div>
          </div>
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

const orderedRoles = ROLE_ORDER; // logic.jsからインポートしたROLE_ORDERを使用

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

// ロールごとにスキルをグループ化
const skillsByRole = computed(() => {
  const grouped = {};
  orderedRoles.forEach(role => {
    grouped[role] = allSkills.value.filter(skill => skill.role === role);
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
</script>

<style scoped>


.selection-tabs-container {
  margin-top: 20px;
  margin-bottom: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  user-select: none;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #eee;
}

.tabs .tab-item {
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

.tabs .tab-item:hover {
  background-color: #e0e0e0;
}

.tabs .tab-item.active {
  background-color: #fff;
  color: #333;
  border-bottom: 2px solid #ccc;
  box-shadow: 0 -2px 0 0 #ccc inset; /* Add this line */
  font-weight: 700; /* Make it bolder */
}

.selection-list {
  padding: 15px;
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
}

.unit-selection-table th.elite {
  background-color: var(--color-elite-transparent);
}

.unit-selection-table th.tank {
  background-color: var(--color-tank-transparent);
}

.unit-selection-table th.clan {
  background-color: var(--color-clan-transparent);
}

.unit-selection-table th.shooter {
  background-color: var(--color-shooter-transparent);
}

.unit-selection-table th.goblin {
  background-color: var(--color-goblin-transparent);
}

.unit-selection-table th.assassin {
  background-color: var(--color-assassin-transparent);
}

.unit-selection-table th.undead {
  background-color: var(--color-undead-transparent);
}

.unit-selection-table th.fighter {
  background-color: var(--color-fighter-transparent);
}

.unit-selection-table th.avenger {
  background-color: var(--color-avenger-transparent);
}

.unit-selection-table th.ace {
  background-color: var(--color-ace-transparent);
}

.unit-selection-table th.thrower {
  background-color: var(--color-thrower-transparent);
}

.unit-selection-table th {
  background-color: #f9f9f9;
  font-weight: bold;
  white-space: nowrap;
  transition: background-color 0.2s ease; /* Add transition for hover effect */
}

.skill-selection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
}

.skill-role-group {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 10px;
}

.skill-role-group.elite {
  background-color: var(--color-elite-transparent);
}
.skill-role-group.tank {
  background-color: var(--color-tank-transparent);
}
.skill-role-group.clan {
  background-color: var(--color-clan-transparent);
}
.skill-role-group.shooter {
  background-color: var(--color-shooter-transparent);
}
.skill-role-group.goblin {
  background-color: var(--color-goblin-transparent);
}
.skill-role-group.assassin {
  background-color: var(--color-assassin-transparent);
}
.skill-role-group.undead {
  background-color: var(--color-undead-transparent);
}
.skill-role-group.fighter {
  background-color: var(--color-fighter-transparent);
}
.skill-role-group.avenger {
  background-color: var(--color-avenger-transparent);
}
.skill-role-group.ace {
  background-color: var(--color-ace-transparent);
}
.skill-role-group.thrower {
  background-color: var(--color-thrower-transparent);
}

.skill-role-group h5 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1em;
  text-align: center;
  padding-bottom: 5px;
}

.skill-items {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.skill-item {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f0f0f0;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.2s ease, border-color 0.2s ease;
  white-space: nowrap;
}

.skill-item:hover {
  border-color: var(--primary-color-hover);
}

.skill-item.selected-item {
  background-color: var(--primary-color) !important;
  color: white;
  border-color: var(--primary-color) !important;
}

.skill-item.selected-item:hover {
  background-color: var(--primary-color-hover) !important;
  border-color: var(--primary-color-hover) !important;
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
  vertical-align: middle;
}

.unit-cell-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-height: 50px; /* Adjust as needed */
  justify-content: center;
  align-items: center;
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
  background-color: var(--primary-color) !important;
  color: white;
  border-color: var(--primary-color) !important;
}

.unit-item.selected-item:hover {
  background-color: var(--primary-color-hover) !important;
  border-color: var(--primary-color-hover) !important;
}

</style>
