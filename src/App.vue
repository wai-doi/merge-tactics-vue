<template>
  <div>
    <TheHeader />
    <main class="main-container">
      <div class="sidebar">
        <h2>条件設定</h2>
        <div class="team-size-setting">
          <label for="teamSize">チームユニット数:</label>
          <input type="number" id="teamSize" v-model.number="teamSize" min="1" max="10">
        </div>

        <div class="min-skill-count-setting">
          <label for="minSkillCount">最低発動スキル数:</label>
          <input type="number" id="minSkillCount" v-model.number="minSkillCount" min="1" max="10">
        </div>

        <div class="selected-items-display" v-if="includedUnits.length > 0 || excludedUnits.length > 0 || includedSkills.length > 0 || excludedSkills.length > 0">
          <div v-if="includedUnits.length > 0">
            <h4>含めるユニット:</h4>
            <div class="item-tags">
              <span v-for="unitName in includedUnits" :key="unitName" class="item-tag include">{{ unitName }}</span>
            </div>
          </div>
          <div v-if="excludedUnits.length > 0">
            <h4>含めないユニット:</h4>
            <div class="item-tags">
              <span v-for="unitName in excludedUnits" :key="unitName" class="item-tag exclude">{{ unitName }}</span>
            </div>
          </div>
          <div v-if="includedSkills.length > 0">
            <h4>含めるスキル:</h4>
            <div class="item-tags">
              <span v-for="skillName in includedSkills" :key="skillName" class="item-tag include">{{ translateSkillName(skillName) }}</span>
            </div>
          </div>
          <div v-if="excludedSkills.length > 0">
            <h4>含めないスキル:</h4>
            <div class="item-tags">
              <span v-for="skillName in excludedSkills" :key="skillName" class="item-tag exclude">{{ translateSkillName(skillName) }}</span>
            </div>
          </div>
        </div>

        <SelectionTabs
          :includedUnits="includedUnits"
          @update:includedUnits="val => includedUnits = val"
          :excludedUnits="excludedUnits"
          @update:excludedUnits="val => excludedUnits = val"
          :includedSkills="includedSkills"
          @update:includedSkills="val => includedSkills = val"
          :excludedSkills="excludedSkills"
          @update:excludedSkills="val => excludedSkills = val"
        />
      </div>
      <div class="actions-between-sections">
        <button class="generate-button" @click="generateTeamHandler">チームを生成する</button>
        <button class="reset-button" @click="resetConditions">条件をリセット</button>
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
import SelectionTabs from './components/SelectionTabs.vue';
import TeamList from './components/TeamList.vue';
import { generateTeams, UNIT_ATTRIBUTES, SKILL_CONDITIONS } from './logic.js';

const includedUnits = ref([]);
const excludedUnits = ref([]);
const includedSkills = ref([]);
const excludedSkills = ref([]);
const minSkillCount = ref(5);
const teamSize = ref(6); // デフォルトのチームユニット数を6に設定
const generatedTeams = ref([]);

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

function generateTeamHandler() {
  generatedTeams.value = generateTeams({
    includedUnits: includedUnits.value,
    excludedUnits: excludedUnits.value,
    includedSkills: includedSkills.value,
    excludedSkills: excludedSkills.value,
    minSkillCount: minSkillCount.value,
    teamSize: teamSize.value, // チームユニット数を追加
  });
}

function resetConditions() {
  includedUnits.value = [];
  excludedUnits.value = [];
  includedSkills.value = [];
  excludedSkills.value = [];
  minSkillCount.value = 5; // デフォルト値に戻す
  teamSize.value = 6; // チームユニット数をデフォルト値に戻す
  generatedTeams.value = []; // 結果もクリア
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
  flex-direction: column;
  flex: 1;
}

.sidebar {
  padding: 20px;
  /* background-color: #f4f4f4; */ /* Remove background to integrate with app background */
  /* border-bottom: 1px solid #ddd; */ /* Remove border for cleaner look */
}

.content {
  padding: 20px;
}

.actions-between-sections {
  margin: 20px;
  display: flex;
  gap: 10px;
}

.generate-button, .reset-button {
  flex: 1; /* Make buttons take equal width */
  padding: 12px 20px; /* More padding for better touch targets */
  border: none;
  border-radius: 8px; /* Slightly larger border-radius */
  cursor: pointer;
  font-size: 1.1em;
  font-weight: 600;
  transition: background-color 0.3s ease; /* Smooth transition */
  outline: none; /* Remove focus outline */
}

.generate-button {
  background-color: #4CAF50; /* A more vibrant green */
  color: white;
}

.generate-button:hover {
  background-color: #45a049;
}

.reset-button {
  background-color: #f44336; /* A clear red for reset */
  color: white;
}

.reset-button:hover {
  background-color: #da190b;
}

.min-skill-count-setting {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  background-color: #f9f9f9; /* Light background for setting */
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #eee;
}

.min-skill-count-setting label {
  margin-right: 10px;
  font-weight: 500;
}

.min-skill-count-setting input {
  width: 60px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
}

.team-size-setting {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #eee;
}

.team-size-setting label {
  margin-right: 10px;
  font-weight: 500;
}

.team-size-setting input {
  width: 60px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
}

.selected-items-display {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 5px;
}

.selected-items-display h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
  font-size: 1em;
}

.item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.item-tag {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.9em;
  font-weight: 500;
}

.item-tag.include {
  background-color: #e8f5e9; /* Light green */
  color: #2e7d32; /* Dark green */
}

.item-tag.exclude {
  background-color: #ffebee; /* Light red */
  color: #c62828; /* Dark red */
}
</style>
