import * as THREE from 'three';

export const ITEM_LABELS = {
    ficha_prata: 'Ficha de Prata',
    trofeu:      'Trofeu Cinzento',
    dado:        'Dado Amarelo',
    moeda:       'Moeda Azul',
};

const CONFIG = [
    { tipo: 'ficha_prata', valor: 0, cor: 0xC8C8C8, pos: [-10, 1.1, -8] },
    { tipo: 'trofeu',      valor: 0, cor: 0x888888, pos: [10,  1.1, -8] },
    { tipo: 'dado',        valor: 0, cor: 0xFFF066, pos: [-0.8, 1.3, -20] },
    { tipo: 'moeda',       valor: 0, cor: 0x2A6BFF, pos: [0.8, 1.15, -20] },
];

export function criarColecionaveis(scene) {
    return CONFIG.map(cfg => {
        const group = new THREE.Group();
        group.position.set(...cfg.pos);

        const mesh = criarMesh(cfg);
        if (mesh) { mesh.castShadow = true; group.add(mesh); }

        scene.add(group);
        return {
            tipo: cfg.tipo,
            recolhido: false,
            group,
            mesh,
        };
    });
}

export function recolherItem(item) {
    if (item.recolhido) return;
    item.recolhido = true;
    item.group.visible = false;
}

export function getTotalRecolhidos(cols) {
    return cols.filter(c => c.recolhido).length;
}

function criarMesh(cfg) {
    switch (cfg.tipo) {
        case 'ficha_prata': return criarFicha(cfg.cor);
        case 'trofeu':      return criarTrofeu(cfg.cor);
        case 'dado':        return criarDado(cfg.cor);
        case 'moeda':       return criarMoeda(cfg.cor);
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

function criarDado(cor) {
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: cor, roughness: 0.3 });
    const matP = new THREE.MeshStandardMaterial({ color: 0x100606, roughness: 0.5 });
    g.add(new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.34, 0.34), mat));

    const makePip = (x, y, z) => {
        const pt = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), matP);
        pt.position.set(x, y, z);
        g.add(pt);
    };

    const d = 0.09;
    const f = 0.0;

    // Face 1: topo
    makePip(0, 0.18, 0);

    // Face 2: frente
    makePip(-d, -d, 0.18);
    makePip(d, d, 0.18);

    // Face 3: esquerda
    makePip(-0.18, -d, -d);
    makePip(-0.18, 0, 0);
    makePip(-0.18, d, d);

    // Face 4: direita
    makePip(0.18, -d, -d);
    makePip(0.18, -d, d);
    makePip(0.18, d, -d);
    makePip(0.18, d, d);

    // Face 5: trás
    makePip(-d, -d, -0.18);
    makePip(d, d, -0.18);
    makePip(-d, d, -0.18);
    makePip(d, -d, -0.18);
    makePip(0, 0, -0.18);

    // Face 6: baixo
    makePip(-d, -0.18, -d);
    makePip(-d, -0.18, 0);
    makePip(-d, -0.18, d);
    makePip(d, -0.18, -d);
    makePip(d, -0.18, 0);
    makePip(d, -0.18, d);

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