<template>
  <div>
    <h2>生成結果 ({{ teams.length }}件)</h2>
    <div v-if="searchSummary.length > 0" class="search-summary">
      <p>検索条件:</p>
      <ul>
        <li v-for="(part, index) in searchSummary" :key="index">{{ part }}</li>
      </ul>
    </div>
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
                <li v-for="unit in team.units" :key="unit.name" v-tippy="translateRoles(unit.role).join(', ')">{{ unit.name }}</li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue';

const props = defineProps({
  teams: {
    type: Array,
    default: () => [],
  },
  searchConditions: {
    type: Object,
    default: () => ({ includedUnits: [], includedSkills: [], minSkillCount: 0, teamSize: 0 }),
  },
});

const searchSummary = computed(() => {
  const parts = [];
  const { includedUnits, includedSkills, minSkillCount, teamSize } = props.searchConditions;

  if (minSkillCount > 0) {
    parts.push(`最低スキル数: ${minSkillCount}`);
  }
  if (teamSize > 0) {
    parts.push(`チームサイズ: ${teamSize}`);
  }
  if (includedSkills.length > 0) {
    parts.push(`スキル: ${includedSkills.map(translateSkillName).join(', ')}`);
  }
  if (includedUnits.length > 0) {
    parts.push(`ユニット: ${includedUnits.join(', ')}`);
  }

  if (parts.length > 0) {
    return parts;
  }
  return [];
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
  white-space: nowrap;
}

.team-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}



.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.skill-tag {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.85em;
}

/* Skill role specific colors */
.skill-tag.elite {
  background-color: var(--color-elite-transparent);
}
.skill-tag.tank {
  background-color: var(--color-tank-transparent);
}
.skill-tag.clan {
  background-color: var(--color-clan-transparent);
}
.skill-tag.shooter {
  background-color: var(--color-shooter-transparent);
}
.skill-tag.goblin {
  background-color: var(--color-goblin-transparent);
}
.skill-tag.assassin {
  background-color: var(--color-assassin-transparent);
}
.skill-tag.undead {
  background-color: var(--color-undead-transparent);
}
.skill-tag.fighter {
  background-color: var(--color-fighter-transparent);
}
.skill-tag.avenger {
  background-color: var(--color-avenger-transparent);
}
.skill-tag.ace {
  background-color: var(--color-ace-transparent);
}
.skill-tag.thrower {
  background-color: var(--color-thrower-transparent);
}

.unit-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2列表示 */
  gap: 5px; /* アイテム間の隙間 */
}

.unit-list li {
  background-color: #f0f0f0;
  padding: 3px 8px;
  border-radius: 4px;
  /* margin-bottom: 3px; */ /* gapで代替 */
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

.search-summary {
  font-size: 0.9em;
  color: #555;
  margin-top: -10px;
  margin-bottom: 15px;
  background-color: #eef;
  padding: 8px 12px;
  border-radius: 5px;
  border: 1px solid #dde;
  text-align: left;
}

.search-summary p {
  margin-top: 0;
  margin-bottom: 5px;
  font-weight: bold;
}

.search-summary ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.search-summary li {
  margin-bottom: 3px;
  padding-left: 20px; /* 間隔を広げる */
  position: relative;
}

.search-summary li::before {
  content: '●'; /* 塗りつぶされた丸 */
  position: absolute;
  left: 0;
  font-size: 0.9em; /* 少し大きく */
  top: 1px; /* 微調整 */
}
</style>
