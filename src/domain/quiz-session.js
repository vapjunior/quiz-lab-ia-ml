import { shuffle } from './shuffle.js'

export function createRound(questions, random = Math.random) {
  return {
    questions: shuffle(questions, random).map((question) => ({
      ...question,
      alternativas: shuffle(question.alternativas, random),
    })),
    currentIndex: 0,
    selectedId: null,
    answers: [],
  }
}

export function selectOption(round, optionId) {
  const question = round.questions[round.currentIndex]
  const isPending = round.answers.length === round.currentIndex
  if (!isPending || !question?.alternativas.some((option) => option.id === optionId)) {
    return round
  }
  return { ...round, selectedId: optionId }
}

export function confirmAnswer(round) {
  const question = round.questions[round.currentIndex]
  if (!question || round.answers.length !== round.currentIndex) {
    return round
  }

  const selectedOption = question.alternativas.find((option) => option.id === round.selectedId)
  if (!selectedOption) {
    return round
  }

  const correctOption = question.alternativas.find(
    (option) => option.id === question.alternativaCorretaId,
  )
  const answer = {
    question,
    selectedOption,
    correctOption,
    isCorrect: selectedOption.id === question.alternativaCorretaId,
  }
  return { ...round, answers: [...round.answers, answer] }
}

export function advanceRound(round) {
  if (round.answers.length <= round.currentIndex) {
    return round
  }
  return { ...round, currentIndex: round.currentIndex + 1, selectedId: null }
}

export function summarizeRound(round) {
  const { answers } = round
  const answeredCount = answers.length
  const wrongIds = answers.filter((answer) => !answer.isCorrect).map((answer) => answer.question.id)
  const correctCount = answeredCount - wrongIds.length

  return {
    answeredCount,
    correctCount,
    percentage: answeredCount ? (correctCount / answeredCount) * 100 : 0,
    wrongIds,
    answers,
  }
}
