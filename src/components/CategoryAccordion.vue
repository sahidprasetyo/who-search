<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import CategoryListSkeleton from '@/components/CategoryListSkeleton.vue'
import { useNavigationStore } from '@/stores/useNavigationStore'
import type {
  CategoryAccordionEmits,
  CategoryAccordionProps,
  Person,
  SubCategoryId,
} from '@/types'

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
  <nav aria-label="Personalities Categories" class="flex flex-col gap-3">
    <!-- Category Loading Skeleton -->
    <CategoryListSkeleton v-if="props.isLoading" />

    <!-- Loaded Categories List -->
    <template v-else>
      <div
        v-for="category in activeCategories"
        :key="category.id"
        class="rounded-cards border-2 border-charcoal bg-cream-paper dark:bg-surface-card shadow-lg overflow-hidden transition-all duration-200"
      >
      <!-- Category Header Button -->
      <button
        type="button"
        class="w-full min-h-[48px] flex items-center justify-between px-5 py-3 sm:py-3.5 text-left font-bold text-charcoal hover:bg-dew-drop transition-colors focus:outline-none focus:ring-2 focus:ring-charcoal cursor-pointer"
        :aria-expanded="isCategoryOpen(category.id)"
        @click="handleCategoryToggle(category.id)"
      >
        <span class="flex items-center gap-2 text-body sm:text-subheading font-black text-charcoal">
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
      <div
        v-show="isCategoryOpen(category.id)"
        class="border-t-2 border-charcoal bg-cream-paper dark:bg-surface-card px-3 pb-3 pt-3"
      >
        <!-- Sub-category Tabs (International & Indonesia) -->
        <div
          class="flex items-center gap-1.5 p-1 mb-3 rounded-tags bg-cream-paper dark:bg-surface-card border-2 border-charcoal shadow-subtle"
        >
          <button
            v-for="subCategory in category.subCategories"
            :key="subCategory.id"
            type="button"
            class="flex-1 min-h-[36px] sm:min-h-[40px] text-center text-caption py-1.5 px-3 rounded-tags transition-all font-bold cursor-pointer"
            :class="[
              currentSubCategoryId === subCategory.id
                ? 'bg-charcoal text-cream-paper shadow-subtle'
                : 'text-charcoal hover:bg-dew-drop',
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
                class="w-full min-h-[44px] flex flex-col items-start justify-center px-3 py-2 rounded-inputs border-2 text-left transition-all group cursor-pointer focus:outline-none focus:ring-2 focus:ring-charcoal"
                :class="[
                  activePerson?.id === person.id
                    ? 'border-charcoal bg-dew-drop shadow-subtle font-bold translate-x-0.5'
                    : 'border-charcoal/20 bg-cream-paper hover:border-charcoal hover:bg-dew-drop/50 text-charcoal',
                ]"
                @click="handlePersonClick(person, category.id, subCategory.id)"
              >
                <div class="flex items-center justify-between w-full">
                  <span
                    class="text-body-sm transition-colors"
                    :class="
                      activePerson?.id === person.id
                        ? 'text-charcoal font-bold'
                        : 'text-charcoal font-medium'
                    "
                  >
                    {{ person.name }}
                  </span>
                  <span
                    v-if="activePerson?.id === person.id"
                    class="w-2.5 h-2.5 rounded-sm bg-marker-orange border border-charcoal shrink-0 ml-2 shadow-[1px_1px_0px_0px_var(--color-charcoal)]"
                    aria-hidden="true"
                  />
                </div>
                <span class="text-caption text-charcoal/80 line-clamp-1 mt-0.5 font-normal">
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
