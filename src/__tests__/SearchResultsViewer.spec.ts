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
      title: 'Albert Einstein - Wikipedia',
      link: 'https://en.wikipedia.org/wiki/Albert_Einstein',
      snippet: 'Famous theoretical physicist known for relativity.',
      source: 'Wikipedia',
      favicon: 'https://en.wikipedia.org/favicon.ico',
    },
    {
      position: 2,
      title: 'Einstein-Szilard letter',
      link: 'https://en.wikipedia.org/wiki/Einstein%E2%80%93Szil%C3%A1rd_letter',
      snippet: 'Letter about atomic energy developments.',
      source: 'Wikipedia',
    },
  ]

  it('renders search results table when results are provided', () => {
    const wrapper = mount(SearchResultsViewer, {
      props: {
        results: mockResults,
        isLoading: false,
        personName: 'Albert Einstein',
      },
    })

    expect(wrapper.text()).toContain('Albert Einstein')
    expect(wrapper.text()).toContain('2 Results Found')
    expect(wrapper.text()).toContain('Einstein-Szilard letter')
    expect(wrapper.text()).toContain('Wikipedia')
  })

  it('renders loading skeleton when isLoading is true', () => {
    const wrapper = mount(SearchResultsViewer, {
      props: {
        results: [],
        isLoading: true,
      },
    })

    expect(wrapper.text()).toContain('Searching DuckDuckGo...')
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

  it('emits selectResult when clicking a table row', async () => {
    const wrapper = mount(SearchResultsViewer, {
      props: {
        results: mockResults,
        isLoading: false,
      },
    })

    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(2)

    await rows[1]?.trigger('click')
    expect(wrapper.emitted('selectResult')).toBeTruthy()
    expect(wrapper.emitted('selectResult')?.[0]?.[0]).toMatchObject({
      title: 'Einstein-Szilard letter',
      link: 'https://en.wikipedia.org/wiki/Einstein%E2%80%93Szil%C3%A1rd_letter',
    })
  })
})
