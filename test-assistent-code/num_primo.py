def eh_primo(numero):
    """
    Verifica se um número é primo.
    
    Args:
        numero (int): O número a ser verificado
        
    Returns:
        bool: True se o número é primo, False caso contrário
    """
    # Números menores que 2 não são primos
    if numero < 2:
        return False
    
    # 2 é o único número primo par
    if numero == 2:
        return True
    
    # Números pares maiores que 2 não são primos
    if numero % 2 == 0:
        return False
    
    # Verifica divisibilidade por números ímpares até a raiz quadrada
    for i in range(3, int(numero ** 0.5) + 1, 2):
        if numero % i == 0:
            return False
    
    return True


# Exemplos de uso
if __name__ == "__main__":
    # Testando alguns números
    numeros_teste = [1, 2, 3, 4, 5, 10, 17, 20, 29, 100]
    
    for num in numeros_teste:
        resultado = eh_primo(num)
        print(f"{num} é primo? {resultado}")
