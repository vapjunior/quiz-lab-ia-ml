<script setup>
import { computed } from 'vue'

import AppIcon from './AppIcon.vue'
import MarkdownContent from './MarkdownContent.vue'

const props = defineProps({
  answer: { type: Object, required: true },
  showOtherOptions: { type: Boolean, default: true },
})

const otherOptions = computed(() =>
  props.answer.question.alternativas.filter(
    (option) =>
      option.id !== props.answer.selectedOption.id && option.id !== props.answer.correctOption.id,
  ),
)
</script>

<template>
  <div class="feedback" :class="answer.isCorrect ? 'feedback--correct' : 'feedback--incorrect'">
    <h3 class="feedback__title">
      <AppIcon :name="answer.isCorrect ? 'check' : 'cross'" />
      {{ answer.isCorrect ? 'Resposta correta' : 'Resposta incorreta' }}
    </h3>
    <div class="feedback__explanations">
      <section class="feedback__entry">
        <h4>Sua resposta</h4>
        <MarkdownContent :source="answer.selectedOption.texto" />
        <div class="feedback__reason">
          <MarkdownContent :source="answer.selectedOption.justificativa" />
        </div>
      </section>
      <section v-if="!answer.isCorrect" class="feedback__entry">
        <h4>Resposta correta</h4>
        <MarkdownContent :source="answer.correctOption.texto" />
        <div class="feedback__reason">
          <MarkdownContent :source="answer.correctOption.justificativa" />
        </div>
      </section>
    </div>
    <details v-if="showOtherOptions && otherOptions.length" class="disclosure disclosure--feedback">
      <summary>
        Entender as outras alternativas
        <AppIcon name="chevron" />
      </summary>
      <ul class="feedback__explanations">
        <li v-for="option in otherOptions" :key="option.id" class="feedback__entry">
          <MarkdownContent :source="option.texto" />
          <div class="feedback__reason">
            <MarkdownContent :source="option.justificativa" />
          </div>
        </li>
      </ul>
    </details>
  </div>
</template>
