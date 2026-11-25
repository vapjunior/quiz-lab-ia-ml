import { expect, test } from '@playwright/test'
import bank from '../../src/data/questoes.json' with { type: 'json' }

const questions = new Map(bank.questoes.map((question) => [question.id, question]))
const questionScreen = (page) => page.locator('section[data-question-id]')
const button = (page, name) => page.getByRole('button', { name, exact: true })

async function currentQuestion(page) {
  const screen = questionScreen(page)
  await expect(screen).toBeVisible()
  const question = questions.get(await screen.getAttribute('data-question-id'))
  expect(question).toBeDefined()
  return question
}

async function select(page, optionId) {
  for (const radio of await questionScreen(page).getByRole('radio').all()) {
    if ((await radio.getAttribute('value')) === optionId) {
      await radio.check()
      return
    }
  }
  throw new Error(`Alternativa não encontrada: ${optionId}`)
}

test('confirma respostas, revisa o erro e reinicia sem persistência', async ({ page }) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await button(page, 'Começar revisão').click()
  const progress = page.getByRole('progressbar')
  await expect(progress).toHaveAttribute('value', '0')
  const visitedIds = new Set()
  let wrongQuestion

  for (let index = 0; index < questions.size; index += 1) {
    const question = await currentQuestion(page)
    visitedIds.add(question.id)
    const answer = button(page, 'Responder')
    await expect(answer).toBeDisabled()
    if (index === 0) {
      wrongQuestion = question
      const wrongOption = question.alternativas.find(
        ({ id }) => id !== question.alternativaCorretaId,
      )
      await select(page, question.alternativaCorretaId)
      await select(page, wrongOption.id)
    } else {
      await select(page, question.alternativaCorretaId)
    }
    await answer.click()
    const feedback = page.getByRole('region', { name: 'Entenda a correção' })
    await expect(
      feedback.getByRole('heading', {
        name: index === 0 ? 'Resposta incorreta' : 'Resposta correta',
        level: 3,
      }),
    ).toBeVisible()
    await expect(feedback.locator('.feedback__reason').first()).toBeVisible()
    await expect(progress).toHaveAttribute('value', String(index + 1))
    await button(page, index + 1 === questions.size ? 'Ver resultado' : 'Próxima questão').click()
  }

  expect(visitedIds.size).toBe(questions.size)
  await expect(page.getByRole('heading', { name: 'Resultado da rodada' })).toBeFocused()
  const percent = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(
    ((questions.size - 1) / questions.size) * 100,
  )
  await expect(page.locator('.result-stats dd')).toHaveText([
    String(questions.size - 1),
    String(questions.size),
    `${percent}%`,
  ])

  await button(page, 'Revisar erros').click()
  await expect(page.getByRole('heading', { name: 'Questão 1 de 1' })).toBeFocused()
  expect((await currentQuestion(page)).id).toBe(wrongQuestion.id)
  await expect(progress).toHaveAttribute('value', '0')
  await select(page, wrongQuestion.alternativaCorretaId)
  await button(page, 'Responder').click()
  await button(page, 'Ver resultado').click()
  await expect(page.locator('.result-stats dd')).toHaveText(['1', '1', '100%'])
  await expect(button(page, 'Revisar erros')).toHaveCount(0)
  await button(page, 'Refazer todas').click()
  await expect(progress).toHaveAttribute('max', String(questions.size))
  await expect(progress).toHaveAttribute('value', '0')
  await page.reload()
  await expect(button(page, 'Começar revisão')).toBeVisible()
  expect(errors).toEqual([])
})

for (const width of [360, 768, 1440]) {
  test.describe(`janela de ${width}px`, () => {
    test.use({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })

    test('exibe a pergunta sem transbordar a largura', async ({ page }) => {
      await page.goto('/')
      await button(page, 'Começar revisão').click()
      await expect(
        page.getByRole('heading', { name: `Questão 1 de ${questions.size}` }),
      ).toBeFocused()
      expect(
        await page.evaluate(
          () => globalThis.document.documentElement.scrollWidth <= globalThis.innerWidth,
        ),
      ).toBe(true)
    })
  })
}
