import * as THREE from 'three';

const RAIO_INT = 3.2;
const CORES_SIMB = [0xD4AF37, 0xC0C0C0, 0xff2020, 0x20dd40, 0x2060ff];

const POSICOES = [[-20, 0, -5], [-20, 0, 5], [20, 0, -5], [20, 0, 5]];

export function criarSlots(scene) {
    return POSICOES.map((pos, i) => criarSlotMachine(scene, pos, i));
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

    // Frame ouro
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.0, 2.16, 0.62), mOuro);
    frame.position.y = 1.05; g.add(frame);
    // Cobrir interior do frame (parede traseira aparece)
    const interior = new THREE.Mesh(new THREE.BoxGeometry(0.92, 2.08, 0.63), mCaixa);
    interior.position.y = 1.05; interior.position.z = 0.01; g.add(interior);

    // Painel do ecrã
    const ecra = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.48, 0.04), mEcra);
    ecra.position.set(0, 1.52, 0.35); g.add(ecra);

    // ─── Cilindros (rolos) ────────────────────────────────────────────────────
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

        const sIdx = Math.floor(Math.random() * CORES_SIMB.length);
        const sMat = new THREE.MeshStandardMaterial({
            color: CORES_SIMB[sIdx], emissive: CORES_SIMB[sIdx], emissiveIntensity: 0.6,
        });
        const sMesh = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.01, 0.09), sMat);
        sMesh.position.set(0, 0.14, 0);
        cg.add(sMesh);

        g.add(cg);
        cilindros.push({ group: cg, girando: false, vel: 0, sIdx, sMat });
    });

    // Botão/alavanca
    const alavanca = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), mVerm);
    alavanca.position.set(0.52, 1.2, 0); g.add(alavanca);
    const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.38, 7), mOuro);
    haste.rotation.z = Math.PI / 2; haste.position.set(0.5, 1.2, 0); g.add(haste);

    // Base
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.18, 0.85), mOuro);
    base.position.y = 0.09; g.add(base);

    // Topo decorativo
    const topo = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.22, 0.5), mOuro);
    topo.position.y = 2.21; g.add(topo);

    // Luz piscante no topo
    const luzTopo = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xffdd00, emissive: 0xffdd00, emissiveIntensity: 2.5 })
    );
    luzTopo.position.y = 2.38; g.add(luzTopo);
    const luzPt = new THREE.PointLight(0xD4AF37, 0.7, 4, 2.5);
    luzPt.position.y = 2.5; g.add(luzPt);

    scene.add(g);

    const slot = { group: g, cilindros, luzTopo, luzPt, jogando: false };
    slot.jogar = (cols, cb) => jogarSlot(slot, cols, cb);
    return slot;
}

function jogarSlot(slot, cols, cb) {
    if (slot.jogando) return;
    slot.jogando = true;

    slot.cilindros.forEach((c, i) => {
        c.girando = true;
        c.vel = 9 + Math.random() * 4;
        setTimeout(() => {
            c.sIdx = Math.floor(Math.random() * CORES_SIMB.length);
            c.sMat.color.setHex(CORES_SIMB[c.sIdx]);
            c.sMat.emissive.setHex(CORES_SIMB[c.sIdx]);
            c.girando = false;
        }, 900 + i * 550 + Math.random() * 350);
    });

    setTimeout(() => {
        slot.jogando = false;
        const [s0, s1, s2] = slot.cilindros.map(c => c.sIdx);
        let bonus = 0;
        if (s0 === s1 && s1 === s2) {
            bonus = 500;
            let n = 0;
            const iv = setInterval(() => {
                slot.luzPt.intensity = n++ % 2 === 0 ? 4 : 0.3;
                if (n > 12) { slot.luzPt.intensity = 0.7; clearInterval(iv); }
            }, 130);
        } else if (s0 === s1 || s1 === s2 || s0 === s2) {
            bonus = 100;
        }
        cb(bonus);
    }, 900 + 3 * 550 + 500);
}

export function atualizarSlots(slots, delta) {
    const t = performance.now() * 0.001;
    slots.forEach((slot, si) => {
        if (slot.luzTopo) {
            slot.luzTopo.material.emissiveIntensity = 1.8 + Math.sin(t * 3.2 + si * 1.5) * 0.7;
        }
        slot.cilindros.forEach(c => {
            if (c.girando) c.group.rotation.x += c.vel * delta;
        });
    });
}

export function verificarProximidadeSlot(jogador, slots) {
    for (const s of slots) {
        const wp = new THREE.Vector3();
        s.group.getWorldPosition(wp);
        if (jogador.position.distanceTo(wp) < RAIO_INT) return s;
    }
    return null;
}