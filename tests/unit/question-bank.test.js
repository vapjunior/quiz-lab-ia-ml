import { describe, expect, it } from 'vitest'
import { fixtureBank as bank } from '../fixtures/question-bank.js'
import { validateQuestionBank } from '../../src/domain/question-bank.js'

describe('banco de questões', () => {
  it('aceita IDs de alternativas reutilizados em questões distintas', () => {
    expect(validateQuestionBank(bank)).toBe(bank)
    expect(bank.questoes[0].alternativas[0].id).toBe(bank.questoes[1].alternativas[0].id)
  })

  it.each([
    [
      'questões duplicadas',
      /questoes\[1\]\.id/,
      (copy) => (copy.questoes[1].id = copy.questoes[0].id),
    ],
    [
      'alternativas duplicadas na mesma questão',
      /questoes\[0\]\.alternativas\[1\]\.id/,
      (copy) => (copy.questoes[0].alternativas[1].id = copy.questoes[0].alternativas[0].id),
    ],
    [
      'gabarito ausente',
      /questoes\[0\]\.alternativaCorretaId/,
      (copy) => (copy.questoes[0].alternativaCorretaId = 'ausente'),
    ],
    [
      'justificativa vazia',
      /questoes\[0\]\.alternativas\[0\]\.justificativa/,
      (copy) => (copy.questoes[0].alternativas[0].justificativa = '  '),
    ],
    [
      'questão com apenas uma opção',
      /questoes\[0\]\.alternativas/,
      (copy) => copy.questoes[0].alternativas.splice(1),
    ],
    ['banco vazio', /questoes/, (copy) => (copy.questoes = [])],
    ['título de tipo inválido', /titulo/, (copy) => (copy.titulo = 1)],
  ])('rejeita %s e identifica o campo', (_name, pattern, invalidate) => {
    const copy = structuredClone(bank)
    invalidate(copy)
    expect(() => validateQuestionBank(copy)).toThrow(pattern)
  })

  it('rejeita raiz inexistente', () => {
    expect(() => validateQuestionBank(null)).toThrow(/raiz/)
  })
})
