import pygame
import sys
from settings import *
from player import Player
from asteroid import Asteroid

class Game:
    def __init__(self):
        pygame.init()
        self.screen = pygame.display.set_mode((WIDTH, HEIGHT))
        pygame.display.set_caption("Space Shooter - Atari Style")
        self.clock = pygame.time.Clock()
        self.font = pygame.font.SysFont(None, 36)
        
        # Estados do jogo
        self.running = True
        self.game_over = False
        self.score = 0
        
        # Grupos de sprites
        self.all_sprites = pygame.sprite.Group()
        self.asteroids = pygame.sprite.Group()
        self.projectiles = pygame.sprite.Group()
        
        # Instanciar jogador
        self.player = Player(self.all_sprites, self.projectiles)
        self.all_sprites.add(self.player)
        
        # Evento customizado para o timer de geração de asteroides
        self.SPAWN_ASTEROID = pygame.USEREVENT + 1
        self.spawn_rate = 2000 # Inicialmente 2 segundos (mais fácil)
        pygame.time.set_timer(self.SPAWN_ASTEROID, self.spawn_rate)

    def events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False
            
            if not self.game_over:
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_SPACE:
                        self.player.shoot()
                
                # Gerar novo asteroide a cada tick do timer
                if event.type == self.SPAWN_ASTEROID:
                    asteroid = Asteroid(self.score)
                    self.all_sprites.add(asteroid)
                    self.asteroids.add(asteroid)
            else:
                # Se estiver em Game Over, reiniciar jogo pressionando 'R'
                if event.type == pygame.KEYDOWN and event.key == pygame.K_r:
                    self.__init__() # Reinicia todas as variáveis chamando o construtor

    def update(self):
        if not self.game_over:
            # Atualiza todas as lógicas de movimento (jogador, tiros, asteroides)
            self.all_sprites.update()
            
            # Verifica colisão entre projétil e asteroide
            # True, True indica que ambos (projétil e asteroide) devem ser removidos se houver colisão
            hits = pygame.sprite.groupcollide(self.asteroids, self.projectiles, True, True)
            for hit in hits:
                self.score += 10 # Aumenta 10 pontos por asteroide destruído
                
                # Aumenta a dificuldade progressivamente (diminui o tempo de spawn)
                new_spawn_rate = max(400, 2000 - (self.score * 5))
                if new_spawn_rate != self.spawn_rate:
                    self.spawn_rate = new_spawn_rate
                    pygame.time.set_timer(self.SPAWN_ASTEROID, self.spawn_rate)
            
            # Verifica colisão entre jogador e asteroides
            # False indica que não precisa remover o jogador do grupo no momento do hit
            player_hits = pygame.sprite.spritecollide(self.player, self.asteroids, False)
            if player_hits:
                self.game_over = True
            
            # Verifica se algum asteroide passou da tela (Game Over)
            for asteroid in self.asteroids:
                if asteroid.rect.top > HEIGHT:
                    self.game_over = True

    def draw(self):
        # Preencher o fundo
        self.screen.fill(BLACK)
        
        # Desenhar todos os sprites
        self.all_sprites.draw(self.screen)
        
        # Renderizar placar
        score_text = self.font.render(f"Pontos: {self.score}", True, WHITE)
        self.screen.blit(score_text, (10, 10))
        
        # Exibir mensagem de Game Over
        if self.game_over:
            game_over_text = self.font.render("GAME OVER - Pressione R para reiniciar", True, RED)
            text_rect = game_over_text.get_rect(center=(WIDTH/2, HEIGHT/2))
            self.screen.blit(game_over_text, text_rect)
            
        # Atualizar a tela
        pygame.display.flip()

    def run(self):
        while self.running:
            # Garante que o jogo vai rodar no FPS configurado
            self.clock.tick(FPS)
            self.events()
            self.update()
            self.draw()
            
        pygame.quit()
        sys.exit()

if __name__ == "__main__":
    game = Game()
    game.run()
