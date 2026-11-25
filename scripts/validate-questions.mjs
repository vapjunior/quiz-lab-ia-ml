import { readFile } from 'node:fs/promises'
import { validateQuestionBank } from '../src/domain/question-bank.js'

const source = process.argv[2] ?? new URL('../src/data/questoes.json', import.meta.url)

try {
  const bank = validateQuestionBank(JSON.parse(await readFile(source, 'utf8')))
  console.log(`Banco válido (${bank.questoes.length} questões).`)
} catch (error) {
  console.error(`Falha na validação do banco. ${error.message}`)
  process.exitCode = 1
}
