<script setup lang="ts">
import { computed } from 'vue'
import CategoryListSkeleton from '@/components/CategoryListSkeleton.vue'
import { useNavigationStore } from '@/stores/useNavigationStore'
import type { Category, Person, SubCategoryId } from '@/types/personality'

interface Props {
  categories?: Category[]
  selectedPerson?: Person | null
  expandedCategoryIds?: string[]
  selectedCategoryId?: string
  selectedSubCategoryId?: SubCategoryId
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  categories: undefined,
  selectedPerson: undefined,
  expandedCategoryIds: undefined,
  selectedCategoryId: undefined,
  selectedSubCategoryId: undefined,
  isLoading: false,
})

const emit = defineEmits<{
  selectPerson: [person: Person, categoryId: string, subCategoryId: SubCategoryId]
  toggleCategory: [categoryId: string]
  selectSubCategory: [categoryId: string, subCategoryId: SubCategoryId]
}>()

const store = useNavigationStore()

// Use props if provided, otherwise fall back to store values
const activeCategories = computed(() => props.categories ?? store.categories)
const activePerson = computed(() =>
  props.selectedPerson !== undefined ? props.selectedPerson : store.selectedPerson,
)
const currentExpandedCategoryIds = computed(
  () => props.expandedCategoryIds ?? store.expandedCategoryIds,
)
const currentSubCategoryId = computed(
  () => props.selectedSubCategoryId ?? store.selectedSubCategoryId,
)

function isCategoryOpen(categoryId: string): boolean {
  return currentExpandedCategoryIds.value.includes(categoryId)
}

function handleCategoryToggle(categoryId: string): void {
  emit('toggleCategory', categoryId)
  if (props.expandedCategoryIds === undefined) {
    store.toggleCategory(categoryId)
  }
}

function handleSubCategorySelect(categoryId: string, subCategoryId: SubCategoryId): void {
  emit('selectSubCategory', categoryId, subCategoryId)
  if (props.selectedSubCategoryId === undefined) {
    store.selectSubCategory(categoryId, subCategoryId)
  }
}

function handlePersonClick(person: Person, categoryId: string, subCategoryId: SubCategoryId): void {
  emit('selectPerson', person, categoryId, subCategoryId)
  if (props.selectedPerson === undefined) {
    store.selectPerson(person, categoryId, subCategoryId)
  }
}
</script>

<template>
  <nav aria-label="Personalities Categories" class="flex flex-col gap-3">
    <!-- Category Loading Skeleton -->
    <CategoryListSkeleton v-if="props.isLoading" />

    <!-- Loaded Categories List -->
    <template v-else>
      <div
        v-for="category in activeCategories"
        :key="category.id"
        class="rounded-cards border-[1.5px] border-charcoal/20 bg-cream-paper shadow-lg overflow-hidden transition-all duration-200"
      >
      <!-- Category Header Button -->
      <button
        type="button"
        class="w-full min-h-[48px] flex items-center justify-between px-4 py-3 sm:py-3.5 text-left font-medium text-cocoa-ink hover:bg-dew-drop/50 transition-colors focus:outline-none focus:ring-2 focus:ring-charcoal/20 cursor-pointer"
        :aria-expanded="isCategoryOpen(category.id)"
        @click="handleCategoryToggle(category.id)"
      >
        <span class="flex items-center gap-2 text-body sm:text-subheading font-semibold text-cocoa-ink">
          {{ category.name }}
        </span>
        <svg
          class="w-5 h-5 text-charcoal/70 transition-transform duration-200 shrink-0"
          :class="{ 'rotate-180': isCategoryOpen(category.id) }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <!-- Collapsible Body -->
      <div
        v-show="isCategoryOpen(category.id)"
        class="border-t border-charcoal/10 bg-cream-paper/50 px-3 pb-3 pt-2"
      >
        <!-- Sub-category Tabs (International & Indonesia) -->
        <div
          class="flex items-center gap-1.5 p-1 mb-2.5 rounded-tags bg-dew-drop/80 border border-charcoal/10"
        >
          <button
            v-for="subCategory in category.subCategories"
            :key="subCategory.id"
            type="button"
            class="flex-1 min-h-[36px] sm:min-h-[40px] text-center text-caption py-1.5 px-3 rounded-tags transition-all font-medium cursor-pointer"
            :class="[
              currentSubCategoryId === subCategory.id
                ? 'bg-charcoal text-cream-paper shadow-subtle'
                : 'text-charcoal/70 hover:text-charcoal hover:bg-cream-paper/50',
            ]"
            @click="handleSubCategorySelect(category.id, subCategory.id)"
          >
            {{ subCategory.name }}
          </button>
        </div>

        <!-- People List under Active Sub-category -->
        <template v-for="subCategory in category.subCategories" :key="subCategory.id">
          <ul
            v-if="currentSubCategoryId === subCategory.id"
            class="flex flex-col gap-1.5 list-none m-0 p-0"
          >
            <li v-for="person in subCategory.people" :key="person.id">
              <button
                type="button"
                class="w-full min-h-[44px] flex flex-col items-start justify-center px-3 py-2 rounded-inputs border text-left transition-all group cursor-pointer focus:outline-none focus:ring-2 focus:ring-charcoal/20"
                :class="[
                  activePerson?.id === person.id
                    ? 'border-charcoal bg-dew-drop shadow-subtle'
                    : 'border-transparent hover:border-charcoal/15 hover:bg-dew-drop/40',
                ]"
                @click="handlePersonClick(person, category.id, subCategory.id)"
              >
                <div class="flex items-center justify-between w-full">
                  <span
                    class="text-body-sm font-medium transition-colors"
                    :class="
                      activePerson?.id === person.id
                        ? 'text-charcoal font-semibold'
                        : 'text-charcoal/90'
                    "
                  >
                    {{ person.name }}
                  </span>
                  <span
                    v-if="activePerson?.id === person.id"
                    class="w-2 h-2 rounded-full bg-marker-orange shrink-0 ml-2"
                    aria-hidden="true"
                  />
                </div>
                <span class="text-caption text-charcoal/60 line-clamp-1 mt-0.5">
                  {{ person.title }}
                </span>
              </button>
            </li>
          </ul>
        </template>
      </div>
    </div>
    </template>
  </nav>
</template>
