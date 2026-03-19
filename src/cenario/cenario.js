import * as THREE from 'three';

export function construirCenario(scene) {

    const matChaoExt  = new THREE.MeshStandardMaterial({ color: 0x1a1208, roughness: 0.9 });
    const matParede   = new THREE.MeshStandardMaterial({ color: 0x4a2e12, roughness: 0.75 });
    const matFachada  = new THREE.MeshStandardMaterial({ color: 0x3a2208, roughness: 0.7 });
    const matTecto    = new THREE.MeshStandardMaterial({ color: 0x2a1808, roughness: 0.9 });
    const matDourado  = new THREE.MeshStandardMaterial({ color: 0xD4AF37, roughness: 0.2, metalness: 0.85 });
    const matDouEsc   = new THREE.MeshStandardMaterial({ color: 0x9B7A20, roughness: 0.45, metalness: 0.6 });
    const matMesa     = new THREE.MeshStandardMaterial({ color: 0x1a5c2a, roughness: 0.55 });
    const matMadeira  = new THREE.MeshStandardMaterial({ color: 0x5c3010, roughness: 0.7 });
    const matTapete   = new THREE.MeshStandardMaterial({ color: 0x7a1010, roughness: 0.85 });
    const matVidro    = new THREE.MeshStandardMaterial({ color: 0xd4aa30, roughness: 0, metalness: 0.8, transparent: true, opacity: 0.18 });

    // ── ILUMINAÇÃO ────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffe0a0, 1.2));
    const dirLight = new THREE.DirectionalLight(0xffd080, 1.0);
    dirLight.position.set(5, 20, 30);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(2048, 2048);
    Object.assign(dirLight.shadow.camera, { near:0.1, far:120, left:-40, right:40, top:40, bottom:-40 });
    scene.add(dirLight);

    [   [0,9.2,-12], [0,9.2,4], [-12,9.2,-6], [12,9.2,-6]   ].forEach(([x,y,z]) => {
        const l = new THREE.PointLight(0xffbb50, 4.0, 28, 1.2);
        l.position.set(x,y,z); l.castShadow = true; scene.add(l);
        const g = new THREE.Mesh(new THREE.SphereGeometry(0.25,12,12),
            new THREE.MeshStandardMaterial({ color:0xffe090, emissive:0xffa030, emissiveIntensity:3 }));
        g.position.set(x,y,z); scene.add(g);
        const cr = new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,0.5,6), matDouEsc);
        cr.position.set(x,y+0.38,z); scene.add(cr);
    });
    [[-24,5,-14],[-24,5,0],[-24,5,14],[24,5,-14],[24,5,0],[24,5,14],[0,5,-25]].forEach(([x,y,z]) => {
        const l = new THREE.PointLight(0x8B2500, 1.1, 13, 2);
        l.position.set(x,y,z); scene.add(l);
        const a = new THREE.Mesh(new THREE.SphereGeometry(0.13,8,8),
            new THREE.MeshStandardMaterial({ color:0xffa040, emissive:0xff6010, emissiveIntensity:2.5 }));
        a.position.set(x,y,z); scene.add(a);
    });

    // ── EXTERIOR ──────────────────────────────────────────────────────────────
    const chaoExt = new THREE.Mesh(new THREE.PlaneGeometry(80,30), matChaoExt);
    chaoExt.rotation.x = -Math.PI/2; chaoExt.position.set(0,0,40); chaoExt.receiveShadow=true;
    scene.add(chaoExt);

    const fachada = new THREE.Mesh(new THREE.BoxGeometry(50,12,1), matFachada);
    fachada.position.set(0,6,25.5); fachada.castShadow=true; scene.add(fachada);
    criarInsigniaFachada(scene);

    // Luzes neón fachada
    const nL = new THREE.PointLight(0xffcc00, 2.5, 16, 1.5); nL.position.set(0,10.5,26); scene.add(nL);
    [-14,14].forEach(x => { const n=new THREE.PointLight(0xff4400,1.2,11,2); n.position.set(x,7,26); scene.add(n); });

    // Degraus
    for (let i=0; i<3; i++) {
        const d = new THREE.Mesh(new THREE.BoxGeometry(9-i*1.5,0.15,0.65), matDouEsc);
        d.position.set(0,i*0.15,25.2+i*0.7); scene.add(d);
    }

    // Postes exteriores
    [-6,6].forEach(x => {
        const p = new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.08,4,8), matDouEsc);
        p.position.set(x,2,29); scene.add(p);
        const gb = new THREE.Mesh(new THREE.SphereGeometry(0.2,10,10),
            new THREE.MeshStandardMaterial({ color:0xffe090, emissive:0xffc040, emissiveIntensity:2.5 }));
        gb.position.set(x,4.2,29); scene.add(gb);
        const lp = new THREE.PointLight(0xffa020,1.8,9,2); lp.position.set(x,4.2,29); scene.add(lp);
    });

    // Tapete vermelho exterior + balizas
    const te = new THREE.Mesh(new THREE.PlaneGeometry(7,8),
        new THREE.MeshStandardMaterial({ color:0x5c0808, roughness:0.85 }));
    te.rotation.x=-Math.PI/2; te.position.set(0,0.01,30); scene.add(te);
    [-4,4].forEach(x => {
        const bl = new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,1.2,8), matDourado);
        bl.position.set(x,0.6,29.5); scene.add(bl);
        const tp = new THREE.Mesh(new THREE.SphereGeometry(0.1,8,8), matDourado);
        tp.position.set(x,1.28,29.5); scene.add(tp);
    });
    const corda = new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,8,8),
        new THREE.MeshStandardMaterial({ color:0x6b0f0f, roughness:0.5 }));
    corda.rotation.z=Math.PI/2; corda.position.set(0,0.95,29.5); scene.add(corda);

    // ── CHÃO INTERIOR (azulejos xadrez) ───────────────────────────────────────
    const matTile1 = new THREE.MeshStandardMaterial({ color:0x3a2010, roughness:0.3, metalness:0.18 });
    const matTile2 = new THREE.MeshStandardMaterial({ color:0x2a1608, roughness:0.35, metalness:0.12 });
    for (let x=-24; x<24; x+=2) {
        for (let z=-26; z<26; z+=2) {
            const m = ((Math.floor(x/2)+Math.floor(z/2))%2===0) ? matTile1 : matTile2;
            const t = new THREE.Mesh(new THREE.PlaneGeometry(1.96,1.96), m);
            t.rotation.x=-Math.PI/2; t.position.set(x+1,0.001,z+1); t.receiveShadow=true; scene.add(t);
        }
    }
    const tapete = new THREE.Mesh(new THREE.PlaneGeometry(28,38), matTapete);
    tapete.rotation.x=-Math.PI/2; tapete.position.set(0,0.012,-2); scene.add(tapete);
    const bordaTap = new THREE.Mesh(new THREE.PlaneGeometry(29.5,39.5), matDouEsc);
    bordaTap.rotation.x=-Math.PI/2; bordaTap.position.set(0,0.007,-2); scene.add(bordaTap);

    // ── TECTO ─────────────────────────────────────────────────────────────────
    const tecto = new THREE.Mesh(new THREE.PlaneGeometry(50,54), matTecto);
    tecto.rotation.x=Math.PI/2; tecto.position.set(0,10,0); scene.add(tecto);
    [-8,0,8].forEach(z => {
        const v = new THREE.Mesh(new THREE.BoxGeometry(50,0.22,0.55), matMadeira);
        v.position.set(0,9.78,z); scene.add(v);
    });

    // ── PAREDES ───────────────────────────────────────────────────────────────
    const pN = new THREE.Mesh(new THREE.BoxGeometry(50,10,1), matParede);
    pN.position.set(0,5,-26); pN.castShadow=true; pN.receiveShadow=true; scene.add(pN);
    const pSL = new THREE.Mesh(new THREE.BoxGeometry(21,10,1), matParede);
    pSL.position.set(-14.5,5,26); scene.add(pSL);
    const pSR = pSL.clone(); pSR.position.set(14.5,5,26); scene.add(pSR);
    const pST = new THREE.Mesh(new THREE.BoxGeometry(8,2.5,1), matParede);
    pST.position.set(0,8.75,26); scene.add(pST);
    const pO = new THREE.Mesh(new THREE.BoxGeometry(1,10,54), matParede);
    pO.position.set(-25,5,0); pO.castShadow=true; scene.add(pO);
    const pE = pO.clone(); pE.position.set(25,5,0); scene.add(pE);

    // Rodapés
    [
        [new THREE.BoxGeometry(50,0.28,0.12),  [0,0.14,-25.4]],
        [new THREE.BoxGeometry(50,0.28,0.12),  [0,0.14,25.4]],
        [new THREE.BoxGeometry(0.12,0.28,54),  [-24.4,0.14,0]],
        [new THREE.BoxGeometry(0.12,0.28,54),  [24.4,0.14,0]],
    ].forEach(([g,p]) => { const m=new THREE.Mesh(g,matDouEsc); m.position.set(...p); scene.add(m); });

    // ── PORTA (folhas animáveis) ───────────────────────────────────────────────
    // Frame dourado (estático)
    const portaFrame = new THREE.Group();
    portaFrame.position.set(0,0,26);
    const fV1 = new THREE.Mesh(new THREE.BoxGeometry(0.25,7.5,0.25), matDourado);
    fV1.position.set(-4,3.75,0); portaFrame.add(fV1);
    const fV2 = fV1.clone(); fV2.position.set(4,3.75,0); portaFrame.add(fV2);
    const fH = new THREE.Mesh(new THREE.BoxGeometry(8.5,0.25,0.25), matDourado);
    fH.position.set(0,7.5,0); portaFrame.add(fH);
    scene.add(portaFrame);

    // Folha ESQUERDA — pivô no canto esquerdo (-4, 0, 26)
    const pivotE = new THREE.Group();
    pivotE.position.set(-4, 0, 26);
    const folhaE = new THREE.Mesh(new THREE.BoxGeometry(3.7, 7.2, 0.08), matVidro);
    folhaE.position.set(-1.85, 3.6, 0); // offset do pivô para o centro da folha
    pivotE.add(folhaE);
    // Puxador
    const puxE = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.4, 0.06), matDourado);
    puxE.position.set(-3.55, 3.6, 0.08); pivotE.add(puxE);
    scene.add(pivotE);

    // Folha DIREITA — pivô no canto direito (4, 0, 26)
    const pivotD = new THREE.Group();
    pivotD.position.set(4, 0, 26);
    const folhaD = new THREE.Mesh(new THREE.BoxGeometry(3.7, 7.2, 0.08), matVidro.clone());
    folhaD.position.set(1.85, 3.6, 0);
    pivotD.add(folhaD);
    const puxD = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.4, 0.06), matDourado);
    puxD.position.set(3.55, 3.6, 0.08); pivotD.add(puxD);
    scene.add(pivotD);

    // ── MOBILIÁRIO ────────────────────────────────────────────────────────────
    [[-10,0,-8],[10,0,-8],[0,0,-20]].forEach(([x,y,z]) => {
        const g=new THREE.Group(); g.position.set(x,y,z);
        const sup=new THREE.Mesh(new THREE.BoxGeometry(5,0.15,3), matMesa);
        sup.position.y=1.05; sup.castShadow=true; sup.receiveShadow=true; g.add(sup);
        const fr=new THREE.Mesh(new THREE.BoxGeometry(5.22,0.22,3.22), matDourado);
        fr.position.y=0.96; g.add(fr);
        [[-2.3,0.45,1.3],[2.3,0.45,1.3],[-2.3,0.45,-1.3],[2.3,0.45,-1.3]].forEach(([lx,ly,lz]) => {
            const leg=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.9,0.2), matMadeira);
            leg.position.set(lx,ly,lz); leg.castShadow=true; g.add(leg);
        });
        scene.add(g);
    });
    [[-20,0,-20],[20,0,-20],[-20,0,10],[20,0,10]].forEach(([x,y,z]) => {
        const col=new THREE.Mesh(new THREE.CylinderGeometry(0.45,0.55,9,16), matMadeira);
        col.position.set(x,4.5,z); col.castShadow=true; scene.add(col);
        [0.14,9.14].forEach(py => {
            const b=new THREE.Mesh(new THREE.CylinderGeometry(0.65,0.65,0.28,16), matDourado);
            b.position.set(x,py,z); scene.add(b);
        });
    });
    [[-24.4,5,-12,0],[-24.4,5,4,0],[24.4,5,-12,Math.PI],[24.4,5,4,Math.PI]].forEach(([x,y,z,ry]) => {
        const g=new THREE.Group(); g.position.set(x,y,z); g.rotation.y=ry;
        [[0.08,0.14,3.4,[0,2.15,0]],[0.08,0.14,3.4,[0,-2.15,0]],
         [0.08,4.44,0.14,[0,0,1.63]],[0.08,4.44,0.14,[0,0,-1.63]]].forEach(([sx,sy,sz,p]) => {
            const b=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz), matDouEsc); b.position.set(...p); g.add(b);
        });
        g.add(new THREE.Mesh(new THREE.BoxGeometry(0.04,4.0,3.0),
            new THREE.MeshStandardMaterial({ color:0x2a1608, roughness:0.9 })));
        scene.add(g);
    });

    // ── COLISÕES ──────────────────────────────────────────────────────────────
    // Paredes estáticas sempre presentes
    const paredesEstaticas = [
        { min: new THREE.Vector3(-25.5,0,-26.5), max: new THREE.Vector3(-24,10, 26.5) }, // oeste
        { min: new THREE.Vector3( 24,  0,-26.5), max: new THREE.Vector3( 25.5,10,26.5) }, // leste
        { min: new THREE.Vector3(-25.5,0,-26.5), max: new THREE.Vector3( 25.5,10,-25)  }, // norte
        { min: new THREE.Vector3(-25.5,0, 25),   max: new THREE.Vector3(-4.5, 10, 27)  }, // sul esq
        { min: new THREE.Vector3(  4.5,0, 25),   max: new THREE.Vector3( 25.5,10, 27)  }, // sul dir
    ];

    // Colisão das portas (adicionada/removida dinamicamente)
    const colisaoPorta = { min: new THREE.Vector3(-4, 0, 25.4), max: new THREE.Vector3(4, 10, 26.6) };

    return {
        paredes: paredesEstaticas,
        colisaoPorta,
        pivotE,
        pivotD,
    };
}

function criarInsigniaFachada(scene) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 200;
    const ctx = canvas.getContext('2d');
    ctx.shadowColor = '#D4AF37'; ctx.shadowBlur = 28;
    ctx.fillStyle = '#D4AF37'; ctx.font = 'bold 68px Georgia,serif'; ctx.textAlign = 'center';
    ctx.fillText("THE COLLECTOR'S BET", 512, 95);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#9B7A20'; ctx.font = '30px Georgia,serif';
    ctx.fillText('✦  CASINO  ✦', 512, 152);
    const tex = new THREE.CanvasTexture(canvas);
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(12,2.4),
        new THREE.MeshBasicMaterial({ map:tex, transparent:true, side:THREE.DoubleSide }));
    mesh.position.set(0,9.5,25.55); scene.add(mesh);
}