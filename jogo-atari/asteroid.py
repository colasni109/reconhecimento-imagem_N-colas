import pygame
import random
from settings import *

class Asteroid(pygame.sprite.Sprite):
    def __init__(self, score=0):
        super().__init__()
        size = random.randint(ASTEROID_MIN_SIZE, ASTEROID_MAX_SIZE)
        self.image = pygame.Surface((size, size))
        self.image.fill(ASTEROID_COLOR)
        self.rect = self.image.get_rect()
        
        # Posição inicial aleatória no topo, fora da tela
        self.rect.x = random.randrange(0, WIDTH - self.rect.width)
        self.rect.y = random.randrange(-100, -40)
        
        # Velocidade com base na pontuação (aumenta a cada 50 pontos)
        bonus_speed = score // 50
        min_speed = ASTEROID_MIN_SPEED + bonus_speed
        max_speed = ASTEROID_MAX_SPEED + bonus_speed
        
        self.speedy = random.randint(min_speed, max_speed)

    def update(self):
        self.rect.y += self.speedy
