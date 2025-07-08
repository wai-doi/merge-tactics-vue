export const UNIT_ATTRIBUTES = [
  { name: 'ナイト', role: ['elite', 'tank'] },
  { name: 'アーチャー', role: ['clan', 'shooter'] },
  { name: 'ゴブリン', role: ['goblin', 'assassin'] },
  { name: '槍ゴブリン', role: ['goblin', 'thrower'] },
  { name: 'ボンバー', role: ['undead', 'thrower'] },
  { name: 'バーバーリアン', role: ['clan', 'fighter'] },
  { name: 'バルキリー', role: ['clan', 'avenger'] },
  { name: 'ペッカ', role: ['ace', 'tank'] },
  { name: 'プリンス', role: ['elite', 'fighter'] },
  { name: '巨大スケルトン', role: ['undead', 'fighter'] },
  { name: '吹矢ゴブリン', role: ['goblin', 'shooter'] },
  { name: '執行人ファルチェ', role: ['ace', 'thrower'] },
  { name: 'プリンセス', role: ['elite', 'shooter'] },
  { name: 'メガナイト', role: ['ace', 'fighter'] },
  { name: 'ロイヤルゴースト', role: ['undead', 'assassin'] },
  { name: 'アサシンユーノ', role: ['ace', 'avenger'] },
  { name: 'ゴブリンマシン', role: ['goblin', 'tank'] },
  { name: 'スケルトンキング', role: ['undead', 'tank'] },
  { name: 'ゴールドナイト', role: ['elite', 'assassin'] },
  { name: 'アーチャークイーン', role: ['clan', 'avenger'] },
];

export const SKILL_CONDITIONS = [
  { name: 'ace1', role: 'ace', count: 2 },
  { name: 'ace2', role: 'ace', count: 4 },
  { name: 'assassin', role: 'assassin', count: 3 },
  { name: 'avenger', role: 'avenger', count: 3 },
  { name: 'fighter1', role: 'fighter', count: 2 },
  { name: 'fighter2', role: 'fighter', count: 4 },
  { name: 'clan1', role: 'clan', count: 2 },
  { name: 'clan2', role: 'clan', count: 4 },
  { name: 'goblin1', role: 'goblin', count: 2 },
  { name: 'goblin2', role: 'goblin', count: 4 },
  { name: 'tank1', role: 'tank', count: 2 },
  { name: 'tank2', role: 'tank', count: 4 },
  { name: 'elite1', role: 'elite', count: 2 },
  { name: 'elite2', role: 'elite', count: 4 },
  { name: 'shooter', role: 'shooter', count: 3 },
  { name: 'thrower', role: 'thrower', count: 3 },
  { name: 'undead1', role: 'undead', count: 2 },
  { name: 'undead2', role: 'undead', count: 4 },
];

// 組み合わせを生成するジェネレータ関数
function* combinations(array, k) {
  const n = array.length;
  if (k < 0 || k > n) return;

  const indices = Array.from({ length: k }, (_, i) => i);

  while (true) {
    yield indices.map(i => array[i]);

    let i = k - 1;
    while (i >= 0 && indices[i] === i + n - k) {
      i--;
    }

    if (i < 0) break;

    indices[i]++;
    for (let j = i + 1; j < k; j++) {
      indices[j] = indices[j - 1] + 1;
    }
  }
}

export function generateTeams(options) {
  const {
    includedUnits = [],
    excludedUnits = [],
    includedSkills = [],
    excludedSkills = [],
    minSkillCount = 5,
    teamSize = 6, // デフォルト値を6に設定
  } = options;

  // 実際に含めるユニットオブジェクト
  const actualIncludedUnits = includedUnits.map(name => UNIT_ATTRIBUTES.find(u => u.name === name));

  // 組み合わせ生成の対象となるユニットプール
  const combinableUnits = UNIT_ATTRIBUTES.filter(unit =>
    !excludedUnits.includes(unit.name) && // 除外ユニットではない
    !includedUnits.includes(unit.name)    // 既に含める指定されたユニットではない
  );

  // 残りのユニットから選ぶ数
  const unitsToPick = teamSize - actualIncludedUnits.length;

  // 選択するユニット数が負になる、または選択可能なユニット数を超える場合は、有効な組み合わせがない
  if (unitsToPick < 0 || unitsToPick > combinableUnits.length) {
    return [];
  }

  let teams = [];

  // 残りのユニットから組み合わせを生成
  for (const unitCombination of combinations(combinableUnits, unitsToPick)) {
    // 明示的に含めるユニットと生成された組み合わせを結合
    const currentUnits = [...actualIncludedUnits, ...unitCombination];

    // チームサイズが正しいことを確認（念のため）
    if (currentUnits.length !== teamSize) {
        continue;
    }

    const roles = currentUnits.flatMap(u => u.role);
    const skills = SKILL_CONDITIONS.filter(cond => roles.filter(r => r === cond.role).length >= cond.count);

    // フィルタリング条件
    if (skills.length < minSkillCount) continue;
    if (includedSkills.some(skillName => !skills.find(s => s.name === skillName))) continue;
    if (excludedSkills.some(skillName => skills.find(s => s.name === skillName))) continue;

    teams.push({
      units: currentUnits,
      skills,
      roles: roles.reduce((acc, role) => ({ ...acc, [role]: (acc[role] || 0) + 1 }), {}),
    });
  }

  // スキル数でソート
  teams.sort((a, b) => b.skills.length - a.skills.length);

  return teams.slice(0, 50);
}
