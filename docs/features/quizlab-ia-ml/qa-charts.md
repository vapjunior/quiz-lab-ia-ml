# Validação do banco real e dos gráficos

**Veredito:** aprovado para TASK-002, TASK-003 e TASK-004 no clone de trabalho. O banco canônico é idêntico ao JSON entregue. O SHA-256 do arquivo validado é `c85526a1f8bd3e1844a0de8693ce07505b2de3c1765b6f4043cee160e8bfb5fc`.

## Fidelidade e interpretação

- `q06` preserva a dispersão de resíduos, a referência em zero e os eixos em milhares de dólares. O enunciado descreve o padrão visual que a questão pede para interpretar.
- `q22` preserva escalas, legenda, marcadores e estilos de linha das curvas de treino e validação. O enunciado fornece os graus e os pares de RMSE correspondentes.
- `q28` preserva o eixo em dias, a escala de vendas em unidades e os picos. O enunciado dá os dias de pico e descreve as variações de nível e amplitude.

Os três PNGs, de 690 × 316 px, foram comparados com o material entregue por SHA-256 no navegador tanto dentro da questão quanto no diálogo. A inspeção de quatro capturas de `q22` a 360 e 1440 px confirmou a figura inteira no enunciado e a leitura aproximada dos rótulos no diálogo, com acesso à parte direita por rolagem em tela estreita. A ampliação preserva a resolução da fonte e não infere observações adicionais a partir dos pixels.

## Execução

| Verificação                           | Resultado                                                                       |
| ------------------------------------- | ------------------------------------------------------------------------------- |
| Node.js                               | 24.22.3                                                                         |
| `npm ci --offline`                    | Concluiu com sucesso                                                            |
| `cmp` do JSON original com o canônico | Arquivos idênticos                                                              |
| `npm run validate:questions`          | 40 questões válidas                                                             |
| `npm run lint`                        | Passou                                                                          |
| `npm run format:check`                | Passou                                                                          |
| `npm run test:unit`                   | 28 testes passaram                                                              |
| `npm run build`                       | Passou, com artefatos em `dist`                                                 |
| `npm run test:e2e -- --workers=3`     | 13 testes passaram, incluindo 9 casos com gráficos e uma rodada das 40 questões |

Os casos em Chromium verificam larguras de 360, 768 e 1440 px, proporção da figura, ausência de rolagem horizontal do documento, rolagem por teclado dentro da figura ampliada, fechamento por botão e `Esc`, retorno de foco, gabarito e justificativa. O sandbox inicialmente impediu a abertura do servidor local (`EPERM`). A execução autorizada confirmou o resultado depois do ajuste de medição da proporção da imagem.
