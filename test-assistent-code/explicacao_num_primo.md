# Explicação Linha a Linha - Função `eh_primo()`

## Definição da Função

```python
def eh_primo(numero):
```
- **`def`**: Palavra-chave para definir uma função em Python
- **`eh_primo`**: Nome da função (segue a convenção snake_case)
- **`(numero)`**: Parâmetro que a função recebe - o número a ser verificado

---

## Docstring (Documentação)

```python
    """
    Verifica se um número é primo.
    
    Args:
        numero (int): O número a ser verificado
        
    Returns:
        bool: True se o número é primo, False caso contrário
    """
```
- **Docstring**: Texto entre aspas triplas que documenta a função
- **Descrição**: O que a função faz
- **Args**: Lista de argumentos e seus tipos
- **Returns**: Explica o valor retornado e seu tipo

---

## Validações Iniciais

### 1️⃣ Primeira Validação - Números Menores que 2

```python
    # Números menores que 2 não são primos
    if numero < 2:
        return False
```
- **Lógica**: Números negativos, 0 e 1 NÃO são primos por definição
- **`return False`**: Sai da função e retorna `False` imediatamente
- **Eficiência**: Se a condição for verdadeira, a função termina aqui

---

### 2️⃣ Segunda Validação - O Número 2

```python
    # 2 é o único número primo par
    if numero == 2:
        return True
```
- **Lógica**: 2 é o ÚNICO número primo que é par
- **`return True`**: Confirma que 2 é primo e sai da função
- **Otimização**: Trata o caso especial antes de verificar números pares

---

### 3️⃣ Terceira Validação - Números Pares

```python
    # Números pares maiores que 2 não são primos
    if numero % 2 == 0:
        return False
```
- **`numero % 2`**: Operador módulo (resto da divisão por 2)
- **`== 0`**: Se o resto for 0, significa que é divisível por 2
- **`return False`**: Nenhum número par maior que 2 é primo
- **Otimização**: Eliminamos metade dos números de verificação

---

## Loop Principal de Verificação

```python
    # Verifica divisibilidade por números ímpares até a raiz quadrada
    for i in range(3, int(numero ** 0.5) + 1, 2):
```

**Quebra da sintaxe:**

| Componente | Significado |
|------------|-------------|
| `for i in` | Inicia um loop que percorre valores |
| `range(3, ...)` | Começa do número 3 (pulou 1 e 2) |
| `int(numero ** 0.5)` | Raiz quadrada do número convertida para inteiro |
| `+ 1` | Adiciona 1 para incluir a raiz quadrada |
| `, 2)` | Incrementa de 2 em 2 (só números ímpares) |

**Por que até a raiz quadrada?**
- Se um número N tem um divisor maior que √N, também tem um menor que √N
- Exemplo: 36 = 6 × 6. Não precisamos testar além de 6

**Por que apenas ímpares?**
- Já eliminamos todos os pares anteriormente
- Economiza 50% do processamento

---

```python
        if numero % i == 0:
            return False
```
- **`numero % i == 0`**: Verifica se `i` divide `numero` exatamente
- **`return False`**: Se encontrar um divisor, o número NÃO é primo
- Sai da função imediatamente (não testa outros números)

---

## Resultado Final

```python
    return True
```
- Se chegou aqui, o número passou em todas as verificações
- Retorna `True` indicando que o número É primo

---

## Seção de Testes

```python
if __name__ == "__main__":
```
- **`__name__ == "__main__"`**: Verifica se o arquivo está sendo executado diretamente
- Evita que este código execute quando o arquivo é importado em outro programa

---

```python
    numeros_teste = [1, 2, 3, 4, 5, 10, 17, 20, 29, 100]
```
- **Lista**: Cria uma lista com números para testar
- Inclui: números pequenos, pares, ímpares e não-primos

---

```python
    for num in numeros_teste:
        resultado = eh_primo(num)
        print(f"{num} é primo? {resultado}")
```

**Linha por linha:**
1. **`for num in numeros_teste:`** - Percorre cada número da lista
2. **`resultado = eh_primo(num)`** - Chama a função com o número e armazena o resultado
3. **`print(f"...")`** - Exibe o resultado usando f-string (string formatada)
4. **`{num}` e `{resultado}`** - Insere o valor das variáveis no texto

**Exemplo de saída:**
```
1 é primo? False
2 é primo? True
3 é primo? True
4 é primo? False
...
```

---

## 📊 Resumo da Eficiência

| Otimização | Ganho |
|------------|-------|
| Verifica até √N, não N | ~√N iterações |
| Pula números pares | -50% iterações |
| Retorna cedo se encontra divisor | Melhor caso bem mais rápido |

**Complexidade**: O(√n) - Muito eficiente para números grandes!
