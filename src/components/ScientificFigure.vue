<script setup>
import { ref, useId } from 'vue'

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
})

const titleId = useId()
const dialog = ref(null)
const trigger = ref(null)
const isExpanded = ref(false)
const hasLoadError = ref(false)

function enlarge() {
  dialog.value.showModal()
  isExpanded.value = true
}

function afterClose() {
  isExpanded.value = false
  trigger.value?.focus()
}
</script>

<template>
  <figure class="scientific-figure">
    <div v-if="hasLoadError" class="scientific-figure__fallback">
      <p>Não foi possível exibir o gráfico.</p>
      <p>{{ alt }}</p>
    </div>
    <template v-else>
      <img :src="src" :alt="alt" :width="width" :height="height" @error="hasLoadError = true" />
      <figcaption class="scientific-figure__actions">
        <button
          ref="trigger"
          class="button button--secondary"
          type="button"
          aria-haspopup="dialog"
          @click="enlarge"
        >
          Ampliar gráfico
        </button>
      </figcaption>
    </template>

    <Teleport to="body">
      <dialog ref="dialog" class="scientific-dialog" :aria-labelledby="titleId" @close="afterClose">
        <header class="scientific-dialog__header">
          <h2 :id="titleId">Gráfico ampliado</h2>
          <button class="button button--secondary" type="button" autofocus @click="dialog.close()">
            Fechar
          </button>
        </header>
        <p class="scientific-dialog__hint">Role para inspecionar os eixos e os dados.</p>
        <div
          class="scientific-dialog__plot"
          role="region"
          aria-label="Área rolável do gráfico"
          tabindex="0"
        >
          <img
            v-if="isExpanded"
            :src="src"
            :alt="alt"
            :width="width"
            :height="height"
            :style="{ '--expanded-width': `${Math.round(props.width * 1.35)}px` }"
          />
        </div>
      </dialog>
    </Teleport>
  </figure>
</template>

<style scoped>
.scientific-figure {
  display: grid;
  gap: var(--space-2);
  margin: var(--space-4) 0;
}

.scientific-figure > img {
  display: block;
  max-inline-size: 100%;
  block-size: auto;
  border-radius: var(--radius);
  outline: 1px solid var(--line);
  outline-offset: -1px;
  background: var(--surface);
}

.scientific-figure__actions {
  display: flex;
}

.scientific-figure__fallback {
  padding: var(--space-4);
  border: 1px solid var(--line);
  border-radius: var(--radius);
}

.scientific-dialog {
  position: fixed;
  inline-size: min(72rem, calc(100% - 2rem));
  max-block-size: calc(100dvh - 2rem);
  padding: clamp(var(--space-3), 3vw, var(--space-6));
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface);
  color: var(--ink);
}

.scientific-dialog[open] {
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  gap: var(--space-3);
}

.scientific-dialog::backdrop {
  background: rgb(21 23 42 / 65%);
}

.scientific-dialog__header {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  align-items: center;
  justify-content: space-between;
}

.scientific-dialog__header h2 {
  font-size: clamp(1.125rem, 4vw, 1.5rem);
}

.scientific-dialog__hint {
  color: var(--muted);
}

.scientific-dialog__plot {
  min-inline-size: 0;
  overflow: auto;
  overscroll-behavior: contain;
  border: 1px solid var(--line);
}

.scientific-dialog__plot img {
  display: block;
  inline-size: var(--expanded-width);
  min-inline-size: 100%;
  block-size: auto;
}
</style>
