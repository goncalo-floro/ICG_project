import * as THREE from 'three';

const POSICOES = [[-20, 0, -5], [-20, 0, 5], [20, 0, -5], [20, 0, 5]];

export function criarSlots(scene) {
    POSICOES.forEach((pos, i) => criarSlotMachine(scene, pos, i));
    return [];
}

function criarSlotMachine(scene, [x, y, z], idx) {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    g.rotation.y = x < 0 ? Math.PI / 2 : -Math.PI / 2;

    const mCaixa = new THREE.MeshStandardMaterial({ color: 0x1a0d05, roughness: 0.4, metalness: 0.35 });
    const mOuro  = new THREE.MeshStandardMaterial({ color: 0xD4AF37, roughness: 0.18, metalness: 0.95 });
    const mEcra  = new THREE.MeshStandardMaterial({ color: 0x060404, roughness: 0.05, metalness: 0.6 });
    const mVerm  = new THREE.MeshStandardMaterial({ color: 0xbb1818, roughness: 0.3 });

    // Corpo
    const corpo = new THREE.Mesh(new THREE.BoxGeometry(0.95, 2.1, 0.65), mCaixa);
    corpo.position.y = 1.05; corpo.castShadow = true; g.add(corpo);

    // Frame
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.0, 2.16, 0.62), mOuro);
    frame.position.y = 1.05; g.add(frame);
    const interior = new THREE.Mesh(new THREE.BoxGeometry(0.92, 2.08, 0.63), mCaixa);
    interior.position.y = 1.05; interior.position.z = 0.01; g.add(interior);

    // Painel do ecrã
    const ecra = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.48, 0.04), mEcra);
    ecra.position.set(0, 1.52, 0.35); g.add(ecra);

    // Cilindros
    const cilindros = [];
    [-0.2, 0, 0.2].forEach((cx, ci) => {
        const cg = new THREE.Group();
        cg.position.set(cx, 1.52, 0.33);
        const cil = new THREE.Mesh(
            new THREE.CylinderGeometry(0.13, 0.13, 0.42, 14),
            new THREE.MeshStandardMaterial({ color: 0x2a1608, roughness: 0.3, metalness: 0.4 })
        );
        cil.rotation.z = Math.PI / 2;
        cg.add(cil);
        const sIdx = Math.floor(Math.random() * 5);
        const sMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, emissive: 0x000000 });
        const sMesh = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.01, 0.09), sMat);
        sMesh.position.set(0, 0.14, 0);
        cg.add(sMesh);
        g.add(cg);
    });

    // Botão/alavanca
    const alavanca = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), mVerm);
    alavanca.position.set(0.52, 1.2, 0); g.add(alavanca);
    const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.38, 7), mOuro);
    haste.rotation.z = Math.PI / 2; haste.position.set(0.5, 1.2, 0); g.add(haste);

    // Base
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.18, 0.85), mOuro);
    base.position.y = 0.09; g.add(base);

    // Topo decorativo (sem luz)
    const topo = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.22, 0.5), mOuro);
    topo.position.y = 2.21; g.add(topo);

    scene.add(g);
}

// Funções vazias (ainda as falta fazer)
export function atualizarSlots(slots, delta) {}
export function verificarProximidadeSlot(jogador, slots) { return null; }