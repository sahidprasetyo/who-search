import { ref, watch, type Ref } from 'vue'

export interface UseIframePreviewReturn {
  isIframeLoading: Ref<boolean>
  handleIframeLoad: () => void
}

/**
 * Encapsulates iframe loading lifecycle state and watch synchronization.
 */
export function useIframePreview(targetUrl: Ref<string | null | undefined>): UseIframePreviewReturn {
  const isIframeLoading = ref<boolean>(true)

  watch(
    targetUrl,
    (newUrl) => {
      if (newUrl) {
        isIframeLoading.value = true
      }
    },
    { immediate: true },
  )

  function handleIframeLoad(): void {
    isIframeLoading.value = false
  }

  return {
    isIframeLoading,
    handleIframeLoad,
  }
}
