import * as THREE from 'three';

const RAIO_RECOLHA = 4.0;

export const ITEM_LABELS = {
    ficha_ouro:  'Ficha de Ouro',
    ficha_prata: 'Ficha de Prata',
    carta_as:    'As de Espadas',
    trofeu:      'Trofeu',
    dado:        'Dado de Marfim',
    moeda:       'Moeda da Sorte',
};

const CONFIG = [
    { tipo: 'ficha_ouro',  valor: 50,  cor: 0xD4AF37, pos: [-8,  0, -5]  },
    { tipo: 'ficha_prata', valor: 25,  cor: 0xC8C8C8, pos: [8,   0, -12] },
    { tipo: 'carta_as',    valor: 100, cor: 0xfff8f0, pos: [-15, 0, -16] },
    { tipo: 'trofeu',      valor: 200, cor: 0xD4AF37, pos: [0,   0, -22] },
    { tipo: 'dado',        valor: 75,  cor: 0xf5f0e8, pos: [18,  0, -2]  },
    { tipo: 'moeda',       valor: 30,  cor: 0xFFD700, pos: [-18, 0, 5]   },
];

export function criarColecionaveis(scene) {
    return CONFIG.map(cfg => {
        const group = new THREE.Group();
        group.position.set(...cfg.pos);
        group.position.y = 1.1;

        const mesh = criarMesh(cfg);
        if (mesh) { mesh.castShadow = true; group.add(mesh); }

        // Aura de luz
        const aura = new THREE.PointLight(cfg.cor, 1.4, 3.2, 2.2);
        group.add(aura);

        // Glow sphere
        const glow = new THREE.Mesh(
            new THREE.SphereGeometry(0.07, 8, 8),
            new THREE.MeshStandardMaterial({
                color: cfg.cor, emissive: cfg.cor, emissiveIntensity: 3,
                transparent: true, opacity: 0.8,
            })
        );
        glow.position.y = 0.55;
        group.add(glow);

        // Label sprite flutuante
        const label = criarLabelSprite(ITEM_LABELS[cfg.tipo]);
        label.position.y = 1.0;
        group.add(label);

        scene.add(group);
        return {
            tipo: cfg.tipo, valor: cfg.valor, recolhido: false,
            group, mesh, aura, glow, label,
            posY0: group.position.y,
        };
    });
}

function criarLabelSprite(texto) {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 56;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 256, 56);
    ctx.font = 'bold 28px Georgia, serif';
    ctx.fillStyle = '#D4AF37';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(texto, 128, 28);
    const tex = new THREE.CanvasTexture(canvas);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
    sprite.scale.set(1.4, 0.31, 1);
    sprite.renderOrder = 500;
    return sprite;
}

export function atualizarColecionaveis(cols, delta) {
    const t = performance.now() * 0.001;
    cols.forEach((c, i) => {
        if (c.recolhido) return;
        c.group.position.y = c.posY0 + Math.sin(t * 1.4 + i * 1.1) * 0.13;
        c.group.rotation.y += delta * 1.1;
        if (c.aura) c.aura.intensity = 1.1 + Math.sin(t * 2.8 + i) * 0.4;
        if (c.glow) c.glow.material.opacity = 0.5 + Math.sin(t * 2 + i) * 0.28;
    });
}

export function verificarRecolha(jogador, cols) {
    for (const c of cols) {
        if (c.recolhido) continue;
        if (jogador.position.distanceTo(c.group.position) < RAIO_RECOLHA) return c;
    }
    return null;
}

export function getTotalRecolhidos(cols) {
    return cols.filter(c => c.recolhido).length;
}

// ─── Meshes ───────────────────────────────────────────────────────────────────
function criarMesh(cfg) {
    switch (cfg.tipo) {
        case 'ficha_ouro': case 'ficha_prata': return criarFicha(cfg.cor);
        case 'carta_as':   return criarCarta();
        case 'trofeu':     return criarTrofeu(cfg.cor);
        case 'dado':       return criarDado();
        case 'moeda':      return criarMoeda(cfg.cor);
    }
}

function criarFicha(cor) {
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: cor, roughness: 0.2, metalness: 0.75 });
    const matB = new THREE.MeshStandardMaterial({ color: 0x2a1608, roughness: 0.5 });
    g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.06, 24), mat));
    for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const b = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.065, 0.06), matB);
        b.position.set(Math.cos(a) * 0.24, 0, Math.sin(a) * 0.24);
        g.add(b);
    }
    return g;
}

function criarCarta() {
    const g = new THREE.Group();
    const matF = new THREE.MeshStandardMaterial({ color: 0xfff8f0, roughness: 0.5 });
    const matS = new THREE.MeshStandardMaterial({ color: 0x100808, roughness: 0.3 });
    g.add(new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.01, 0.48), matF));
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.02, 0.12), matS);
    s.position.y = 0.015; g.add(s);
    return g;
}

function criarTrofeu(cor) {
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: cor, roughness: 0.1, metalness: 0.96 });
    const copa = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.14, 0.38, 16), mat);
    copa.position.y = 0.34; g.add(copa);
    const bordo = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.035, 8, 22), mat);
    bordo.rotation.x = Math.PI / 2; bordo.position.y = 0.53; g.add(bordo);
    const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.075, 0.22, 12), mat); haste.position.set(0, 0.11, 0); g.add(haste);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.07, 16), mat); base.position.set(0, 0, 0); g.add(base);
    [-1, 1].forEach(s => {
        const a = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.025, 6, 12, Math.PI), mat);
        a.position.set(s * 0.24, 0.34, 0); a.rotation.z = s * Math.PI / 2; a.rotation.y = Math.PI / 2;
        g.add(a);
    });
    return g;
}

function criarDado() {
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: 0xf5f0e8, roughness: 0.3 });
    const matP = new THREE.MeshStandardMaterial({ color: 0x100606, roughness: 0.5 });
    g.add(new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.34, 0.34), mat));
    // Pontos nas 3 faces visíveis
    [[0, 0.18, 0], [0.18, 0, 0], [0, 0, 0.18]].forEach(p => {
        const pt = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), matP);
        pt.position.set(...p); g.add(pt);
    });
    return g;
}

function criarMoeda(cor) {
    const g = new THREE.Group();
    const mat  = new THREE.MeshStandardMaterial({ color: cor, roughness: 0.15, metalness: 0.9 });
    const matB = new THREE.MeshStandardMaterial({ color: 0xb8860b, roughness: 0.2, metalness: 0.85 });
    g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.045, 24), mat));
    const borda = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.028, 6, 24), matB);
    borda.rotation.x = Math.PI / 2; g.add(borda);
    return g;
}