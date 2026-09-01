import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import ContentViewer from '@/components/ContentViewer.vue'

describe('ContentViewer', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders empty state when no article URL is provided', () => {
    const wrapper = mount(ContentViewer, {
      props: {
        articleUrl: null,
      },
    })

    expect(wrapper.text()).toContain('Select a search result from above to preview the article.')
    expect(wrapper.find('iframe').exists()).toBe(false)
  })

  it('renders iframe and title when article URL is provided', () => {
    const wrapper = mount(ContentViewer, {
      props: {
        articleTitle: 'Albert Einstein',
        articleUrl: 'https://en.wikipedia.org/wiki/Albert_Einstein',
      },
    })

    expect(wrapper.text()).toContain('Albert Einstein')
    expect(wrapper.text()).toContain('https://en.wikipedia.org/wiki/Albert_Einstein')
    expect(wrapper.text()).toContain('Open in New Tab')

    const iframe = wrapper.find('iframe')
    expect(iframe.exists()).toBe(true)
    expect(iframe.attributes('src')).toBe('https://en.wikipedia.org/wiki/Albert_Einstein')
  })
})
