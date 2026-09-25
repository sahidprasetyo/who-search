<script setup lang="ts">
// Purely presentational layout component enforcing DESIGN.md max-width and pane layout
</script>

<template>
  <div class="min-h-screen bg-cream-paper text-charcoal flex flex-col font-sans selection:bg-dew-drop selection:text-charcoal">
    <!-- Header Region -->
    <header
      class="sticky top-0 z-30 border-b-2 sm:border-b-[3px] border-charcoal bg-cream-paper shadow-subtle px-4 sm:px-6 lg:px-8 py-3.5"
    >
      <div class="mx-auto max-w-[1200px] flex items-center justify-between">
        <slot name="header" />
      </div>
    </header>

    <!-- Main Content Body -->
    <main class="flex-1 mx-auto w-full max-w-[1200px] p-4 sm:p-6 lg:p-8">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
        <!-- Left Pane (Navigation) -->
        <aside class="hidden md:block md:col-span-4 lg:col-span-4 sticky top-22">
          <slot name="navigation" />
        </aside>

        <!-- Right Side Panes (Stacked) -->
        <section class="col-span-1 md:col-span-8 lg:col-span-8 flex flex-col gap-6">
          <!-- Top-Right Pane (Search Results) -->
          <div class="w-full">
            <slot name="topContent" />
          </div>

          <!-- Bottom-Right Pane (Content Viewer) -->
          <div class="w-full">
            <slot name="bottomContent" />
          </div>
        </section>
      </div>
    </main>

    <!-- Mobile Drawer Slot -->
    <slot name="drawer" />

    <!-- Optional Footer Band -->
    <footer v-if="$slots.footer" class="mt-auto">
      <slot name="footer" />
    </footer>
  </div>
</template>
