# PRD | QuizLab de Aprendizagem de Máquina

Este projeto adapta a especificação do `QuizLab_PRD_Prompt_Codex.md` da primeira edição do QuizLab à turma de Inteligência Artificial. A lógica de revisão, o contrato do banco e a arquitetura estática continuam compartilhando a mesma base conceitual.

## Escopo

| ID      | Requisito                                                    | Critério de aceite                                                                                                                                                                                                         |
| ------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| REQ-001 | Preparar uma edição própria da disciplina.                   | AC-001 · O repositório local aponta para `vapjunior/quiz-lab-ia-ml`. A página identifica Aprendizagem de Máquina e Inteligência Artificial. O banco canônico está pronto para receber o JSON.                              |
| REQ-002 | Validar e carregar o material fornecido.                     | AC-002 · O banco segue o contrato no README e tem pelo menos uma questão. O validador identifica campos inválidos, IDs duplicados e referências incorretas no gabarito. O conteúdo do anexo será preservado na integração. |
| REQ-003 | Manter o fluxo de revisão do QuizLab.                        | AC-003 · Questões e alternativas são embaralhadas por rodada sem alterar o gabarito, que usa IDs. Há uma resposta por questão e feedback explicado, seguido de resultado, revisão dos erros e opção de refazer.            |
| REQ-004 | Apresentar conteúdo didático com segurança e acessibilidade. | AC-004 · O app renderiza Markdown e trechos de código sem executar conteúdo. O fluxo funciona por teclado e em telas estreitas. A revisão acontece no navegador, com progresso em memória.                                 |
| REQ-005 | Preparar a distribuição estática.                            | AC-005 · Instalação, lint, formatação, validação, testes e build passam com o banco real. O build resulta em `dist` e a publicação segue uma etapa posterior de validação.                                                 |

## Etapas

1. **Preparação local.** Configurar o clone, adaptar a base, documentar o contrato e exibir o estado de banco pendente. O ciclo de revisão só é iniciado quando houver material válido.
2. **Recebimento do JSON.** Integrar questões, alternativas, gabarito e justificativas. Derivar a quantidade e os tópicos da fonte recebida.
3. **Validação e entrega.** Conferir banco, resultado, revisão de erros e responsividade com conteúdo real. A publicação no GitHub e eventual deploy seguem o próximo passo combinado com o usuário.

O conteúdo didático, o total de questões e os títulos dos tópicos dependem do material fornecido pela turma.
