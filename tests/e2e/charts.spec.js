import { createHash } from 'node:crypto'
import { expect, test } from '@playwright/test'
import bank from '../../src/data/questoes.json' with { type: 'json' }

// Impressões digitais dos PNGs presentes no JSON original da turma.
const originalFigures = {
  q06: 'e7991c534a4ac66db3cb7fbec60ec9d4630b348b8880a148ab56db01598b6c6f',
  q22: '088519af781fcc5c11a960a35ad48014e5fbf7e0d981382ad7095c777863f6dd',
  q28: '01ee6f5864c5685e26508eba648b2251e0642899b4186ea86862b4f07d3340f9',
}

function pngDigest(source) {
  return createHash('sha256')
    .update(Buffer.from(source.replace('data:image/png;base64,', ''), 'base64'))
    .digest('hex')
}

async function openQuestion(page, id) {
  const questionIndex = bank.questoes.findIndex((question) => question.id === id)
  await page.addInitScript(
    ({ count, questionIndex }) => {
      // O embaralhamento troca esta questão com a primeira posição. As outras ficam no lugar.
      let swapIndex = count - 1
      Math.random = () => (swapIndex-- === questionIndex ? 0 : 1 - Number.EPSILON)
    },
    { count: bank.questoes.length, questionIndex },
  )
  await page.goto('/')
  await page.getByRole('button', { name: 'Começar revisão' }).click()
  const question = page.locator('section[data-question-id]')
  await expect(question).toHaveAttribute('data-question-id', id)
  return question
}

async function expectOriginalPng(image, expectedDigest) {
  await expect(image).toBeVisible()
  await expect(image).toHaveJSProperty('naturalWidth', 690)
  await expect(image).toHaveJSProperty('naturalHeight', 316)
  const source = await image.getAttribute('src')
  expect(source).toMatch(/^data:image\/png;base64,/)
  expect(pngDigest(source)).toBe(expectedDigest)
}

async function expectNoPageOverflow(page) {
  expect(
    await page.evaluate(
      () => globalThis.document.documentElement.scrollWidth <= globalThis.innerWidth,
    ),
  ).toBe(true)
}

for (const width of [360, 768, 1440]) {
  test.describe(`figuras científicas a ${width}px`, () => {
    test.use({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })

    for (const [id, expectedDigest] of Object.entries(originalFigures)) {
      test(`${id} preserva a figura, permite ampliá-la e mantém o gabarito`, async ({ page }) => {
        const bankQuestion = bank.questoes.find((question) => question.id === id)
        const [, description] = bankQuestion.enunciado.match(
          /!\[(.*?)\]\((data:image\/png;base64,[A-Za-z0-9+/=]+)\)/,
        )
        const expectedAnswer = bankQuestion.alternativas.find(
          ({ id }) => id === bankQuestion.alternativaCorretaId,
        )
        const question = await openQuestion(page, id)
        const figure = question.locator('figure.scientific-figure')
        const inlineImage = figure.getByRole('img', { name: description, exact: true })
        await expectOriginalPng(inlineImage, expectedDigest)
        await expectNoPageOverflow(page)
        const bounds = await inlineImage.boundingBox()
        expect(bounds.x).toBeGreaterThanOrEqual(0)
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(width)
        const ratioDelta = await inlineImage.evaluate(({ clientWidth, clientHeight }) =>
          Math.abs(clientHeight - (clientWidth * 316) / 690),
        )
        expect(ratioDelta).toBeLessThan(1)

        const expand = figure.getByRole('button', { name: 'Ampliar gráfico' })
        await expand.focus()
        await page.keyboard.press('Enter')
        const dialog = page.getByRole('dialog', { name: 'Gráfico ampliado' })
        await expect(dialog).toBeVisible()
        const close = dialog.getByRole('button', { name: 'Fechar' })
        await expect(close).toBeFocused()
        const expandedImage = dialog.getByRole('img', { name: description, exact: true })
        await expectOriginalPng(expandedImage, expectedDigest)
        expect((await expandedImage.boundingBox()).width).toBeGreaterThanOrEqual(690)
        await expectNoPageOverflow(page)
        if (width < 900) {
          const scrollArea = dialog.getByRole('region', { name: 'Área rolável do gráfico' })
          await scrollArea.focus()
          await page.keyboard.press('ArrowRight')
          await expect
            .poll(() => scrollArea.evaluate((element) => element.scrollLeft))
            .toBeGreaterThan(0)
          const rightEdge = await scrollArea.evaluate((element) => {
            element.scrollLeft = element.scrollWidth
            return element.scrollWidth - element.clientWidth - element.scrollLeft
          })
          expect(Math.abs(rightEdge)).toBeLessThan(1)
        }
        await page.keyboard.press('Escape')
        await expect(dialog).toBeHidden()
        await expect(expand).toBeFocused()
        await expand.click()
        await close.click()
        await expect(dialog).toBeHidden()
        await expect(expand).toBeFocused()

        await question.locator(`input[type="radio"][value="${expectedAnswer.id}"]`).check()
        await question.getByRole('button', { name: 'Responder' }).click()
        const feedback = question.getByRole('region', { name: 'Entenda a correção' })
        await expect(
          feedback.getByRole('heading', { name: 'Resposta correta', level: 3 }),
        ).toBeVisible()
        await expect(
          feedback.getByText(expectedAnswer.justificativa, { exact: true }),
        ).toBeVisible()
      })
    }
  })
}
