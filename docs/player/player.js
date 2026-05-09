import * as THREE from 'three';

const VELOCIDADE = 6.5;
const RAIO = 0.55;

export function criarJogador(scene) {
    const g = new THREE.Group();

    const mFato   = new THREE.MeshStandardMaterial({ color: 0x12122a, roughness: 0.45, metalness: 0.15 });
    const mCamisa = new THREE.MeshStandardMaterial({ color: 0xf0e8d8, roughness: 0.6});
    const mOuro   = new THREE.MeshStandardMaterial({ color: 0xD4AF37, roughness: 0.15, metalness: 0.95 });
    const mRosto  = new THREE.MeshStandardMaterial({ color: 0xc89060, roughness: 0.75 });
    const mCabelo = new THREE.MeshStandardMaterial({ color: 0x1a0e06, roughness: 0.9 });
    const mSapato = new THREE.MeshStandardMaterial({ color: 0x080406, roughness: 0.25, metalness: 0.3 });
    const mCinto  = new THREE.MeshStandardMaterial({ color: 0x080406, roughness: 0.4, metalness: 0.5 });
    const mlight = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.35 });
    const mMetal = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 1, metalness: 0.7 });

    // Função helper para criar uma perna com articulações hierárquicas
    const criarPerna = (x, lado) => {
        const perna = new THREE.Group();
        perna.position.set(x, 0.78, 0); // Posição da anca
        
        // ANCA (visual)
        const anca = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), mFato);
        anca.position.set(0, 0, 0);
        anca.castShadow = true;
        perna.add(anca);
        
        // COXA (articulação do quadril)
        const hipJoint = new THREE.Group();
        hipJoint.position.set(0, 0, 0);
        perna.add(hipJoint);
        
        const coxa = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.38, 0.22), mFato);
        coxa.position.set(0, -0.19, 0); // Centro da coxa relativo ao hip joint
        coxa.castShadow = true;
        hipJoint.add(coxa);
        
        // JOELHO (articulação do joelho)
        const kneeJoint = new THREE.Group();
        kneeJoint.position.set(0, -0.38, 0); // Fim da coxa
        hipJoint.add(kneeJoint);
        
        const canela = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.36, 0.19), mFato);
        canela.position.set(0, -0.18, 0); // Centro da canela relativo ao knee joint
        canela.castShadow = true;
        kneeJoint.add(canela);
        
        // TORNOZELO (articulação do tornozelo)
        const ankleJoint = new THREE.Group();
        ankleJoint.position.set(0, -0.36, 0); // Fim da canela
        kneeJoint.add(ankleJoint);
        
        const sapato = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.1, 0.34), mSapato);
        sapato.position.set(0, -0.05, 0.06);
        ankleJoint.add(sapato);
        
        return { perna, hipJoint, kneeJoint, ankleJoint };
    };

    // Criar duas pernas
    const pernaL = criarPerna(-0.13, 'left');
    const pernaR = criarPerna(0.13, 'right');
    g.add(pernaL.perna);
    g.add(pernaR.perna);

    // Armazenar referências das pernas para animação
    g.pernas = {
        left: { hipJoint: pernaL.hipJoint, kneeJoint: pernaL.kneeJoint },
        right: { hipJoint: pernaR.hipJoint, kneeJoint: pernaR.kneeJoint }
    };

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

    // BRAÇOS com hierarquia
    const criarBraco = (x, lado) => {
        const braco = new THREE.Group();
        braco.position.set(x, 1.68, 0); // Posição do ombro
        
        // Ombro (visual)
        const ombro = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 8), mFato);
        ombro.position.set(0, 0, 0);
        ombro.castShadow = true;
        braco.add(ombro);
        
        // Articulação do ombro (para rotação)
        const shoulderJoint = new THREE.Group();
        shoulderJoint.position.set(0, 0, 0);
        braco.add(shoulderJoint);
        
        const bracoSup = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.36, 0.17), mFato);
        bracoSup.position.set(0, -0.18, 0);
        bracoSup.castShadow = true;
        shoulderJoint.add(bracoSup);
        
        // Articulação do cotovelo
        const elbowJoint = new THREE.Group();
        elbowJoint.position.set(0, -0.36, 0);
        shoulderJoint.add(elbowJoint);
        
        const ante = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.32, 0.15), mCamisa);
        ante.position.set(0, -0.16, 0);
        ante.castShadow = true;
        elbowJoint.add(ante);
        
        // Punho
        const punho = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.07, 0.16), mFato);
        punho.position.set(0, -0.35, 0);
        elbowJoint.add(punho);
        
        // Botão (abot)
        const abot = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 6), mOuro);
        abot.position.set(x > 0 ? 0.07 : -0.07, -0.35, 0.04);
        elbowJoint.add(abot);
        
        // Mão
        const mao = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.12, 0.13), mRosto);
        mao.position.set(0, -0.42, 0);
        elbowJoint.add(mao);
        
        return { braco, shoulderJoint, elbowJoint };
    };

    const bracoL = criarBraco(-0.36, 'left');
    const bracoR = criarBraco(0.36, 'right');
    g.add(bracoL.braco);
    g.add(bracoR.braco);

    // Armazenar referências dos braços para animação
    g.bracos = {
        left: { shoulderJoint: bracoL.shoulderJoint, elbowJoint: bracoL.elbowJoint },
        right: { shoulderJoint: bracoR.shoulderJoint, elbowJoint: bracoR.elbowJoint }
    };

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

    // LANTERNA (filha do braço direito)
    const lanterna = new THREE.Group();
    lanterna.position.set(0, -0.42, 0); // Na mão
    bracoR.elbowJoint.add(lanterna);

    const cabo = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.03, 0.55, 6), mMetal);
    cabo.rotation.x = Math.PI / 2;
    cabo.position.set(0, 0, 0.27);
    lanterna.add(cabo);

    const vidro = new THREE.Mesh(new THREE.SphereGeometry(0.06, 20, 20), mlight);
    vidro.position.set(0, 0, 0.48);
    lanterna.add(vidro);

    g.lanterna = lanterna;

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

    // Inicializar contador de animação se não existir
    if (!jogador.walkTime) jogador.walkTime = 0;

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

        // Animação de caminhada
        jogador.walkTime += delta * 6; // Velocidade da animação
        const walkCycle = Math.sin(jogador.walkTime);
        
        // Perna esquerda: quando walkCycle é positivo, sobe para trás
        const hipLeftRotation = walkCycle * 0.4; // Rotação da coxa
        const kneeLeftRotation = Math.max(0, -walkCycle * 0.5); // Joelho dobra quando canela volta para trás
        
        // Perna direita: desfasada em Pi (contrária)
        const hipRightRotation = -walkCycle * 0.4;
        const kneeRightRotation = Math.max(0, walkCycle * 0.5);

        jogador.pernas.left.hipJoint.rotation.x = hipLeftRotation;
        jogador.pernas.left.kneeJoint.rotation.x = kneeLeftRotation;
        
        jogador.pernas.right.hipJoint.rotation.x = hipRightRotation;
        jogador.pernas.right.kneeJoint.rotation.x = kneeRightRotation;

        // Animação dos braços (contrária às pernas: quando perna esquerda avança, braço direito avança)
        const shoulderLeftRotation = -walkCycle * 0.35;
        const elbowLeftRotation = Math.max(0, walkCycle * 0.3);
        
        const shoulderRightRotation = walkCycle * 0.35;
        const elbowRightRotation = Math.max(0, -walkCycle * 0.3);

        jogador.bracos.left.shoulderJoint.rotation.x = shoulderLeftRotation;
        jogador.bracos.left.elbowJoint.rotation.x = elbowLeftRotation;
        
        jogador.bracos.right.shoulderJoint.rotation.x = shoulderRightRotation;
        jogador.bracos.right.elbowJoint.rotation.x = elbowRightRotation;

    } else {
        // Reset das pernas quando parado
        jogador.pernas.left.hipJoint.rotation.x = 0;
        jogador.pernas.left.kneeJoint.rotation.x = 0;
        jogador.pernas.right.hipJoint.rotation.x = 0;
        jogador.pernas.right.kneeJoint.rotation.x = 0;
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