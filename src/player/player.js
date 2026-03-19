import * as THREE from 'three';

const VELOCIDADE = 6.5;
const RAIO = 0.55;

export function criarJogador(scene) {
    const g = new THREE.Group();

    // Materiais
    const mFato   = new THREE.MeshStandardMaterial({ color: 0x12122a, roughness: 0.45, metalness: 0.15 });
    const mCamisa = new THREE.MeshStandardMaterial({ color: 0xf0e8d8, roughness: 0.6 });
    const mOuro   = new THREE.MeshStandardMaterial({ color: 0xD4AF37, roughness: 0.15, metalness: 0.95 });
    const mRosto  = new THREE.MeshStandardMaterial({ color: 0xc89060, roughness: 0.75 });
    const mCabelo = new THREE.MeshStandardMaterial({ color: 0x1a0e06, roughness: 0.9 });
    const mSapato = new THREE.MeshStandardMaterial({ color: 0x080406, roughness: 0.25, metalness: 0.3 });
    const mCinto  = new THREE.MeshStandardMaterial({ color: 0x080406, roughness: 0.4, metalness: 0.5 });

    // ── PERNAS ────────────────────────────────────────────────────────────────
    // Coxas
    const coxaL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.38, 0.22), mFato);
    coxaL.position.set(-0.13, 0.78, 0); coxaL.castShadow = true; g.add(coxaL);
    const coxaR = coxaL.clone(); coxaR.position.set(0.13, 0.78, 0); g.add(coxaR);

    // Canelas
    const canelaL = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.36, 0.19), mFato);
    canelaL.position.set(-0.13, 0.38, 0); canelaL.castShadow = true; g.add(canelaL);
    const canelaR = canelaL.clone(); canelaR.position.set(0.13, 0.38, 0); g.add(canelaR);

    // Sapatos
    const sapatoL = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.1, 0.34), mSapato);
    sapatoL.position.set(-0.13, 0.05, 0.06); g.add(sapatoL);
    const sapatoR = sapatoL.clone(); sapatoR.position.set(0.13, 0.05, 0.06); g.add(sapatoR);

    // ── CINTURA E CORPO ───────────────────────────────────────────────────────
    const cinto = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.1, 0.29), mCinto);
    cinto.position.y = 0.97; g.add(cinto);

    // Fivela dourada
    const fivela = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.04), mOuro);
    fivela.position.set(0, 0.97, 0.155); g.add(fivela);

    // Corpo/fato (casaco)
    const corpo = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.72, 0.3), mFato);
    corpo.position.y = 1.38; corpo.castShadow = true; g.add(corpo);

    // Lapelas do fato (dois triângulos simulados com boxes inclinadas)
    const lapelaMat = mFato.clone();
    lapelaMat.color.setHex(0x0d0d20);
    const lapelaL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.25, 0.04), lapelaMat);
    lapelaL.position.set(-0.1, 1.52, 0.16); lapelaL.rotation.z = 0.35; g.add(lapelaL);
    const lapelaR = lapelaL.clone(); lapelaR.position.set(0.1, 1.52, 0.16); lapelaR.rotation.z = -0.35; g.add(lapelaR);

    // Camisa (visível entre lapelas)
    const camisa = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.3, 0.04), mCamisa);
    camisa.position.set(0, 1.46, 0.16); g.add(camisa);

    // Gravata dourada
    const grav = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.38, 0.04), mOuro);
    grav.position.set(0, 1.42, 0.18); g.add(grav);
    const gravPonta = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.04), mOuro);
    gravPonta.position.set(0, 1.22, 0.18); gravPonta.rotation.z = Math.PI / 4; g.add(gravPonta);

    // Bolso dourado
    const bolso = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.07, 0.03), mCamisa);
    bolso.position.set(-0.18, 1.55, 0.16); g.add(bolso);
    const lenco = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.03), mOuro);
    lenco.position.set(-0.18, 1.6, 0.17); g.add(lenco);

    // ── BRAÇOS ────────────────────────────────────────────────────────────────
    // Ombros
    const ombroL = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 8), mFato);
    ombroL.position.set(-0.36, 1.68, 0); g.add(ombroL);
    const ombroR = ombroL.clone(); ombroR.position.set(0.36, 1.68, 0); g.add(ombroR);

    // Braços superiores
    const bracoSupL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.36, 0.17), mFato);
    bracoSupL.position.set(-0.36, 1.44, 0); bracoSupL.castShadow = true; g.add(bracoSupL);
    const bracoSupR = bracoSupL.clone(); bracoSupR.position.set(0.36, 1.44, 0); g.add(bracoSupR);

    // Antebraços
    const anteL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.32, 0.15), mCamisa);
    anteL.position.set(-0.36, 1.1, 0); anteL.castShadow = true; g.add(anteL);
    const anteR = anteL.clone(); anteR.position.set(0.36, 1.1, 0); g.add(anteR);

    // Punhos dourados (abotoaduras)
    const punhoL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.07, 0.16), mFato);
    punhoL.position.set(-0.36, 0.93, 0); g.add(punhoL);
    const punhoR = punhoL.clone(); punhoR.position.set(0.36, 0.93, 0); g.add(punhoR);
    const abotL = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 6), mOuro);
    abotL.position.set(-0.42, 0.93, 0.04); g.add(abotL);
    const abotR = abotL.clone(); abotR.position.set(0.42, 0.93, 0.04); g.add(abotR);

    // Mãos
    const maoL = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.12, 0.13), mRosto);
    maoL.position.set(-0.36, 0.84, 0); g.add(maoL);
    const maoR = maoL.clone(); maoR.position.set(0.36, 0.84, 0); g.add(maoR);

    // ── CABEÇA ────────────────────────────────────────────────────────────────
    const pescoco = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.16, 10), mRosto);
    pescoco.position.y = 1.88; g.add(pescoco);

    const cab = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.4, 0.36), mRosto);
    cab.position.y = 2.06; cab.castShadow = true; g.add(cab);

    // Orelhas
    const orelhaL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.1, 0.08), mRosto);
    orelhaL.position.set(-0.21, 2.07, 0); g.add(orelhaL);
    const orelhaR = orelhaL.clone(); orelhaR.position.set(0.21, 2.07, 0); g.add(orelhaR);

    // Olhos
    const olhoMat = new THREE.MeshStandardMaterial({ color: 0x1a0e04, roughness: 0.8 });
    const olhoL = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.05, 0.04), olhoMat);
    olhoL.position.set(-0.1, 2.1, 0.185); g.add(olhoL);
    const olhoR = olhoL.clone(); olhoR.position.set(0.1, 2.1, 0.185); g.add(olhoR);

    // Sobrancelhas
    const sbMat = new THREE.MeshStandardMaterial({ color: 0x0a0604, roughness: 0.9 });
    const sbL = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.025, 0.03), sbMat);
    sbL.position.set(-0.1, 2.17, 0.188); g.add(sbL);
    const sbR = sbL.clone(); sbR.position.set(0.1, 2.17, 0.188); g.add(sbR);

    // Cabelo (volume)
    const cabeloBase = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.14, 0.38), mCabelo);
    cabeloBase.position.y = 2.29; g.add(cabeloBase);
    const cabeloFront = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.08, 0.1), mCabelo);
    cabeloFront.position.set(0, 2.22, 0.19); g.add(cabeloFront);
    const cabeloSideL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.3), mCabelo);
    cabeloSideL.position.set(-0.22, 2.1, 0); g.add(cabeloSideL);
    const cabeloSideR = cabeloSideL.clone(); cabeloSideR.position.set(0.22, 2.1, 0); g.add(cabeloSideR);

    // Chapéu (elegante fedora)
    const chapeuAba = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.34, 0.04, 20), mCabelo);
    chapeuAba.position.y = 2.37; g.add(chapeuAba);
    const chapeuCopa = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.26, 16), mCabelo);
    chapeuCopa.position.y = 2.52; g.add(chapeuCopa);
    const chapeuFita = new THREE.Mesh(new THREE.CylinderGeometry(0.225, 0.225, 0.06, 16), mOuro);
    chapeuFita.position.y = 2.4; g.add(chapeuFita);

    scene.add(g);

    // Guardar refs para animação
    g.userData = {
        coxaL, coxaR, canelaL, canelaR,
        sapatoL, sapatoR,
        bracoSupL, bracoSupR,
        anteL, anteR,
        maoL, maoR,
        // posições base
        coxaLBase: coxaL.position.clone(),
        coxaRBase: coxaR.position.clone(),
        canelaLBase: canelaL.position.clone(),
        canelaRBase: canelaR.position.clone(),
        bracoLBase: bracoSupL.position.clone(),
        bracoRBase: bracoSupR.position.clone(),
        anteLBase: anteL.position.clone(),
        anteRBase: anteR.position.clone(),
    };

    return g;
}

