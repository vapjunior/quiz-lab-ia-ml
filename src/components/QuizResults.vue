<script setup>
import { ref } from 'vue'

import AnswerFeedback from './AnswerFeedback.vue'
import AppIcon from './AppIcon.vue'
import MarkdownContent from './MarkdownContent.vue'

defineProps({
  result: { type: Object, required: true },
})

const emit = defineEmits(['restart', 'review'])
const revealedAnswers = ref(new Set())

function revealAnswer(event, questionId) {
  if (event.currentTarget.open) revealedAnswers.value.add(questionId)
}
const percentageFormat = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 })
</script>

<template>
  <section class="results" aria-labelledby="results-heading">
    <header class="results__header">
      <h1 id="results-heading" tabindex="-1" data-screen-heading>Resultado da rodada</h1>
      <p v-if="result.wrongIds.length">
        Retome as questões em que errou para praticar os pontos que ainda geram dúvida.
      </p>
      <p v-else>
        Você acertou todas as questões desta rodada. Pode consultar as explicações abaixo.
      </p>
    </header>
    <dl class="result-stats">
      <div>
        <dt>Acertos</dt>
        <dd>{{ result.correctCount }}</dd>
      </div>
      <div>
        <dt>Respondidas</dt>
        <dd>{{ result.answeredCount }}</dd>
      </div>
      <div>
        <dt>Aproveitamento</dt>
        <dd>{{ percentageFormat.format(result.percentage) }}%</dd>
      </div>
    </dl>
    <div class="results__actions">
      <button
        v-if="result.wrongIds.length"
        class="button button--primary"
        type="button"
        @click="emit('review')"
      >
        Revisar erros
        <AppIcon name="arrow" />
      </button>
      <button
        class="button"
        :class="result.wrongIds.length ? 'button--secondary' : 'button--primary'"
        type="button"
        @click="emit('restart')"
      >
        Refazer todas
        <AppIcon v-if="!result.wrongIds.length" name="arrow" />
      </button>
    </div>
    <details class="disclosure results__review">
      <summary>
        Consultar respostas da rodada
        <AppIcon name="chevron" />
      </summary>
      <ol class="results__answers">
        <li v-for="(answer, index) in result.answers" :key="answer.question.id">
          <details
            class="disclosure results__answer"
            @toggle="revealAnswer($event, answer.question.id)"
          >
            <summary>
              Questão {{ index + 1 }}
              <span
                class="results__answer-state"
                :class="answer.isCorrect ? 'is-correct' : 'is-incorrect'"
              >
                <AppIcon :name="answer.isCorrect ? 'check' : 'cross'" />
                {{ answer.isCorrect ? 'Correta' : 'Incorreta' }}
              </span>
              <AppIcon name="chevron" />
            </summary>
            <div v-if="revealedAnswers.has(answer.question.id)" class="results__answer-body">
              <MarkdownContent :source="answer.question.enunciado" />
              <AnswerFeedback :answer="answer" />
            </div>
          </details>
        </li>
      </ol>
    </details>
  </section>
</template>
