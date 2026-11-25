<script setup>
import { computed } from 'vue'
import { parseMarkdown, renderMarkdown } from '../content/markdown.js'

const props = defineProps({
  source: { type: String, required: true },
  filename: { type: String, default: '' },
  copyable: { type: Boolean, default: true },
})

const tokens = computed(() => parseMarkdown(props.source))
const Content = () => renderMarkdown(tokens.value, props.filename, props.copyable)
</script>

<template>
  <div class="markdown-content">
    <Content />
  </div>
</template>

<style scoped>
.markdown-content {
  min-inline-size: 0;
  overflow-wrap: anywhere;
}

.markdown-content :deep(p) {
  margin: 0;
}

.markdown-content :deep(p + p) {
  margin-block-start: 0.8em;
}

.markdown-content :deep(.illustrated-code + p),
.markdown-content :deep(p + .illustrated-code) {
  margin-block-start: 0.85rem;
}

.markdown-content :deep(.inline-code) {
  padding: 0.05em 0.3em;
  border: 1px solid var(--color-inline-code-border, #d5ddec);
  border-radius: 0.25rem;
  background: var(--color-inline-code-bg, #edf1f8);
  color: var(--color-inline-code, #18345b);
  font: 0.88em var(--font-mono, ui-monospace, SFMono-Regular, Consolas, monospace);
  font-variant-ligatures: none;
}

.markdown-content :deep(.embedded-png) {
  max-inline-size: 100%;
  block-size: auto;
}

.markdown-content :deep(table) {
  display: block;
  max-inline-size: 100%;
  overflow-x: auto;
}
</style>
