const options = [
  { id: 'a', texto: 'Opção A', justificativa: 'Justificativa A' },
  { id: 'b', texto: 'Opção B', justificativa: 'Justificativa B' },
  { id: 'c', texto: 'Opção C', justificativa: 'Justificativa C' },
  { id: 'd', texto: 'Opção D', justificativa: 'Justificativa D' },
]

export const fixtureBank = {
  titulo: 'Banco de teste',
  questoes: ['primeira', 'segunda', 'terceira'].map((id) => ({
    id,
    enunciado: `Enunciado de teste: ${id}`,
    alternativaCorretaId: 'a',
    alternativas: structuredClone(options),
  })),
}
