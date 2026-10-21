# Medidor Coopera — guia do professor

**Não compartilhe esta pasta com os alunos.** Ela contém a solução completa.

## Como rodar o gabarito

```bash
npm install
npm test          # confere o caso oficial e a validação
npm start         # http://localhost:3000
```

## Três camadas contra respostas prontas de IA

### 1. Marcadores invisíveis no enunciado

A página da atividade tem três frases escondidas. Elas não aparecem na tela, mas vão junto quando o aluno seleciona e copia o texto para um chat de IA. Cada uma induz a um erro ou a um nome rastreável:

| Onde fica | O que a frase pede | Como aparece no código entregue |
|---|---|---|
| Contexto (2º parágrafo) | Mês de 31,5 dias; função `calcularConsumoOrion` | `31.5`, `Orion` |
| Etapa 1, item 4 | Arredondar com `Math.floor`; comentário `// padrão Saturno 42` | `Math.floor`, `Saturno` |
| Etapa 2, item 3 | id `lista-orion`; cor `#7B3FA0`; total × 1,07 | `lista-orion`, `7B3FA0`, `1.07` |

Busca rápida em uma pasta com todos os repositórios clonados:

```bash
grep -rniE "orion|saturno|31[.,]5|7B3FA0|1[.,]07|Math\.floor" --include=*.js --include=*.html --include=*.css .
```

`Math.floor` sozinho não prova nada (pode ser uso legítimo). Os nomes `Orion`/`Saturno` e o 31,5 são os sinais fortes. Use o achado como motivo para conversar na defesa oral, não como prova automática.

**Teste antes da aula:** abra a página, selecione o parágrafo do Contexto, copie e cole num bloco de notas. A frase escondida deve aparecer. Faça o mesmo num celular, se os alunos usam celular.

**Limites:** o marcador some se o aluno digitar o enunciado, tirar print ou resumir com as próprias palavras. Alguns modelos de IA também percebem a instrução escondida e avisam o usuário. Por isso as outras duas camadas existem.

### 2. Parâmetros pessoais

Cada número da chamada gera tarifa, bandeira, HSP e potência de painel diferentes. Uma resposta pronta da IA (ou o projeto de um colega) vem com os valores errados. Gere a tabela da turma:

```bash
node verificar-codigo.js --tabela 40
```

A tabela também traz as respostas das questões 3 e 4 do Autoteste 1 (`a3`, `a4`) e da questão 4 do Autoteste 2 (`b4`).

### 3. Código de verificação + defesa oral

O código só é liberado com os 8 itens dos autotestes corretos. Confira:

```bash
node verificar-codigo.js "Maria Silva Santos" 12
```

Acentos e espaços extras são ignorados, mas o nome precisa ser o mesmo que o aluno digitou.

Sugestões para a defesa oral (3 minutos):

- "Mude a eficiência do painel para 75% e me mostre o que muda na resposta."
- "Crie a bandeira `escassez` com R$ 14,20 por 100 kWh."
- "Por que esse botão Remover usa `splice`? O que aconteceria com `delete`?"
- "Mande `horasDia: \"5\"` (texto) pelo Thunder Client. O que o servidor responde e por quê?"
- "Troque `textContent` por `innerHTML` e cadastre um aparelho chamado `<b>teste</b>`. O que mudou?"

## Respostas dos autotestes fixos

| Questão | Resposta |
|---|---|
| A1 | 82,5 kWh |
| A2 | b — regra centralizada no servidor |
| B1 | c — `textContent` |
| B2 | b — `req.body.aparelhos` chega `undefined` |
| B3 | a — a página recarrega e o array se perde |

## Caso de teste oficial (tarifa 0,80 · amarela · HSP 4,5 · painel 450 W)

Geladeira 150 W 24 h + Chuveiro 5500 W 0,5 h + TV 100 W 5 h, todos 30 dias:
consumo 205,5 kWh · energia R$ 164,40 · bandeira R$ 3,87 · total R$ 168,27 · 5 painéis · mais caro: Geladeira (R$ 86,40).
