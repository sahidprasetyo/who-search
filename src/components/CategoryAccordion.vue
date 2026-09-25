<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import CategoryListSkeleton from '@/components/CategoryListSkeleton.vue'
import { useNavigationStore } from '@/stores/useNavigationStore'
import type { CategoryAccordionEmits, CategoryAccordionProps, Person, SubCategoryId } from '@/types'

const props = withDefaults(defineProps<CategoryAccordionProps>(), {
  categories: undefined,
  selectedPerson: undefined,
  expandedCategoryIds: undefined,
  selectedCategoryId: undefined,
  selectedSubCategoryId: undefined,
  isLoading: false,
})

const emit = defineEmits<CategoryAccordionEmits>()

const store = useNavigationStore()

// Direct reactive consumption of store state via storeToRefs (SSOT)
const {
  categories: storeCategories,
  selectedPerson: storeSelectedPerson,
  expandedCategoryIds: storeExpandedCategoryIds,
  selectedSubCategoryId: storeSelectedSubCategoryId,
} = storeToRefs(store)

// Use props if provided, otherwise fall back to store values
const activeCategories = computed(() => props.categories ?? storeCategories.value)
const activePerson = computed(() =>
  props.selectedPerson !== undefined ? props.selectedPerson : storeSelectedPerson.value,
)
const currentExpandedCategoryIds = computed(
  () => props.expandedCategoryIds ?? storeExpandedCategoryIds.value,
)
const currentSubCategoryId = computed(
  () => props.selectedSubCategoryId ?? storeSelectedSubCategoryId.value,
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
  <nav aria-label="Personalities Categories" class="flex flex-col gap-5">
    <!-- Category Loading Skeleton -->
    <CategoryListSkeleton v-if="props.isLoading" />

    <!-- Loaded Categories List -->
    <template v-else>
      <div
        v-for="category in activeCategories"
        :key="category.id"
        class="rounded-cards border-2 border-charcoal bg-surface-card shadow-card overflow-hidden"
      >
        <!-- Category Header Button -->
        <button
          type="button"
          class="w-full min-h-[56px] flex items-center justify-between gap-4 px-6 py-5 text-left text-charcoal bg-lilac-block hover:brightness-95 dark:hover:brightness-125 transition-[filter] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-marker-orange cursor-pointer"
          :aria-expanded="isCategoryOpen(category.id)"
          @click="handleCategoryToggle(category.id)"
        >
          <span class="text-body sm:text-subheading font-black text-charcoal">
            {{ category.name }}
          </span>
          <svg
            class="w-5 h-5 text-charcoal transition-transform duration-200 shrink-0"
            :class="{ 'rotate-180': isCategoryOpen(category.id) }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <!-- Collapsible Body -->
        <div v-show="isCategoryOpen(category.id)" class="border-t-2 border-charcoal p-4 sm:p-6">
          <!-- Sub-category Tabs (International & Indonesia) -->
          <div class="flex items-center gap-1 p-1 mb-6 rounded-inputs bg-charcoal/5">
            <button
              v-for="subCategory in category.subCategories"
              :key="subCategory.id"
              type="button"
              class="flex-1 min-h-[40px] text-center text-caption py-1.5 px-3 rounded-sm transition-colors font-bold cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marker-orange"
              :class="[
                currentSubCategoryId === subCategory.id
                  ? 'bg-charcoal text-cream-paper'
                  : 'text-charcoal/75 hover:text-charcoal hover:bg-charcoal/5',
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
              class="flex flex-col gap-2 list-none m-0 p-0"
            >
              <li v-for="person in subCategory.people" :key="person.id">
                <button
                  type="button"
                  class="w-full min-h-[44px] flex flex-col items-start justify-center px-4 py-3 rounded-inputs text-left transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marker-orange"
                  :class="activePerson?.id === person.id ? 'bg-dew-drop' : 'hover:bg-charcoal/5'"
                  :aria-current="activePerson?.id === person.id ? 'true' : undefined"
                  @click="handlePersonClick(person, category.id, subCategory.id)"
                >
                  <span
                    class="text-body-sm text-charcoal"
                    :class="activePerson?.id === person.id ? 'font-semibold' : 'font-medium'"
                  >
                    {{ person.name }}
                  </span>
                  <span class="text-caption leading-relaxed text-charcoal/70 line-clamp-1 mt-0.5">
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
