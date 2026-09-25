import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import SearchResultsViewer from '@/components/SearchResultsViewer.vue'
import type { SearchResultItem } from '@/types'

describe('SearchResultsViewer', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const mockResults: SearchResultItem[] = [
    {
      position: 1,
      title: 'Albert Einstein | Biography - Britannica',
      link: 'https://www.britannica.com/biography/Albert-Einstein',
      snippet: 'Famous theoretical physicist known for relativity.',
      source: 'Britannica',
      favicon: 'https://www.britannica.com/favicon.ico',
    },
    {
      position: 2,
      title: 'Einstein-Szilard letter - Britannica',
      link: 'https://www.britannica.com/topic/Einstein-Szilard-letter',
      snippet: 'Letter about atomic energy developments.',
      source: 'Britannica',
    },
  ]

  it('renders search results when results are provided', () => {
    const wrapper = mount(SearchResultsViewer, {
      props: {
        results: mockResults,
        isLoading: false,
        personName: 'Albert Einstein',
      },
    })

    expect(wrapper.text()).toContain('Albert Einstein')
    expect(wrapper.text()).toContain('2 results')
    expect(wrapper.text()).toContain('Einstein-Szilard letter')
    expect(wrapper.text()).toContain('Britannica')
  })

  it('renders loading skeleton when isLoading is true', () => {
    const wrapper = mount(SearchResultsViewer, {
      props: {
        results: [],
        isLoading: true,
      },
    })

    expect(wrapper.text()).toContain('Searching...')
    expect(wrapper.find('[aria-busy="true"]').exists()).toBe(true)
  })

  it('renders error message and retry button on error', async () => {
    const wrapper = mount(SearchResultsViewer, {
      props: {
        results: [],
        isLoading: false,
        error: 'Network connection failed',
      },
    })

    expect(wrapper.text()).toContain('Network connection failed')
    const retryButton = wrapper.find('button')
    await retryButton.trigger('click')

    expect(wrapper.emitted('retry')).toBeTruthy()
  })

  it('emits selectResult when clicking a result', async () => {
    const wrapper = mount(SearchResultsViewer, {
      props: {
        results: mockResults,
        isLoading: false,
      },
    })

    const rows = wrapper.findAll('li button')
    expect(rows).toHaveLength(2)

    await rows[1]?.trigger('click')
    expect(wrapper.emitted('selectResult')).toBeTruthy()
    expect(wrapper.emitted('selectResult')?.[0]?.[0]).toMatchObject({
      title: 'Einstein-Szilard letter - Britannica',
      link: 'https://www.britannica.com/topic/Einstein-Szilard-letter',
    })
  })
})
