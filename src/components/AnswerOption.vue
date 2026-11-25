<script setup>
import { computed } from 'vue'

import AppIcon from './AppIcon.vue'
import MarkdownContent from './MarkdownContent.vue'

const props = defineProps({
  questionId: { type: String, required: true },
  option: { type: Object, required: true },
  letter: { type: String, required: true },
  selected: Boolean,
  confirmed: Boolean,
  correct: Boolean,
})

const emit = defineEmits(['select'])
const inputId = computed(
  () => `resposta-${encodeURIComponent(props.questionId)}:${encodeURIComponent(props.option.id)}`,
)
const outcome = computed(() => {
  if (!props.confirmed) return ''
  if (props.correct) return props.selected ? 'Sua resposta · Correta' : 'Resposta correta'
  return props.selected ? 'Sua resposta · Incorreta' : ''
})

function selectFromContent(event) {
  if (
    props.confirmed ||
    event.target.closest('pre, button, a, input, label, figure') ||
    window.getSelection()?.isCollapsed === false
  ) {
    return
  }

  document.getElementById(inputId.value)?.click()
}
</script>

<template>
  <li
    class="answer-option"
    :class="{
      'answer-option--open': !confirmed,
      'answer-option--selected': selected && !confirmed,
      'answer-option--correct': confirmed && correct,
      'answer-option--incorrect': confirmed && selected && !correct,
    }"
    @click="selectFromContent"
  >
    <div class="answer-option__choice">
      <input
        :id="inputId"
        type="radio"
        :name="`questao-${questionId}`"
        :value="option.id"
        :checked="selected"
        :disabled="confirmed"
        :aria-describedby="`${inputId}-conteudo${outcome ? ` ${inputId}-estado` : ''}`"
        @change="emit('select', option.id)"
      />
      <label :for="inputId"> <span class="sr-only">Alternativa </span>{{ letter }} </label>
    </div>
    <div class="answer-option__body">
      <p v-if="outcome" :id="`${inputId}-estado`" class="answer-option__outcome">
        <AppIcon :name="correct ? 'check' : 'cross'" />{{ outcome }}
      </p>
      <div :id="`${inputId}-conteudo`">
        <MarkdownContent :source="option.texto" />
      </div>
    </div>
  </li>
</template>
