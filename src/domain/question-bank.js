function requireObject(value, path) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${path}: esperado um objeto.`)
  }
}

function requireText(value, path) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new TypeError(`${path}: esperado texto não vazio.`)
  }
}

function requireList(value, minimum, path) {
  if (!Array.isArray(value) || value.length < minimum) {
    throw new TypeError(`${path}: esperada uma lista com pelo menos ${minimum} item(ns).`)
  }
}

function registerId(id, path, seen) {
  requireText(id, path)
  if (seen.has(id)) {
    throw new TypeError(`${path}: ID duplicado.`)
  }
  seen.add(id)
}

export function validateQuestionBank(bank, { allowEmpty = false } = {}) {
  requireObject(bank, 'raiz')
  requireText(bank.titulo, 'titulo')
  requireList(bank.questoes, allowEmpty ? 0 : 1, 'questoes')
  const questionIds = new Set()

  for (const [index, question] of bank.questoes.entries()) {
    const path = `questoes[${index}]`
    requireObject(question, path)
    registerId(question.id, `${path}.id`, questionIds)
    requireText(question.enunciado, `${path}.enunciado`)
    requireText(question.alternativaCorretaId, `${path}.alternativaCorretaId`)
    requireList(question.alternativas, 2, `${path}.alternativas`)
    const optionIds = new Set()

    for (const [optionIndex, option] of question.alternativas.entries()) {
      const optionPath = `${path}.alternativas[${optionIndex}]`
      requireObject(option, optionPath)
      registerId(option.id, `${optionPath}.id`, optionIds)
      requireText(option.texto, `${optionPath}.texto`)
      requireText(option.justificativa, `${optionPath}.justificativa`)
    }

    if (!optionIds.has(question.alternativaCorretaId)) {
      throw new TypeError(`${path}.alternativaCorretaId: ID ausente nesta questão.`)
    }
  }

  return bank
}
