# ICG_project

# Título: The Collector's Bet

## Conceito
Jogo 3D de exploração num salão de casino. O jogador controla uma personagem (teclas WASD) com o objetivo de percorrer o ambiente e recolher objetos especiais (fichas, cartas, troféus) cuja lista é apresentada no ecrã. A câmara, sempre em terceira pessoa, pode rodar livremente à volta do jogador (rato) e ajusta-se dinamicamente à posição deste, ocultando paredes ou obstáculos para facilitar a visibilidade.

## Cenário
Único espaço amplo (salão principal), dividido em áreas: entrada, zona de slot machines, mesas de jogo, etc.
Modelação com texturas e iluminação (ambiente, pontual, direcional) para recriar atmosfera de casino.
Slot machines interativas distribuídas pelo cenário(funcionalidade extra).

## Mecânica de Câmara
Transição inicial: vista fixa exterior enquanto o jogador está fora; ao atravessar a porta, a câmara passa para modo dinâmico em terceira pessoa.
Modo dinâmico: a câmara segue o jogador, permitindo rotação orbital com o rato. Consoante a posição do jogador, certas paredes ou elementos podem ser ocultados (por exemplo, através de fade ou corte) para manter o personagem visível.
Controlo: rotação da câmara com o botão direito do rato (ou movimento do rato) e movimentação(juntamente com o player) com WASD.

## Interatividade
Recolha de objetos: ao clicar com o lado esquerdo do rato; cada objeto recolhido desaparece e a lista é atualizada.
Slot machines: ao aproximar-se, surge um botão; ao pressionar tecla, os cilindros rodam (animação) com feedback visual, e existe a possibilidade de receber objetos extra.
