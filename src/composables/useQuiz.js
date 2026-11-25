import { computed, readonly, ref, shallowRef } from 'vue'
import defaultBank from '../data/questoes.json'
import { validateQuestionBank } from '../domain/question-bank.js'
import {
  advanceRound,
  confirmAnswer,
  createRound,
  selectOption,
  summarizeRound,
} from '../domain/quiz-session.js'

export function useQuiz(bank = defaultBank, random = Math.random) {
  const phase = ref('intro')
  const roundKind = ref('all')
  const round = shallowRef(null)
  let questions = []
  let title = ''

  try {
    validateQuestionBank(bank, { allowEmpty: true })
    title = bank.titulo
    questions = bank.questoes
    if (questions.length) {
      round.value = createRound(questions, random)
    } else {
      phase.value = 'pending'
    }
  } catch (error) {
    phase.value = 'error'
    if (import.meta.env.DEV) {
      console.error(error)
    }
  }

  const currentIndex = computed(() => round.value?.currentIndex ?? 0)
  const roundTotal = computed(() => round.value?.questions.length ?? 0)
  const selectedId = computed(() => round.value?.selectedId ?? null)
  const currentQuestion = computed(() => round.value?.questions[currentIndex.value] ?? null)
  const currentAnswer = computed(() => round.value?.answers[currentIndex.value] ?? null)
  const answeredCount = computed(() => round.value?.answers.length ?? 0)
  const isLastQuestion = computed(
    () => phase.value === 'question' && currentIndex.value === roundTotal.value - 1,
  )
  const result = computed(() => (phase.value === 'results' ? summarizeRound(round.value) : null))

  function start() {
    if (phase.value !== 'intro') return false
    phase.value = 'question'
    return true
  }

  function updateRound(transition, optionId) {
    if (phase.value !== 'question') return false
    const updated = transition(round.value, optionId)
    if (updated === round.value) return false
    round.value = updated
    return true
  }

  function select(optionId) {
    return updateRound(selectOption, optionId)
  }

  function confirm() {
    return updateRound(confirmAnswer)
  }

  function next() {
    if (!updateRound(advanceRound)) return false
    if (currentIndex.value === roundTotal.value) {
      phase.value = 'results'
    }
    return true
  }

  function newRound(items, kind) {
    if (phase.value !== 'results' || items.length === 0) return false
    round.value = createRound(items, random)
    roundKind.value = kind
    phase.value = 'question'
    return true
  }

  function restart() {
    return newRound(questions, 'all')
  }

  function reviewErrors() {
    const wrongIds = new Set(result.value?.wrongIds)
    return newRound(
      questions.filter((question) => wrongIds.has(question.id)),
      'review',
    )
  }

  return {
    phase: readonly(phase),
    title: computed(() => title),
    bankTotal: computed(() => questions.length),
    roundKind: readonly(roundKind),
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
  }
}
