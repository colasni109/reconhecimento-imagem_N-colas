# Projeto de Exemplos em Python

Este repositório contém exemplos de código em Python voltados para:
- verificação de números primos,
- cálculo de estatísticas,
- depuração e correção de código,
- uso de entradas do usuário e formatação de saída.

## Estrutura do projeto

- `debug.py`
  - Sistema de cálculo de fatura com imposto e desconto.
  - Recebe entradas do usuário para nome, quantidades e preços dos itens, aplica imposto fixo de 10% e desconto percentual.
  - Inclui comentários explicando decisões de lógica.

- `num_primo.py`
  - Função `eh_primo(numero)` que verifica se um número é primo.
  - Usa otimizações como exclusão de pares e verificação até a raiz quadrada.
  - Inclui uma seção de teste que imprime resultados para alguns números.

- `refatoracao.py`
  - Função `calcular_estatisticas(numeros)` que retorna total, média, máximo e mínimo de uma lista numérica.
  - Realiza validação de entrada e usa funções built-in do Python para cálculo.

- `explicacao-debug.md`
  - Documentação detalhada dos erros encontrados e corrigidos no `debug.py`.

- `explicacao_num_primo.md`
  - Explicação linha a linha da função `eh_primo()` presente em `num_primo.py`.

- `explicacao_refaturacao.md`
  - Explicação da refatoração do código e dos pontos de melhoria do `refatoracao.py`.

## Requisitos

- Python 3.8 ou superior

## Como executar

Abra o terminal na pasta `test-assistent-code` e execute um dos arquivos:

```bash
python debug.py
python num_primo.py
python refatoracao.py
```

## O que cada script faz

### `debug.py`

- Solicita o nome do cliente.
- Pergunta a quantidade e preço de 3 itens.
- Calcula subtotal, imposto de 10% e desconto percentual informado.
- Exibe a fatura formatada com valores em reais.

### `num_primo.py`

- Define a função `eh_primo(numero)`.
- Retorna `True` para números primos e `False` caso contrário.
- Testa a função com uma lista de valores quando executado diretamente.

### `refatoracao.py`

- Define a função `calcular_estatisticas(numeros)`.
- Valida se a lista não está vazia e se todos os valores são numéricos.
- Retorna uma tupla com total, média, máximo e mínimo.

## Documentação adicional

Os arquivos `explicacao-debug.md`, `explicacao_num_primo.md` e `explicacao_refaturacao.md` trazem comentários mais detalhados sobre:
- tipos de erro e correção em `debug.py`,
- otimização e raciocínio da função de verificação de primos,
- boas práticas e melhorias na refatoração do cálculo de estatísticas.

## Sugestões de uso

- Estude os arquivos de explicação para entender melhor a lógica e as correções.
- Use os scripts como base para aprender manipulação de entrada/saída e validação de dados.
- Experimente modificar os exemplos para adicionar novos itens, funções ou cálculos.

## Licença

Este projeto é um conjunto de exemplos educativos e está livre para uso pessoal e estudos.
