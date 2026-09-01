import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import SearchResultsViewer from '@/components/SearchResultsViewer.vue'
import type { WikiSearchResult } from '@/types/wikipedia'

describe('SearchResultsViewer', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const mockResults: WikiSearchResult[] = [
    {
      pageid: 101,
      title: 'Albert Einstein',
      snippet: 'Famous theoretical physicist',
      timestamp: '2026-01-01',
      wordcount: 2000,
    },
    {
      pageid: 102,
      title: 'Einstein-Szilard letter',
      snippet: 'Letter about atomic bomb',
      timestamp: '2026-01-01',
      wordcount: 1200,
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
    expect(wrapper.text()).toContain('2 Articles Found')
    expect(wrapper.text()).toContain('Einstein-Szilard letter')
  })

  it('renders loading skeleton when isLoading is true', () => {
    const wrapper = mount(SearchResultsViewer, {
      props: {
        results: [],
        isLoading: true,
      },
    })

    expect(wrapper.text()).toContain('Searching Wikipedia...')
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
      pageid: 102,
      title: 'Einstein-Szilard letter',
    })
  })
})
