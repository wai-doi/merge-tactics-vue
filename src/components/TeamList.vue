<template>
  <div>
    <h2>生成結果 ({{ teams.length }}件)</h2>
    <div v-if="teams.length === 0" class="no-results">
      <p>条件に合うチームが見つかりませんでした。条件を変更して再度お試しください。</p>
    </div>
    <div v-else class="team-table-container">
      <table class="team-table">
        <thead>
          <tr>
            <th>スキル数</th>
            <th>スキル</th>
            <th>ユニット</th>
            <th>ロール</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(team, index) in teams" :key="index">
            <td>{{ team.skills.length }}</td>
            <td>
              <div class="skills">
                <span 
                  v-for="skill in team.skills" 
                  :key="skill.name" 
                  class="skill-tag"
                  :class="skill.role"
                >{{ translateSkillName(skill.name) }}</span>
              </div>
            </td>
            <td>
              <ul class="unit-list">
                <li v-for="unit in team.units" :key="unit.name">{{ unit.name }} ({{ translateRoles(unit.role).join(', ') }})</li>
              </ul>
            </td>
            <td>
              <div class="role-counts">
                <template v-for="roleName in orderedRoles" :key="roleName">
                  <span 
                    v-if="team.roles[roleName]"
                    class="role-item"
                  >{{ translateRole(roleName) }}: {{ team.roles[roleName] }}</span>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue';

const props = defineProps({
  teams: {
    type: Array,
    default: () => [],
  },
});

const orderedRoles = ref([
  'tank', 'fighter', 'assassin', 'shooter', 'thrower', 'avenger',
  'elite', 'clan', 'goblin', 'ace', 'undead'
]);

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

function translateRole(roleName) {
  return roleTranslations[roleName] || roleName;
}

function translateRoles(roles) {
  return roles.map(role => translateRole(role));
}

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
.no-results {
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px dashed #ccc;
  border-radius: 5px;
  text-align: center;
}

.team-table-container {
  overflow-x: auto;
}

.team-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.team-table th,
.team-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  vertical-align: top;
}

.team-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.team-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.team-table tbody tr:hover {
  background-color: #f1f1f1;
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.skill-tag {
  display: inline-block;
  background-color: #e0f7fa; /* Default Light blue */
  color: #00796b; /* Default Dark teal */
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.85em;
}

/* Skill role specific colors */
.skill-tag.ace {
  background-color: #FFD700; /* Gold */
  color: #333;
}
.skill-tag.assassin {
  background-color: #FF6347; /* Tomato */
  color: white;
}
.skill-tag.avenger {
  background-color: #BA55D3; /* MediumOrchid */
  color: white;
}
.skill-tag.fighter {
  background-color: #8B4513; /* SaddleBrown */
  color: white;
}
.skill-tag.clan {
  background-color: #4682B4; /* SteelBlue */
  color: white;
}
.skill-tag.goblin {
  background-color: #32CD32; /* LimeGreen */
  color: #333;
}
.skill-tag.tank {
  background-color: #6A5ACD; /* SlateBlue */
  color: white;
}
.skill-tag.elite {
  background-color: #FF4500; /* OrangeRed */
  color: white;
}
.skill-tag.shooter {
  background-color: #20B2AA; /* LightSeaGreen */
  color: white;
}
.skill-tag.thrower {
  background-color: #DAA520; /* Goldenrod */
  color: #333;
}
.skill-tag.undead {
  background-color: #708090; /* SlateGray */
  color: white;
}

.unit-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.unit-list li {
  background-color: #f0f0f0;
  padding: 3px 8px;
  border-radius: 4px;
  margin-bottom: 3px;
  font-size: 0.9em;
}

.role-counts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.role-item {
  background-color: #e8f5e9; /* Light green */
  color: #2e7d32; /* Dark green */
  padding: 3px 7px;
  border-radius: 4px;
  font-size: 0.8em;
}
</style>