import pygame
from settings import *
from projectile import Projectile

class Player(pygame.sprite.Sprite):
    def __init__(self, all_sprites, projectiles):
        super().__init__()
        self.image = pygame.Surface((PLAYER_WIDTH, PLAYER_HEIGHT))
        self.image.fill(PLAYER_COLOR)
        self.rect = self.image.get_rect()
        
        # Posição inicial no centro inferior da tela
        self.rect.centerx = WIDTH // 2
        self.rect.bottom = HEIGHT - 20
        self.speedx = 0
        
        # Guardar referência aos grupos de sprites para poder atirar
        self.all_sprites = all_sprites
        self.projectiles = projectiles

    def update(self):
        self.speedx = 0
        keystate = pygame.key.get_pressed()
        
        # Movimentação pelas setas
        if keystate[pygame.K_LEFT]:
            self.speedx = -PLAYER_SPEED
        if keystate[pygame.K_RIGHT]:
            self.speedx = PLAYER_SPEED
            
        self.rect.x += self.speedx
        
        # Manter o jogador dentro dos limites da tela
        if self.rect.right > WIDTH:
            self.rect.right = WIDTH
        if self.rect.left < 0:
            self.rect.left = 0

    def shoot(self):
        # Cria um projétil na posição atual do jogador
        projectile = Projectile(self.rect.centerx, self.rect.top)
        self.all_sprites.add(projectile)
        self.projectiles.add(projectile)
