import { describe, it, expect } from 'vitest'
import { createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('mounts and renders application title properly', () => {
    const pinia = createPinia()
    const wrapper = mount(App, {
      global: {
        plugins: [pinia],
      },
    })
    expect(wrapper.text()).toContain('Famous Personalities Explorer')
  })
})
