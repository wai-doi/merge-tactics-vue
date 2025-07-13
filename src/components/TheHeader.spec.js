import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TheHeader from './TheHeader.vue';

describe('TheHeader', () => {
  it('renders the header with the correct title', () => {
    const wrapper = mount(TheHeader);
    expect(wrapper.find('h1').text()).toBe('クラロワ マージタクティクス チームビルダー');
  });
});
