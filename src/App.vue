<script setup>
import { nextTick, ref } from 'vue'

import AppIcon from './components/AppIcon.vue'
import QuestionView from './components/QuestionView.vue'
import QuizHeader from './components/QuizHeader.vue'
import QuizResults from './components/QuizResults.vue'
import { useQuiz } from './composables/useQuiz.js'

const {
  phase,
  title,
  bankTotal,
  roundKind,
  answeredCount,
  roundTotal,
  currentIndex,
  currentQuestion,
  selectedId,
  currentAnswer,
  isLastQuestion,
  result,
  start,
  select,
  confirm,
  next,
  restart,
  reviewErrors,
} = useQuiz()

const main = ref(null)

async function moveToScreen(action) {
  if (action()) {
    await nextTick()
    main.value?.querySelector('[data-screen-heading]')?.focus()
  }
}
</script>

<template>
  <QuizHeader
    :title="title"
    :phase="phase"
    :round-kind="roundKind"
    :answered-count="answeredCount"
    :round-total="roundTotal"
  />
  <main ref="main" class="layout-width page">
    <div v-if="phase === 'intro' || phase === 'pending'" class="introduction">
      <section class="introduction__content" aria-labelledby="intro-heading">
        <h1 id="intro-heading">{{ title }}</h1>
        <p class="introduction__topics">Curso de Inteligência Artificial</p>
        <p v-if="phase === 'pending'" class="introduction__description">
          O questionário estará disponível quando o banco de questões for carregado.
        </p>
        <template v-else>
          <p class="introduction__description">
            Revise o conteúdo da disciplina em {{ bankTotal }}
            {{ bankTotal === 1 ? 'questão' : 'questões' }} com explicações para cada resposta.
          </p>
          <button class="button button--primary" type="button" @click="moveToScreen(start)">
            Começar revisão
            <AppIcon name="arrow" />
          </button>
          <p class="introduction__note">
            <AppIcon name="info" />
            <span>Seu progresso vale apenas enquanto esta página estiver aberta.</span>
          </p>
        </template>
      </section>
    </div>
    <QuestionView
      v-else-if="phase === 'question' && currentQuestion"
      :key="currentQuestion.id"
      :question="currentQuestion"
      :number="currentIndex + 1"
      :total="roundTotal"
      :selected-id="selectedId"
      :answer="currentAnswer"
      :last="isLastQuestion"
      @select="select"
      @confirm="confirm"
      @next="moveToScreen(next)"
    />
    <QuizResults
      v-else-if="phase === 'results' && result"
      :result="result"
      @restart="moveToScreen(restart)"
      @review="moveToScreen(reviewErrors)"
    />
    <div v-else class="data-error">
      <h1 tabindex="-1" data-screen-heading>As questões estão indisponíveis</h1>
      <p>O material de revisão não pôde ser carregado. Tente atualizar a página.</p>
    </div>
  </main>
</template>
