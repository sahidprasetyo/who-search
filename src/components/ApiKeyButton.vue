<script setup lang="ts">
import { ref } from 'vue'
import { getSearchApiKey, setSearchApiKey } from '@/services/searchApi'
import { useSearchStore } from '@/stores/useSearchStore'

const searchStore = useSearchStore()
const dialog = ref<HTMLDialogElement | null>(null)
const keyInput = ref('')
const hasKey = ref(Boolean(getSearchApiKey()))

function openDialog(): void {
  keyInput.value = ''
  dialog.value?.showModal()
}

function saveKey(key: string): void {
  setSearchApiKey(key)
  hasKey.value = Boolean(getSearchApiKey())
  keyInput.value = ''
  dialog.value?.close()
  // Re-run the current search so results switch between live and fallback immediately
  if (searchStore.currentSearchQuery) {
    void searchStore.fetchResultsForPerson(searchStore.currentSearchQuery)
  }
}
</script>

<template>
  <button
    type="button"
    class="min-h-[40px] sm:min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3 rounded-buttons border-2 border-charcoal bg-cream-paper hover:bg-dew-drop text-caption font-bold text-charcoal shadow-subtle hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-charcoal"
    :aria-label="hasKey ? 'SearchApi.io key saved, change key' : 'Add your SearchApi.io key'"
    @click="openDialog"
  >
    <span
      class="w-2 h-2 rounded-full border border-charcoal"
      :class="hasKey ? 'bg-sprout-sticker' : 'bg-transparent'"
      aria-hidden="true"
    />
    <span>API key</span>
  </button>

  <dialog
    ref="dialog"
    class="m-auto w-[calc(100%-2rem)] max-w-md rounded-cards border-2 border-charcoal bg-cream-paper dark:bg-surface-card text-charcoal shadow-lg p-5 sm:p-6 backdrop:bg-black/50"
    aria-labelledby="api-key-title"
  >
    <form method="dialog" class="flex flex-col gap-4" @submit.prevent="saveKey(keyInput)">
      <div>
        <h2 id="api-key-title" class="text-heading-sm font-black">SearchApi.io key</h2>
        <p class="mt-1 text-caption text-charcoal/80">
          Paste your own key from
          <a
            href="https://www.searchapi.io/"
            target="_blank"
            rel="noopener noreferrer"
            class="underline font-bold"
            >searchapi.io</a
          >
          for live results. It is stored only in this browser and sent only to SearchApi.io.
          Without a key, curated fallback links are shown.
        </p>
      </div>

      <label class="flex flex-col gap-1.5 text-caption font-bold">
        <span>{{ hasKey ? 'Replace saved key' : 'API key' }}</span>
        <input
          v-model="keyInput"
          type="password"
          autocomplete="off"
          spellcheck="false"
          maxlength="200"
          required
          class="min-h-[44px] px-3 rounded-inputs border-2 border-charcoal bg-cream-paper text-charcoal font-mono focus:outline-none focus:ring-2 focus:ring-charcoal"
        />
      </label>

      <div class="flex flex-wrap items-center justify-end gap-2">
        <button
          v-if="hasKey"
          type="button"
          class="min-h-[44px] px-4 rounded-buttons border-2 border-charcoal text-caption font-bold text-burnt-sienna hover:bg-dew-drop cursor-pointer mr-auto"
          @click="saveKey('')"
        >
          Remove key
        </button>
        <button
          type="button"
          class="min-h-[44px] px-4 rounded-buttons border-2 border-charcoal text-caption font-bold hover:bg-dew-drop cursor-pointer"
          @click="dialog?.close()"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="min-h-[44px] px-4 rounded-buttons border-2 border-charcoal bg-marker-orange text-white text-caption font-bold shadow-subtle active:shadow-none cursor-pointer"
        >
          Save
        </button>
      </div>
    </form>
  </dialog>
</template>
