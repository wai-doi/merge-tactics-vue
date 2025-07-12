<template>
  <div>
    <TheHeader />
    <main class="main-container">
      <div class="sidebar">
        <h2>条件設定</h2>
        <div class="settings-group">
          <div class="team-size-setting">
            <label for="teamSize">チームユニット数:</label>
            <input type="number" id="teamSize" v-model.number="teamSize" min="1" max="10">
          </div>
          <div class="min-skill-count-setting">
            <label for="minSkillCount">最低発動スキル数:</label>
            <input type="number" id="minSkillCount" v-model.number="minSkillCount" min="1" max="10">
          </div>
        </div>

        <SelectionTabs
          :includedUnits="includedUnits"
          @update:includedUnits="val => includedUnits = val"
          :includedSkills="includedSkills"
          @update:includedSkills="val => includedSkills = val"
        />
      </div>
      <div class="actions-between-sections">
        <button class="generate-button" @click="generateTeamHandler" :disabled="isGenerating">{{ isGenerating ? '生成中...' : 'チームを生成する' }}</button>
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
const includedSkills = ref([]);
const minSkillCount = ref(5);
const teamSize = ref(6); // デフォルトのチームユニット数を6に設定
const generatedTeams = ref([]);
const isGenerating = ref(false); // 生成中かどうかを示す状態

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

async function generateTeamHandler() {
  isGenerating.value = true; // 生成開始
  generatedTeams.value = generateTeams({
    includedUnits: includedUnits.value,
    includedSkills: includedSkills.value,
    minSkillCount: minSkillCount.value,
    teamSize: teamSize.value,
  });
  // 最小表示時間を確保するために短い遅延を追加
  await new Promise(resolve => setTimeout(resolve, 500));
  isGenerating.value = false; // 生成終了
}

function resetConditions() {
  includedUnits.value = [];
  includedSkills.value = [];
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
  background-color: var(--danger-color); /* A clear red for reset */
  color: white;
}

.reset-button:hover {
  background-color: var(--danger-color-hover);
}

.settings-group {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #eee;
}

.min-skill-count-setting, .team-size-setting {
  display: flex;
  align-items: center;
}

.min-skill-count-setting label, .team-size-setting label {
  margin-right: 10px;
  font-weight: 500;
}

.min-skill-count-setting input, .team-size-setting input {
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
