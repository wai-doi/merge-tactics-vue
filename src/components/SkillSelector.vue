<template>
  <div class="selector-container">
    <h3>スキル選択</h3>
    <div v-for="skill in skills" :key="skill.name" class="item">
      <span>{{ translateSkillName(skill.name) }}</span>
      <div class="options">
        <button 
          :class="{ active: selection[skill.name] === 'include' }" 
          @click="toggleSelection(skill.name, 'include')">含める</button>
        <button 
          :class="{ active: selection[skill.name] === 'exclude' }" 
          @click="toggleSelection(skill.name, 'exclude')">含めない</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { SKILL_CONDITIONS } from '../logic.js';

const props = defineProps({
  selection: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['update:selection']);

const skills = ref(SKILL_CONDITIONS);

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
</script>

<style scoped>
.selector-container {
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