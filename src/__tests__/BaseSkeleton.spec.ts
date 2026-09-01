import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import BaseSkeleton from '@/components/BaseSkeleton.vue'
import Skeleton from '@/components/Skeleton.vue'
import SearchResultsSkeleton from '@/components/SearchResultsSkeleton.vue'
import ArticleContentSkeleton from '@/components/ArticleContentSkeleton.vue'
import CategoryListSkeleton from '@/components/CategoryListSkeleton.vue'
import CategoryAccordion from '@/components/CategoryAccordion.vue'

describe('BaseSkeleton and Skeleton Primitives', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  it('renders default skeleton with pulse animation and accessible aria-hidden', () => {
    const wrapper = mount(BaseSkeleton)
    expect(wrapper.classes()).toContain('animate-pulse')
    expect(wrapper.classes()).toContain('rounded-inputs')
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('applies custom dimensions, custom element, and custom rounded tokens', () => {
    const wrapper = mount(BaseSkeleton, {
      props: {
        as: 'span',
        width: '120px',
        height: '24px',
        rounded: 'cards',
        class: 'custom-skeleton-class',
      },
    })

    expect(wrapper.element.tagName.toLowerCase()).toBe('span')
    expect(wrapper.classes()).toContain('rounded-cards')
    expect(wrapper.classes()).toContain('custom-skeleton-class')
    expect(wrapper.attributes('style')).toContain('width: 120px')
    expect(wrapper.attributes('style')).toContain('height: 24px')
  })

  it('renders Skeleton alias forwarding props to BaseSkeleton', () => {
    const wrapper = mount(Skeleton, {
      props: {
        rounded: 'buttons',
      },
    })

    expect(wrapper.classes()).toContain('rounded-buttons')
    expect(wrapper.classes()).toContain('animate-pulse')
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })
})

describe('SearchResultsSkeleton Component', () => {
  it('renders table layout skeleton with aria-busy and searching label', () => {
    const wrapper = mount(SearchResultsSkeleton, {
      props: {
        rows: 5,
      },
    })

    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.attributes('aria-live')).toBe('polite')
    expect(wrapper.text()).toContain('Searching Wikipedia...')
    // 5 rows in the body
    const rows = wrapper.findAll('.divide-y > div')
    expect(rows).toHaveLength(5)
  })
})

describe('ArticleContentSkeleton Component', () => {
  it('renders article preview geometry with aria-hidden', () => {
    const wrapper = mount(ArticleContentSkeleton)
    expect(wrapper.attributes('aria-hidden')).toBe('true')
    const skeletons = wrapper.findAllComponents(BaseSkeleton)
    expect(skeletons.length).toBeGreaterThan(5)
  })
})

describe('CategoryListSkeleton Component', () => {
  it('renders category accordion placeholder cards', () => {
    const wrapper = mount(CategoryListSkeleton, {
      props: {
        count: 4,
      },
    })

    expect(wrapper.attributes('aria-busy')).toBe('true')
    const cards = wrapper.findAll('.rounded-cards')
    expect(cards).toHaveLength(4)
  })

  it('renders skeleton inside CategoryAccordion when isLoading is true', () => {
    const wrapper = mount(CategoryAccordion, {
      props: {
        isLoading: true,
      },
    })

    expect(wrapper.findComponent(CategoryListSkeleton).exists()).toBe(true)
  })
})
