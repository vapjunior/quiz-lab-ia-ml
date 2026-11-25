import { describe, expect, it, vi } from 'vitest'
import { useQuiz } from '../../src/composables/useQuiz.js'
import { createRound } from '../../src/domain/quiz-session.js'
import { shuffle } from '../../src/domain/shuffle.js'
import { fixtureBank as bank } from '../fixtures/question-bank.js'

function answer(quiz, isCorrect) {
  const { alternativas, alternativaCorretaId } = quiz.currentQuestion.value
  const option = alternativas.find((item) => (item.id === alternativaCorretaId) === isCorrect)
  expect(quiz.select(option.id)).toBe(true)
  expect(quiz.confirm()).toBe(true)
  expect(quiz.currentAnswer.value.isCorrect).toBe(isCorrect)
  expect(quiz.currentAnswer.value.selectedOption).toBe(option)
  expect(quiz.next()).toBe(true)
}

describe('embaralhamento', () => {
  it('executa Fisher–Yates em cópia com aleatoriedade controlada', () => {
    const items = Object.freeze(['A', 'B', 'C', 'D'])
    expect(shuffle(items, () => 0)).toEqual(['B', 'C', 'D', 'A'])
    expect(items).toEqual(['A', 'B', 'C', 'D'])
    expect(shuffle(items, () => 0.99)).toEqual(items)
    expect(shuffle(items, () => 0.99)).not.toBe(items)
  })

  it('preserva identidade, conteúdo e gabarito após o sorteio', () => {
    const source = bank.questoes
    const original = structuredClone(source)
    const { questions } = createRound(source, () => 0)
    expect(questions.map((question) => question.id)).toEqual(['segunda', 'terceira', 'primeira'])
    for (const question of questions) {
      const before = source.find((item) => item.id === question.id)
      expect(question.alternativas).not.toBe(before.alternativas)
      expect(question.alternativas).toEqual([
        ...before.alternativas.slice(1),
        before.alternativas[0],
      ])
      expect(question.alternativaCorretaId).toBe(before.alternativaCorretaId)
      expect(question.enunciado).toBe(before.enunciado)
    }
    expect(source).toEqual(original)
  })
})

describe('rodada reativa', () => {
  it('permite trocar a escolha e confirma apenas uma resposta sem mudar a ordem', () => {
    const random = vi.fn(() => 0)
    const quiz = useQuiz(bank, random)
    expect(quiz.phase.value).toBe('intro')
    expect(quiz.answeredCount.value).toBe(0)
    expect(quiz.start()).toBe(true)
    expect(quiz.start()).toBe(false)
    expect(quiz.confirm()).toBe(false)
    expect(quiz.next()).toBe(false)
    expect(quiz.select('ausente')).toBe(false)
    const question = quiz.currentQuestion.value
    const wrong = question.alternativas.find((item) => item.id !== question.alternativaCorretaId)
    expect(quiz.select(wrong.id)).toBe(true)
    expect(quiz.select(question.alternativaCorretaId)).toBe(true)
    expect(quiz.confirm()).toBe(true)
    expect(quiz.confirm()).toBe(false)
    expect(quiz.select(wrong.id)).toBe(false)
    expect(quiz.currentQuestion.value).toBe(question)
    expect(quiz.answeredCount.value).toBe(1)
    expect(quiz.currentAnswer.value.isCorrect).toBe(true)
    expect(quiz.currentAnswer.value.selectedOption).toBe(quiz.currentAnswer.value.correctOption)
    expect(random).toHaveBeenCalledTimes(11)
  })

  it('calcula o placar e permite revisar somente os erros sem reaproveitar pontos', () => {
    const quiz = useQuiz(bank, () => 0)
    quiz.start()
    answer(quiz, false)
    answer(quiz, true)
    expect(quiz.isLastQuestion.value).toBe(true)
    answer(quiz, true)
    expect(quiz.phase.value).toBe('results')
    expect(quiz.next()).toBe(false)
    expect(quiz.result.value).toMatchObject({
      answeredCount: 3,
      correctCount: 2,
      wrongIds: ['segunda'],
    })
    expect(quiz.result.value.percentage).toBeCloseTo(66.6667)
    expect(quiz.result.value.answers.map((item) => item.question.id)).toEqual([
      'segunda',
      'terceira',
      'primeira',
    ])

    expect(quiz.reviewErrors()).toBe(true)
    expect(quiz.phase.value).toBe('question')
    expect(quiz.roundKind.value).toBe('review')
    expect(quiz.roundTotal.value).toBe(1)
    expect(quiz.answeredCount.value).toBe(0)
    expect(quiz.selectedId.value).toBeNull()
    expect(quiz.result.value).toBeNull()
    expect(quiz.currentQuestion.value.id).toBe('segunda')
    answer(quiz, true)
    expect(quiz.result.value).toMatchObject({ answeredCount: 1, correctCount: 1, percentage: 100 })
    expect(quiz.reviewErrors()).toBe(false)

    expect(quiz.restart()).toBe(true)
    expect(quiz.roundKind.value).toBe('all')
    expect(quiz.roundTotal.value).toBe(3)
    expect(quiz.answeredCount.value).toBe(0)
    expect(quiz.currentIndex.value).toBe(0)
    expect(quiz.selectedId.value).toBeNull()
  })

  it('preserva a fração de percentual em uma rodada de 40 questões', () => {
    const question = bank.questoes[0]
    const questions = Array.from({ length: 40 }, (_, index) => ({
      ...question,
      id: `fixture-${index}`,
    }))
    const quiz = useQuiz({ ...bank, questoes: questions }, () => 0)
    quiz.start()
    answer(quiz, false)
    for (let index = 1; index < questions.length; index += 1) answer(quiz, true)
    expect(quiz.result.value.percentage).toBe(97.5)
  })

  it('identifica o banco vazio como pendente e impede iniciar a rodada', () => {
    const quiz = useQuiz({ titulo: 'Banco pendente', questoes: [] })
    expect(quiz.phase.value).toBe('pending')
    expect(quiz.bankTotal.value).toBe(0)
    expect(quiz.start()).toBe(false)
  })

  it('mostra estado de falha quando o banco é inválido', () => {
    const report = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      const quiz = useQuiz({ ...bank, questoes: null })
      expect(quiz.phase.value).toBe('error')
      expect(quiz.start()).toBe(false)
      expect(quiz.currentQuestion.value).toBeNull()
      expect(report).toHaveBeenCalledWith(expect.any(TypeError))
    } finally {
      report.mockRestore()
    }
  })
})
