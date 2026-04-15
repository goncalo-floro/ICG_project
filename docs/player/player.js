import * as THREE from 'three';

const VELOCIDADE = 6.5;
const RAIO = 0.55;

export function criarJogador(scene) {
    const g = new THREE.Group();

    const mFato   = new THREE.MeshStandardMaterial({ color: 0x12122a, roughness: 0.45, metalness: 0.15 });
    const mCamisa = new THREE.MeshStandardMaterial({ color: 0xf0e8d8, roughness: 0.6 });
    const mOuro   = new THREE.MeshStandardMaterial({ color: 0xD4AF37, roughness: 0.15, metalness: 0.95 });
    const mRosto  = new THREE.MeshStandardMaterial({ color: 0xc89060, roughness: 0.75 });
    const mCabelo = new THREE.MeshStandardMaterial({ color: 0x1a0e06, roughness: 0.9 });
    const mSapato = new THREE.MeshStandardMaterial({ color: 0x080406, roughness: 0.25, metalness: 0.3 });
    const mCinto  = new THREE.MeshStandardMaterial({ color: 0x080406, roughness: 0.4, metalness: 0.5 });
    const mlight = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.35 });
    const mMetal = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 1, metalness: 0.7  });  

    // PERNAS
    const coxaL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.38, 0.22), mFato);
    coxaL.position.set(-0.13, 0.78, 0); coxaL.castShadow = true; g.add(coxaL);
    const coxaR = coxaL.clone(); coxaR.position.set(0.13, 0.78, 0); g.add(coxaR);

    const canelaL = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.36, 0.19), mFato);
    canelaL.position.set(-0.13, 0.38, 0); canelaL.castShadow = true; g.add(canelaL);
    const canelaR = canelaL.clone(); canelaR.position.set(0.13, 0.38, 0); g.add(canelaR);

    const sapatoL = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.1, 0.34), mSapato);
    sapatoL.position.set(-0.13, 0.05, 0.06); g.add(sapatoL);
    const sapatoR = sapatoL.clone(); sapatoR.position.set(0.13, 0.05, 0.06); g.add(sapatoR);

    // CINTURA E CORPO
    const cinto = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.1, 0.29), mCinto);
    cinto.position.y = 0.97; g.add(cinto);

    const fivela = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.04), mOuro);
    fivela.position.set(0, 0.97, 0.155); g.add(fivela);

    const corpo = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.72, 0.3), mFato);
    corpo.position.y = 1.38; corpo.castShadow = true; g.add(corpo);

    const bolso = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.07, 0.03), mCamisa);
    bolso.position.set(-0.18, 1.55, 0.16); g.add(bolso);
    const lenco = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.03), mOuro);
    lenco.position.set(-0.18, 1.6, 0.17); g.add(lenco);

    // BRAÇOS 
    const ombroL = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 8), mFato);
    ombroL.position.set(-0.36, 1.68, 0); g.add(ombroL);
    const ombroR = ombroL.clone(); ombroR.position.set(0.36, 1.68, 0); g.add(ombroR);

    const bracoSupL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.36, 0.17), mFato);
    bracoSupL.position.set(-0.36, 1.44, 0); bracoSupL.castShadow = true; g.add(bracoSupL);
    const bracoSupR = bracoSupL.clone(); bracoSupR.position.set(0.36, 1.44, 0); g.add(bracoSupR);

    const anteL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.32, 0.15), mCamisa);
    anteL.position.set(-0.36, 1.1, 0); anteL.castShadow = true; g.add(anteL);
    const anteR = anteL.clone(); anteR.position.set(0.36, 1.1, 0); g.add(anteR);

    const punhoL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.07, 0.16), mFato);
    punhoL.position.set(-0.36, 0.93, 0); g.add(punhoL);
    const punhoR = punhoL.clone(); punhoR.position.set(0.36, 0.93, 0); g.add(punhoR);

    const abotL = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 6), mOuro);
    abotL.position.set(-0.42, 0.93, 0.04); g.add(abotL);
    const abotR = abotL.clone(); abotR.position.set(0.42, 0.93, 0.04); g.add(abotR);

    const maoL = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.12, 0.13), mRosto);
    maoL.position.set(-0.36, 0.84, 0); g.add(maoL);
    const maoR = maoL.clone(); maoR.position.set(0.36, 0.84, 0); g.add(maoR);

    // CABEÇA
    const pescoco = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.30, 10), mRosto);
    pescoco.position.y = 1.88; g.add(pescoco);

    const cab = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.4, 0.36), mRosto);
    cab.position.y = 2.06; cab.castShadow = true; g.add(cab);

    const orelhaL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.1, 0.08), mRosto);
    orelhaL.position.set(-0.21, 2.07, 0); g.add(orelhaL);
    const orelhaR = orelhaL.clone(); orelhaR.position.set(0.21, 2.07, 0); g.add(orelhaR);

    const olhoMat = new THREE.MeshStandardMaterial({ color: 0x1a0e04, roughness: 0.8 });
    const olhoL = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.05, 0.04), olhoMat);
    olhoL.position.set(-0.1, 2.1, 0.185); g.add(olhoL);
    const olhoR = olhoL.clone(); olhoR.position.set(0.1, 2.1, 0.185); g.add(olhoR);

    const sbMat = new THREE.MeshStandardMaterial({ color: 0x0a0604, roughness: 0.9 });
    const sbL = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.025, 0.03), sbMat);
    sbL.position.set(-0.1, 2.17, 0.188); g.add(sbL);
    const sbR = sbL.clone(); sbR.position.set(0.1, 2.17, 0.188); g.add(sbR);

    const cabeloBase = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.14, 0.38), mCabelo);
    cabeloBase.position.y = 2.29; g.add(cabeloBase);
    const cabeloFront = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.08, 0.1), mCabelo);
    cabeloFront.position.set(0, 2.22, 0.19); g.add(cabeloFront);
    const cabeloSideL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.4), mCabelo);
    cabeloSideL.position.set(-0.22, 2.2, 0); g.add(cabeloSideL);
    const cabeloSideR = cabeloSideL.clone(); cabeloSideR.position.set(0.22, 2.2, 0); g.add(cabeloSideR);
    const cabeloBack = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.30, 0.1), mCabelo);
    cabeloBack.position.set(0, 2.1, -0.19); g.add(cabeloBack);

    // LANTERNA
    const cabo = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.03, 0.55, 6), mMetal);
    cabo.rotation.x = Math.PI / 2;
    cabo.position.set(0.35, 0.85, 0.20);
    g.add(cabo);

    const vidro = new THREE.Mesh(new THREE.SphereGeometry(0.06, 20, 20), mlight);
    vidro.position.set(0.35, 0.85, 0.48);
    g.add(vidro);

    scene.add(g);
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

        const anguloAlvo = Math.atan2(dir.x, dir.z);
        let diff = anguloAlvo - jogador.rotation.y;
        while (diff > Math.PI)  diff -= 2 * Math.PI;
        while (diff < -Math.PI) diff += 2 * Math.PI;
        jogador.rotation.y += diff * Math.min(1, 12 * delta);

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