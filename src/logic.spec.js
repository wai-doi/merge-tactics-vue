import { describe, it, expect } from 'vitest';
import { generateTeams } from './logic.js';

describe('generateTeams', () => {
  it('should generate teams with default options', () => {
    const teams = generateTeams({});
    expect(teams.length).toBeGreaterThan(0);
    expect(teams[0].units.length).toBe(6);
  });

  it('should include specified units', () => {
    const teams = generateTeams({ includedUnits: ['ナイト', 'アーチャー'] });
    teams.forEach(team => {
      expect(team.units.some(u => u.name === 'ナイト')).toBe(true);
      expect(team.units.some(u => u.name === 'アーチャー')).toBe(true);
    });
  });

  it('should filter by included skills', () => {
    const teams = generateTeams({ includedSkills: ['ace1'] });
    teams.forEach(team => {
      expect(team.skills.some(s => s.name === 'ace1')).toBe(true);
    });
  });

  it('should filter by minimum skill count', () => {
    const teams = generateTeams({ minSkillCount: 7 });
    teams.forEach(team => {
      expect(team.skills.length).toBeGreaterThanOrEqual(7);
    });
  });

  it('should handle impossible constraints', () => {
    const teams = generateTeams({ includedUnits: Array(7).fill('').map((_, i) => `Unit ${i}`) });
    expect(teams.length).toBe(0);
  });
});
