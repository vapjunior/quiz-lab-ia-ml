# QuizLab | Aprendizagem de Máquina

Questionário de revisão para a turma do curso de Inteligência Artificial, na disciplina de Aprendizagem de Máquina (Machine Learning). O projeto reaproveita a base Vue 3, Vite e JavaScript do QuizLab e mantém escolha, feedback e revisão dos erros no navegador.

## Estado da preparação

O banco [src/data/questoes.json](src/data/questoes.json) está vazio e contém apenas a estrutura inicial. Ao abrir o servidor de desenvolvimento, a página identifica a disciplina e informa que aguarda as questões. O comando de build de produção exige um banco válido com pelo menos uma questão.

## Rodar localmente

Use Node.js 24 LTS, versão 24.15 ou superior dentro dessa série.

```sh
nvm use
npm ci
npm run dev
```

`npm run lint`, `npm run format:check` e `npm run test:unit` verificam a base enquanto o banco está vazio.

## Adicionar as questões

Anexe ou cole o JSON completo para validação e integração no arquivo `src/data/questoes.json`. O contrato é o mesmo do QuizLab original.

| Campo                             | Regra                                                                                                                          |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `titulo`                          | Texto que identifica a revisão.                                                                                                |
| `questoes`                        | Lista de questões, com pelo menos um item para publicar.                                                                       |
| `questoes[].id`                   | Texto único dentro do banco.                                                                                                   |
| `questoes[].enunciado`            | Texto da pergunta.                                                                                                             |
| `questoes[].alternativas`         | Pelo menos duas opções. Cada opção tem `id`, `texto` e `justificativa` preenchidos. Os IDs são únicos dentro da mesma questão. |
| `questoes[].alternativaCorretaId` | ID de uma das alternativas da própria questão.                                                                                 |

Enunciados, alternativas e justificativas aceitam Markdown. Blocos `python` ou `py` recebem realce de sintaxe e botão de cópia. Use `\n` para representar quebras de linha dentro de strings JSON e `\"` para aspas internas.

## Depois de receber o banco

```sh
npm run validate:questions
npm run build
npx playwright install chromium
npm run test:e2e
```

Os testes de navegador usam o banco carregado pelo app e conferem resposta, feedback, resultado, revisão de erros e recomeço. A página é estática. A pontuação fica na memória até a página ser recarregada, e o gabarito integra os arquivos servidos ao navegador. Use o QuizLab como material de estudo.

Para uma publicação posterior na Vercel, importe `vapjunior/quiz-lab-ia-ml` como projeto Vite na raiz do repositório. Use `npm ci`, `npm run build` e `dist` como diretório de saída. A aplicação funciona sem variáveis de ambiente.

[PRD da disciplina](docs/PRD.md) · [Contexto do produto](PRODUCT.md) · [Sistema visual](DESIGN.md)
