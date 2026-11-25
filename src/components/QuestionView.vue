<script setup>
import { nextTick, ref } from 'vue'

import AnswerFeedback from './AnswerFeedback.vue'
import AnswerOption from './AnswerOption.vue'
import AppIcon from './AppIcon.vue'
import MarkdownContent from './MarkdownContent.vue'

const props = defineProps({
  question: { type: Object, required: true },
  number: { type: Number, required: true },
  total: { type: Number, required: true },
  selectedId: { type: String, default: null },
  answer: { type: Object, default: null },
  last: Boolean,
})

const emit = defineEmits(['select', 'confirm', 'next'])
const feedbackHeading = ref(null)

function letterFor(index) {
  let number = index + 1
  let label = ''
  while (number > 0) {
    number -= 1
    label = String.fromCharCode(65 + (number % 26)) + label
    number = Math.floor(number / 26)
  }
  return label
}

async function submit() {
  if (props.answer) {
    emit('next')
    return
  }

  emit('confirm')
  await nextTick()
  feedbackHeading.value?.focus()
}
</script>

<template>
  <section class="question" :data-question-id="question.id" aria-labelledby="question-heading">
    <h1 id="question-heading" tabindex="-1" data-screen-heading>
      Questão <span>{{ number }}</span> de {{ total }}
    </h1>
    <div class="question__prompt">
      <MarkdownContent :source="question.enunciado" />
    </div>
    <form @submit.prevent="submit">
      <fieldset class="question__options">
        <legend>Alternativas</legend>
        <ol class="answer-list">
          <AnswerOption
            v-for="(option, index) in question.alternativas"
            :key="option.id"
            :question-id="question.id"
            :option="option"
            :letter="letterFor(index)"
            :selected="selectedId === option.id"
            :confirmed="Boolean(answer)"
            :correct="Boolean(answer && answer.correctOption.id === option.id)"
            @select="emit('select', $event)"
          />
        </ol>
      </fieldset>
      <p class="sr-only" role="status">
        {{ answer ? (answer.isCorrect ? 'Resposta correta.' : 'Resposta incorreta.') : '' }}
      </p>
      <section v-if="answer" class="question__feedback" aria-labelledby="feedback-heading">
        <h2 id="feedback-heading" ref="feedbackHeading" tabindex="-1">Entenda a correção</h2>
        <AnswerFeedback :answer="answer" />
      </section>
      <div class="question__actions">
        <button type="submit" class="button button--primary" :disabled="!selectedId">
          {{ answer ? (last ? 'Ver resultado' : 'Próxima questão') : 'Responder' }}
          <AppIcon name="arrow" />
        </button>
      </div>
    </form>
  </section>
</template>
