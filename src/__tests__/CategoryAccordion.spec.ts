import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import CategoryAccordion from '@/components/CategoryAccordion.vue'
import type { Category } from '@/types/personality'

describe('CategoryAccordion', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const mockCategories: Category[] = [
    {
      id: 'scientists',
      name: 'Scientists',
      subCategories: [
        {
          id: 'international',
          name: 'International',
          people: [
            {
              id: 'einstein',
              name: 'Albert Einstein',
              title: 'Physicist',
              searchQuery: 'Albert Einstein',
            },
          ],
        },
        {
          id: 'indonesia',
          name: 'Indonesia',
          people: [
            {
              id: 'habibie',
              name: 'B. J. Habibie',
              title: 'Engineer',
              searchQuery: 'B. J. Habibie',
            },
          ],
        },
      ],
    },
  ]

  it('renders category headers and subcategories', () => {
    const wrapper = mount(CategoryAccordion, {
      props: {
        categories: mockCategories,
        expandedCategoryIds: ['scientists'],
        selectedSubCategoryId: 'international',
      },
    })

    expect(wrapper.text()).toContain('Scientists')
    expect(wrapper.text()).toContain('International')
    expect(wrapper.text()).toContain('Indonesia')
    expect(wrapper.text()).toContain('Albert Einstein')
  })

  it('emits toggleCategory when clicking category header button', async () => {
    const wrapper = mount(CategoryAccordion, {
      props: {
        categories: mockCategories,
        expandedCategoryIds: [],
      },
    })

    const headerButton = wrapper.find('button')
    await headerButton.trigger('click')

    expect(wrapper.emitted('toggleCategory')).toBeTruthy()
    expect(wrapper.emitted('toggleCategory')?.[0]).toEqual(['scientists'])
  })

  it('emits selectPerson when clicking a person item', async () => {
    const wrapper = mount(CategoryAccordion, {
      props: {
        categories: mockCategories,
        expandedCategoryIds: ['scientists'],
        selectedSubCategoryId: 'international',
      },
    })

    const personButton = wrapper.findAll('button').find((b) => b.text().includes('Albert Einstein'))
    expect(personButton).toBeDefined()
    await personButton?.trigger('click')

    expect(wrapper.emitted('selectPerson')).toBeTruthy()
    expect(wrapper.emitted('selectPerson')?.[0]?.[0]).toMatchObject({
      id: 'einstein',
      name: 'Albert Einstein',
    })
  })
})