export function atualizarJogador(jogador, keyState, delta, paredes) {
    const dir = new THREE.Vector3();
    const camDir   = window._camDir   || new THREE.Vector3(0, 0, -1);
    const camRight = window._camRight || new THREE.Vector3(1, 0, 0);

    const frente = camDir.clone();   frente.y = 0; frente.normalize();
    const lado   = camRight.clone(); lado.y   = 0; lado.normalize();

    if (keyState['KeyW'] || keyState['ArrowUp'])    dir.add(frente);
    if (keyState['KeyS'] || keyState['ArrowDown'])  dir.sub(frente);
    if (keyState['KeyA'] || keyState['ArrowLeft'])  dir.sub(lado);
    if (keyState['KeyD'] || keyState['ArrowRight']) dir.add(lado);

    const emMovimento = dir.lengthSq() > 0;

    if (emMovimento) {
        dir.normalize();

        // Rotação suave do personagem
        const anguloAlvo = Math.atan2(dir.x, dir.z);
        let diff = anguloAlvo - jogador.rotation.y;
        // normalizar diferença para [-PI, PI]
        while (diff > Math.PI)  diff -= 2 * Math.PI;
        while (diff < -Math.PI) diff += 2 * Math.PI;
        jogador.rotation.y += diff * Math.min(1, 12 * delta);

        // Movimento com colisão
        const nova = jogador.position.clone().addScaledVector(dir, VELOCIDADE * delta);
        if (!colide(nova, paredes)) {
            jogador.position.copy(nova);
        } else {
            const nx = jogador.position.clone(); nx.x += dir.x * VELOCIDADE * delta;
            if (!colide(nx, paredes)) jogador.position.x = nx.x;
            const nz = jogador.position.clone(); nz.z += dir.z * VELOCIDADE * delta;
            if (!colide(nz, paredes)) jogador.position.z = nz.z;
        }
        jogador.position.x = THREE.MathUtils.clamp(jogador.position.x, -23.5, 23.5);
        jogador.position.z = THREE.MathUtils.clamp(jogador.position.z, -24.5, 33);
    }

    jogador.position.y = 0;

    // ── Animação de membros ────────────────────────────────────────────────────
    const ud = jogador.userData;
    const t  = performance.now() * 0.005;
    const vel = emMovimento ? 1 : 0;

    // Amplitude de passada
    const ampPerna = vel * 0.42;
    const ampBraco = vel * 0.30;

    // Pernas: rotação em X dos grupos coxa+canela (simula articulação)
    if (ud.coxaL) {
        ud.coxaL.rotation.x =  Math.sin(t) * ampPerna;
        ud.coxaR.rotation.x = -Math.sin(t) * ampPerna;
        // Canelas seguem (ligeiramente atrasadas e menos amplitude)
        ud.canelaL.rotation.x =  Math.sin(t - 0.4) * ampPerna * 0.5;
        ud.canelaR.rotation.x = -Math.sin(t - 0.4) * ampPerna * 0.5;
        // Sapatos compensam
        ud.sapatoL.rotation.x = -ud.coxaL.rotation.x * 0.3;
        ud.sapatoR.rotation.x = -ud.coxaR.rotation.x * 0.3;
    }

    // Braços: balançam em oposição às pernas
    if (ud.bracoSupL) {
        ud.bracoSupL.rotation.x = -Math.sin(t) * ampBraco;
        ud.bracoSupR.rotation.x =  Math.sin(t) * ampBraco;
        ud.anteL.rotation.x = -Math.sin(t) * ampBraco * 0.4;
        ud.anteR.rotation.x =  Math.sin(t) * ampBraco * 0.4;
    }

    // Bob vertical do corpo inteiro
    if (emMovimento) {
        jogador.position.y = Math.abs(Math.sin(t * 2)) * 0.045;
    }
}

function colide(pos, paredes) {
    for (const p of paredes) {
        if (pos.x + RAIO > p.min.x && pos.x - RAIO < p.max.x &&
            pos.z + RAIO > p.min.z && pos.z - RAIO < p.max.z) return true;
    }
    return false;
}

export function setDirecaoCamera(camera) {
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    window._camDir = dir;
    window._camRight = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0,1,0)).normalize();
}