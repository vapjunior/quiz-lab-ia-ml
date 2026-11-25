# Design do QuizLab

## Bancada de revisão

A página combina o papel morno de uma apostila com um editor escuro. O cabeçalho identifica a revisão e, durante uma rodada, mostra a quantidade de respostas confirmadas. O texto ocupa uma faixa de leitura confortável e os blocos de código usam a largura útil do conteúdo. A abertura identifica a disciplina e o curso. Enquanto o banco estiver vazio, exibe a informação de que o questionário aguarda as perguntas.

## Cor e superfícies

| Token       | Valor     | Papel                    |
| ----------- | --------- | ------------------------ |
| `--paper`   | `#f6f5f0` | Fundo                    |
| `--surface` | `#fffefa` | Alternativas e painéis   |
| `--ink`     | `#20213a` | Texto principal          |
| `--muted`   | `#5d5e70` | Informação secundária    |
| `--line`    | `#d5d3df` | Divisórias               |
| `--accent`  | `#33308b` | Ação principal e seleção |
| `--focus`   | `#4d45c5` | Contorno de foco         |
| `--success` | `#17573c` | Resposta correta         |
| `--error`   | `#8f302d` | Resposta incorreta       |

O editor usa fundo `#101b31`, barra `#1a2945`, texto `#eff4ff` e numeração `#a9bbd8`. Seu foco tem cor `#a1c1ff`, com contraste no fundo escuro.

## Tipografia e espaço

A pilha sans de sistema evita downloads de fontes e mantém a leitura confortável. A pilha monoespaçada serve ao código e aos indicadores numéricos. O texto usa base de 16 px e entrelinha de 1,6. Os espaçamentos se apoiam em 4, 8, 12, 16, 24, 32 e 48 px. O interior da abertura ocupa até 72 rem e as questões usam até 55 rem.

## Interação e adaptação

Controles principais têm pelo menos 44 px e contorno de foco visível. Os radios têm controle nativo com conteúdo rico ao lado. A resposta correta e a errada recebem texto e ícone. A rolagem horizontal acontece no trecho de código e os botões permanecem no fluxo da página. Os trechos das alternativas passam para baixo dos controles em telas estreitas, e os controles de avanço ocupam a largura disponível em telas estreitas. O movimento breve de entrada e as transições de estado respeitam a preferência de movimento reduzido.

## Figuras científicas

As figuras preservam proporção, unidades, escalas e cores da fonte. A visão inicial mantém o gráfico inteiro na largura do enunciado, e a ação de ampliação permite ler os rótulos com rolagem contida no visualizador. O controle de ampliação funciona por teclado, o diálogo fecha por botão ou `Esc` e o foco retorna ao controle que o abriu.
