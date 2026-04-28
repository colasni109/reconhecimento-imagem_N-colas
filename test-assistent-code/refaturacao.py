def calcular_estatisticas(numeros):
    """
    Calcula estatísticas básicas de uma lista de números.
    
    Args:
        numeros (list): Lista contendo números inteiros ou float
        
    Returns:
        tuple: (total, media, maximo, minimo) - tupla com as 4 estatísticas
        
    Raises:
        ValueError: Se a lista estiver vazia
        TypeError: Se algum elemento não for numérico
    """
    # Validação: lista não pode estar vazia
    if not numeros:
        raise ValueError("A lista não pode estar vazia!")
    
    # Validação: todos os elementos devem ser numéricos
    if not all(isinstance(num, (int, float)) for num in numeros):
        raise TypeError("Todos os elementos devem ser números!")
    
    # Calcula o total usando a função built-in sum()
    total = sum(numeros)
    
    # Calcula a média: soma total dividida pela quantidade
    media = total / len(numeros)
    
    # Encontra o valor máximo usando a função built-in max()
    maximo = max(numeros)
    
    # Encontra o valor mínimo usando a função built-in min()
    minimo = min(numeros)
    
    return total, media, maximo, minimo


# Executa apenas se o arquivo for rodado diretamente (não importado)
if __name__ == "__main__":
    # Lista de números para análise
    numeros = [23, 7, 45, 2, 67, 12, 89, 34, 56, 11]
    
    # Chama a função e armazena os resultados em variáveis descritivas
    total, media, maximo, minimo = calcular_estatisticas(numeros)
    
    # Exibe os resultados usando f-strings (formato mais moderno)
    print(f"Total:  {total}")
    print(f"Média:  {media:.1f}")
    print(f"Maior:  {maximo}")
    print(f"Menor:  {minimo}")