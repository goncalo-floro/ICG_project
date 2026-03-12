// player/player.js
import * as THREE from 'three';

export function criarJogador(scene) {
    const group = new THREE.Group();
    // ... criar corpo, cabeça
    scene.add(group);
    return group;
}

export function atualizarJogador(jogador, camera, keyState) {
    // movimento
}