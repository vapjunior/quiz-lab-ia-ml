# QuizLab | Aprendizagem de Máquina

Questionário de revisão para a turma do curso de Inteligência Artificial, na disciplina de Aprendizagem de Máquina (Machine Learning). O projeto reaproveita a base Vue 3, Vite e JavaScript do QuizLab e mantém escolha, feedback e revisão dos erros no navegador.

## Banco da turma

O [banco canônico](src/data/questoes.json) contém as 40 questões do material recebido, com a ordem original, os gabaritos e as justificativas. Três enunciados incluem gráficos de resíduos de regressão (`q06`), RMSE de treino e validação (`q22`) e vendas diárias (`q28`). O comando de build valida o banco antes de gerar o projeto.

## Rodar localmente

Use Node.js 24 LTS, versão 24.15 ou superior dentro dessa série.

```sh
nvm use
npm ci
npm run dev
```

`npm run lint`, `npm run format:check` e `npm run test:unit` verificam o código e a formatação.

## Adicionar as questões

Edite `src/data/questoes.json` conforme o contrato abaixo e rode `npm run validate:questions`.

| Campo                             | Regra                                                                                                                          |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `titulo`                          | Texto que identifica a revisão.                                                                                                |
| `questoes`                        | Lista de questões, com pelo menos um item para publicar.                                                                       |
| `questoes[].id`                   | Texto único dentro do banco.                                                                                                   |
| `questoes[].enunciado`            | Texto da pergunta.                                                                                                             |
| `questoes[].alternativas`         | Pelo menos duas opções. Cada opção tem `id`, `texto` e `justificativa` preenchidos. Os IDs são únicos dentro da mesma questão. |
| `questoes[].alternativaCorretaId` | ID de uma das alternativas da própria questão.                                                                                 |

Enunciados, alternativas e justificativas aceitam Markdown. Blocos `python` ou `py` recebem realce de sintaxe e botão de cópia. Use `\n` para representar quebras de linha dentro de strings JSON e `\"` para aspas internas.

Os gráficos usam a sintaxe Markdown `![Descrição do gráfico](data:image/png;base64,BASE64_DO_PNG)`. A descrição identifica a figura e o enunciado apresenta os valores ou padrões necessários para a atividade. O visualizador mantém os pixels, as escalas e os rótulos da fonte, com ampliação e rolagem da imagem quando necessário. Use **Ampliar gráfico** para ler os eixos em telas estreitas e **Fechar** ou `Esc` para voltar à questão.

## Validação

```sh
npm run validate:questions
npm run build
npx playwright install chromium
npm run test:e2e
```

Os testes de navegador usam o banco carregado pelo app e conferem resposta, feedback, resultado, revisão de erros, recomeço e a fidelidade das figuras em três larguras de tela. A página é estática. A pontuação fica na memória até a página ser recarregada, e o gabarito integra os arquivos servidos ao navegador. Use o QuizLab como material de estudo.

Para uma publicação posterior na Vercel, importe `vapjunior/quiz-lab-ia-ml` como projeto Vite na raiz do repositório. Use `npm ci`, `npm run build` e `dist` como diretório de saída. A aplicação funciona sem variáveis de ambiente.

[PRD da disciplina](docs/PRD.md) · [Contexto do produto](PRODUCT.md) · [Sistema visual](DESIGN.md)
