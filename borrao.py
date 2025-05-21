import pygame
import cv2
import numpy as np
import sys

pygame.init()
largura, altura = 800, 600
tela = pygame.display.set_mode((largura, altura))
pygame.display.set_caption("Jogo com Sliders")

fonte = pygame.font.SysFont("arial", 30)

def carregar_e_borrar_imagem(caminho_imagem):
    imagem_original = cv2.imread(caminho_imagem)
    if imagem_original is None:
        print("Erro ao carregar a imagem.")
        pygame.quit()
        sys.exit()

    imagem_original = cv2.rotate(imagem_original, cv2.ROTATE_90_COUNTERCLOCKWISE) 
    imagem_original = cv2.flip(imagem_original, 0)  

    imagem_original = cv2.resize(imagem_original, (600, 750))
    imagem_borrada = cv2.GaussianBlur(imagem_original, (21, 21), 0)
    imagem_transicao = cv2.addWeighted(imagem_original, 0.3, imagem_borrada, 0.7, 0)
    return imagem_original, imagem_borrada, imagem_transicao

imagem_original, imagem_borrada, imagem_transicao = carregar_e_borrar_imagem("bateria_litio.png")

def cv2para_surface(img):
    return pygame.surfarray.make_surface(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))

imagem_borrada_pg = cv2para_surface(imagem_borrada)
imagem_original_pg = cv2para_surface(imagem_original)
imagem_transicao_pg = cv2para_surface(imagem_transicao)

pos_x = 30
pos_y = -10

slider1_x = 300
slider2_x = 300
slider_y1 = 500
slider_y2 = 540
slider_raio = 12
arrastando1 = False
arrastando2 = False

limite_esquerda = 250
limite_direita = 550

imagem_revelada = False
mostrar_botao = False
relogio = pygame.time.Clock()

# Cores
cor_trilha = (255, 255, 255)
cor_botao = (80, 180, 80)
cor_hover = (100, 220, 100)

botao_rect = pygame.Rect(largura // 2 - 100, altura // 2 + 50, 200, 50)

while True:
    mouse = pygame.mouse.get_pos()
    clique = pygame.mouse.get_pressed()[0]

    for evento in pygame.event.get():
        if evento.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

        elif evento.type == pygame.MOUSEBUTTONDOWN:
            mx, my = evento.pos
            if (mx - slider1_x) ** 2 + (my - slider_y1) ** 2 <= slider_raio ** 2:
                arrastando1 = True
            elif (mx - slider2_x) ** 2 + (my - slider_y2) ** 2 <= slider_raio ** 2:
                arrastando2 = True

        elif evento.type == pygame.MOUSEBUTTONUP:
            arrastando1 = False
            arrastando2 = False

            if imagem_revelada and botao_rect.collidepoint(mouse):
                print("Continuar clicado.")
                pygame.quit()
                sys.exit()

        elif evento.type == pygame.MOUSEMOTION:
            if arrastando1:
                slider1_x = max(limite_esquerda, min(evento.pos[0], limite_direita))
            if arrastando2:
                slider2_x = max(limite_esquerda, min(evento.pos[0], limite_direita))

    if abs(slider1_x - 400) < 5 and abs(slider2_x - 400) < 5:
        imagem_revelada = True
        mostrar_botao = True
    elif abs(slider1_x - 400) < 25 and abs(slider2_x - 400) < 25:
        imagem_atual = imagem_transicao_pg
    else:
        imagem_atual = imagem_borrada_pg

    tela.fill((0, 0, 0))  # Limpa tela com preto

    if imagem_revelada:
        tela.blit(imagem_original_pg, (pos_x, pos_y))
    else:
        tela.blit(imagem_atual, (pos_x, pos_y))

    # Trilhas
    pygame.draw.line(tela, cor_trilha, (limite_esquerda, slider_y1), (limite_direita, slider_y1), 6)
    pygame.draw.line(tela, cor_trilha, (limite_esquerda, slider_y2), (limite_direita, slider_y2), 6)

    # Sliders
    pygame.draw.circle(tela, (255, 100, 100), (slider1_x, slider_y1), slider_raio)
    pygame.draw.circle(tela, (100, 255, 100), (slider2_x, slider_y2), slider_raio)

    if mostrar_botao:
        texto = fonte.render("Recompensa concebida", True, (255, 255, 255))
        tela.blit(texto, (largura // 2 - texto.get_width() // 2, altura // 2 - 30))

        if botao_rect.collidepoint(mouse):
            pygame.draw.rect(tela, cor_hover, botao_rect, border_radius=10)
        else:
            pygame.draw.rect(tela, cor_botao, botao_rect, border_radius=10)

        texto_botao = fonte.render("Continuar", True, (255, 255, 255))
        tela.blit(texto_botao, (botao_rect.centerx - texto_botao.get_width() // 2,
                                botao_rect.centery - texto_botao.get_height() // 2))

    pygame.display.flip()
    relogio.tick(60)
