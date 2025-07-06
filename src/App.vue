<template>
  <div id="app">
    <TheHeader />
    <main class="main-container">
      <div class="sidebar">
        <div class="actions">
          <button class="generate-button" @click="generateTeamHandler">チームを生成する</button>
          <button class="reset-button" @click="resetConditions">条件をリセット</button>
        </div>
        <h2>条件設定</h2>
        <div class="min-skill-count-setting">
          <label for="minSkillCount">最低発動スキル数:</label>
          <input type="number" id="minSkillCount" v-model.number="minSkillCount" min="1" max="10">
        </div>
        <UnitSelector :selection="selectedUnits" @update:selection="updateUnitsSelection" />
        <SkillSelector :selection="selectedSkills" @update:selection="updateSkillsSelection" />
      </div>
      <div class="content">
        <TeamList :teams="generatedTeams" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import TheHeader from './components/TheHeader.vue';
import UnitSelector from './components/UnitSelector.vue';
import SkillSelector from './components/SkillSelector.vue';
import TeamList from './components/TeamList.vue';
import { generateTeams, UNIT_ATTRIBUTES, SKILL_CONDITIONS } from './logic.js';

const selectedUnits = reactive({});
const selectedSkills = reactive({});
const minSkillCount = ref(5);
const generatedTeams = ref([]);

function generateTeamHandler() {
  const includedUnitNames = Object.keys(selectedUnits).filter(name => selectedUnits[name] === 'include');
  const excludedUnitNames = Object.keys(selectedUnits).filter(name => selectedUnits[name] === 'exclude');
  const includedSkillNames = Object.keys(selectedSkills).filter(name => selectedSkills[name] === 'include');
  const excludedSkillNames = Object.keys(selectedSkills).filter(name => selectedSkills[name] === 'exclude');

  generatedTeams.value = generateTeams({
    includedUnits: includedUnitNames,
    excludedUnits: excludedUnitNames,
    includedSkills: includedSkillNames,
    excludedSkills: excludedSkillNames,
    minSkillCount: minSkillCount.value,
  });
}

function resetConditions() {
  // selectedUnits と selectedSkills をクリア
  for (const key in selectedUnits) {
    delete selectedUnits[key];
  }
  for (const key in selectedSkills) {
    delete selectedSkills[key];
  }
  minSkillCount.value = 5; // デフォルト値に戻す
  generatedTeams.value = []; // 結果もクリア
}

function updateUnitsSelection(newSelection) {
  // selectedUnits をクリア
  for (const key in selectedUnits) {
    delete selectedUnits[key];
  }
  // 新しい選択状態をコピー
  for (const key in newSelection) {
    selectedUnits[key] = newSelection[key];
  }
}

function updateSkillsSelection(newSelection) {
  // selectedSkills をクリア
  for (const key in selectedSkills) {
    delete selectedSkills[key];
  }
  // 新しい選択状態をコピー
  for (const key in newSelection) {
    selectedSkills[key] = newSelection[key];
  }
}
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: sans-serif;
}

.main-container {
  display: flex;
  flex: 1;
}

.sidebar {
  width: 30%;
  padding: 20px;
  background-color: #f4f4f4;
  border-right: 1px solid #ddd;
}

.content {
  width: 70%;
  padding: 20px;
}

.actions {
  margin-bottom: 20px;
}

.generate-button, .reset-button {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px; /* ボタン間のスペース */
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.generate-button {
  background-color: #42b983;
  color: white;
}

.reset-button {
  background-color: #ccc;
}

.min-skill-count-setting {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.min-skill-count-setting label {
  margin-right: 10px;
}

.min-skill-count-setting input {
  width: 60px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
