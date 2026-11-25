<script setup>
import { computed, ref, watch } from 'vue'
import { highlightCode } from '../content/highlight.js'

const props = defineProps({
  source: { type: String, required: true },
  language: { type: String, default: '' },
  filename: { type: String, default: '' },
  copyable: { type: Boolean, default: true },
})

const languageDetails = {
  php: { label: 'PHP', extension: 'php' },
  python: { label: 'Python', extension: 'py' },
  py: { label: 'Python', extension: 'py' },
}
const languageInfo = computed(() =>
  Object.hasOwn(languageDetails, props.language)
    ? languageDetails[props.language]
    : { label: props.language || 'Texto', extension: 'txt' },
)
const fileLabel = computed(() => props.filename || `trecho.${languageInfo.value.extension}`)
const languageLabel = computed(() => languageInfo.value.label)
const lineCount = computed(() => props.source.replace(/\n$/, '').split('\n').length)
const syntax = computed(() => highlightCode(props.source, props.language))
const HighlightedSource = () => syntax.value
const copyState = ref('idle')
const copyMessage = computed(() => {
  if (copyState.value === 'copied') return 'Código copiado.'
  if (copyState.value === 'error')
    return 'Não foi possível copiar. Selecione o código para copiá-lo.'
  return ''
})

watch(
  () => props.source,
  () => {
    copyState.value = 'idle'
  },
)

async function copy() {
  const source = props.source
  try {
    await navigator.clipboard.writeText(source)
    if (props.source === source) copyState.value = 'copied'
  } catch {
    if (props.source === source) copyState.value = 'error'
  }
}
</script>

<template>
  <figure class="illustrated-code">
    <figcaption class="code-file">
      <span class="code-file__name">{{ fileLabel }}</span>
      <span class="code-file__language">{{ languageLabel }}</span>
      <button
        v-if="copyable"
        type="button"
        class="code-file__copy"
        aria-label="Copiar código"
        @click.stop="copy"
      >
        {{ copyState === 'copied' ? 'Copiado' : 'Copiar código' }}
      </button>
    </figcaption>
    <div
      v-if="copyable"
      :class="copyState === 'error' ? 'code-file__notice' : 'code-file__status'"
      role="status"
    >
      {{ copyMessage }}
    </div>
    <div class="code-scroll" role="region" :aria-label="`Código de ${fileLabel}`" tabindex="0">
      <div class="code-gutter" aria-hidden="true">
        <span v-for="line in lineCount" :key="line" :data-line="line"></span>
      </div>
      <pre><code><HighlightedSource /></code></pre>
    </div>
  </figure>
</template>

<style scoped>
.illustrated-code {
  --editor-bg: var(--color-editor, #101b31);
  --editor-bar: var(--color-editor-bar, #1a2945);
  --editor-text: var(--color-editor-text, #eff4ff);
  --editor-subtle: var(--color-editor-muted, #a9bbd8);
  --editor-border: var(--color-editor-border, #3d4e6e);
  --editor-focus: var(--color-editor-focus, #a1c1ff);

  position: relative;
  min-inline-size: 0;
  max-inline-size: 100%;
  margin: 0;
  overflow: hidden;
  border: 1px solid var(--editor-border);
  border-radius: var(--radius-editor, 0.65rem);
  background: var(--editor-bg);
  color: var(--editor-text);
  font: 0.875rem/1.6 var(--font-mono, ui-monospace, SFMono-Regular, Consolas, monospace);
  font-variant-ligatures: none;
}

.code-file {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-block-size: 2.75rem;
  padding-inline: 0.75rem 0.3rem;
  border-block-end: 1px solid var(--editor-border);
  background: var(--editor-bar);
  font-size: 0.75rem;
}

.code-file__name {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.code-file__language {
  max-inline-size: 30%;
  margin-inline-start: auto;
  overflow: hidden;
  color: var(--editor-subtle);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.code-file__copy {
  min-block-size: 2.75rem;
  padding-inline: 0.5rem;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-weight: 650;
  white-space: nowrap;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

@media (hover: hover) {
  .code-file__copy:hover {
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }
}

.code-file__status {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  clip-path: inset(50%);
  overflow: hidden;
  white-space: nowrap;
}

.code-file__notice {
  padding: 0.4rem 0.75rem;
  border-block-end: 1px solid var(--editor-border);
  background: var(--editor-bar);
}

.code-scroll {
  display: flex;
  max-inline-size: 100%;
  overflow-x: auto;
  scrollbar-color: var(--editor-subtle) var(--editor-bg);
  overscroll-behavior-inline: contain;
}

.code-scroll:focus-visible,
.code-file__copy:focus-visible {
  outline: 2px solid var(--editor-focus);
  outline-offset: -3px;
}

.code-gutter {
  flex: none;
  padding: 0.85rem 0.65rem 0.85rem 0.8rem;
  color: var(--editor-subtle);
  text-align: end;
  user-select: none;
}

.code-gutter span {
  display: block;
}

.code-gutter span::before {
  content: attr(data-line);
}

pre {
  min-inline-size: max-content;
  margin: 0;
  padding: 0.85rem 0.85rem 0.85rem 0.25rem;
  color: inherit;
  font: inherit;
  white-space: pre;
  overflow-wrap: normal;
  tab-size: 4;
}

pre code {
  font: inherit;
}

pre code::selection,
pre code :deep(span::selection) {
  background: #354f80;
  color: #fff;
}

:deep(.hljs-keyword),
:deep(.hljs-selector-tag),
:deep(.hljs-meta) {
  color: #d8b4fe;
}

:deep(.hljs-built_in),
:deep(.hljs-type),
:deep(.hljs-title) {
  color: #9bd4ff;
}

:deep(.hljs-string) {
  color: #b3e1a7;
}

:deep(.hljs-comment) {
  color: #a9bbd8;
  font-style: italic;
}

:deep(.hljs-variable),
:deep(.hljs-property),
:deep(.hljs-attr) {
  color: #b7ccff;
}

:deep(.hljs-literal),
:deep(.hljs-number) {
  color: #ffd0a8;
}
</style>
