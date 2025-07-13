import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TeamList from './TeamList.vue';

describe('TeamList', () => {
  const mockTeams = [
    {
      units: [{ name: 'ナイト', role: ['elite', 'tank'] }, { name: 'アーチャー', role: ['clan', 'shooter'] }],
      skills: [{ name: 'elite1', role: 'elite' }, { name: 'clan1', role: 'clan' }],
    },
  ];

  const global = {
    directives: {
      tippy: {},
    },
  };

  it('renders a list of teams', () => {
    const wrapper = mount(TeamList, {
      props: { teams: mockTeams },
      global,
    });
    expect(wrapper.findAll('.team-table tbody tr').length).toBe(1);
    expect(wrapper.find('.unit-list').text()).toContain('ナイト');
  });

  it('shows a message when no teams are found', () => {
    const wrapper = mount(TeamList, {
      props: { teams: [] },
      global,
    });
    expect(wrapper.find('.no-results').exists()).toBe(true);
    expect(wrapper.text()).toContain('条件に合うチームが見つかりませんでした');
  });

  it('displays search summary', () => {
    const wrapper = mount(TeamList, {
      props: {
        teams: mockTeams,
        searchConditions: {
          includedUnits: ['ナイト'],
          includedSkills: [],
          minSkillCount: 2,
        },
      },
      global,
    });
    expect(wrapper.find('.search-summary').exists()).toBe(true);
    expect(wrapper.find('.search-summary').text()).toContain('最低スキル数: 2');
    expect(wrapper.find('.search-summary').text()).toContain('ユニット: ナイト');
  });
});
