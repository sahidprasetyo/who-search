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
    class="neo-control min-h-[40px] sm:min-h-[44px] inline-flex items-center justify-center gap-2 px-4 bg-surface-card hover:bg-dew-drop text-caption font-bold text-charcoal"
    :aria-label="hasKey ? 'SearchApi.io key saved, change key' : 'Add your SearchApi.io key'"
    @click="openDialog"
  >
    <span
      class="w-2 h-2 rounded-full"
      :class="hasKey ? 'bg-sprout-sticker' : 'bg-charcoal/25'"
      aria-hidden="true"
    />
    <span>API key</span>
  </button>

  <dialog
    ref="dialog"
    class="m-auto w-[calc(100%-2rem)] max-w-md rounded-cards border-2 border-charcoal bg-surface-card text-charcoal shadow-card p-6 sm:p-8 backdrop:bg-slate-950/50"
    aria-labelledby="api-key-title"
  >
    <form method="dialog" class="flex flex-col gap-6" @submit.prevent="saveKey(keyInput)">
      <div>
        <h2 id="api-key-title" class="text-heading-sm font-black">SearchApi.io key</h2>
        <p class="mt-2 text-caption leading-relaxed text-charcoal/80">
          Paste your own key from
          <a
            href="https://www.searchapi.io/"
            target="_blank"
            rel="noopener noreferrer"
            class="font-semibold underline decoration-marker-orange decoration-2 underline-offset-4"
            >searchapi.io</a
          >
          for live results. It is stored only in this browser and sent only to SearchApi.io.
          Without a key, curated fallback links are shown.
        </p>
      </div>

      <label class="flex flex-col gap-2 text-caption font-semibold">
        <span>{{ hasKey ? 'Replace saved key' : 'API key' }}</span>
        <input
          v-model="keyInput"
          type="password"
          autocomplete="off"
          spellcheck="false"
          maxlength="200"
          required
          class="min-h-[44px] px-3 rounded-inputs border-2 border-charcoal bg-cream-paper text-charcoal font-mono shadow-control focus:outline-2 focus:outline-offset-3 focus:outline-marker-orange"
        />
      </label>

      <div class="flex flex-wrap items-center justify-end gap-3 pt-2">
        <button
          v-if="hasKey"
          type="button"
          class="neo-control min-h-[44px] px-4 bg-surface-card text-caption font-bold text-burnt-sienna hover:bg-dew-drop mr-auto"
          @click="saveKey('')"
        >
          Remove key
        </button>
        <button
          type="button"
          class="neo-control min-h-[44px] px-4 bg-surface-card text-caption font-bold hover:bg-dew-drop"
          @click="dialog?.close()"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="neo-control min-h-[44px] px-5 bg-marker-orange text-on-accent text-caption font-bold"
        >
          Save
        </button>
      </div>
    </form>
  </dialog>
</template>
