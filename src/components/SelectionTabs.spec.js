import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SelectionTabs from './SelectionTabs.vue';

describe('SelectionTabs', () => {
  it('renders tabs and default to unit selection', () => {
    const wrapper = mount(SelectionTabs);
    expect(wrapper.find('.tab-item.active').text()).toBe('ユニット選択');
    expect(wrapper.find('.unit-selection-table').exists()).toBe(true);
  });

  it('switches to skill selection tab', async () => {
    const wrapper = mount(SelectionTabs);
    await wrapper.find('.tab-item:not(.active)').trigger('click');
    expect(wrapper.find('.tab-item.active').text()).toBe('スキル選択');
    expect(wrapper.find('.skill-selection-grid').exists()).toBe(true);
  });

  it('emits update event when a unit is clicked', async () => {
    const wrapper = mount(SelectionTabs);
    await wrapper.find('.unit-item').trigger('click');
    expect(wrapper.emitted('update:includedUnits')).toBeTruthy();
    expect(wrapper.emitted('update:includedUnits')[0][0]).toEqual(['ナイト']);
  });

  it('emits update event when a skill is clicked', async () => {
    const wrapper = mount(SelectionTabs);
    await wrapper.find('.tab-item:not(.active)').trigger('click');
    await wrapper.find('.skill-item').trigger('click');
    expect(wrapper.emitted('update:includedSkills')).toBeTruthy();
    expect(wrapper.emitted('update:includedSkills')[0][0]).toEqual(['tank1']);
  });
});
