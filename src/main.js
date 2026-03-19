import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { criarJogador, atualizarJogador, setDirecaoCamera } from './player/player.js';
import { construirCenario } from './cenario/cenario.js';
import { criarColecionaveis, verificarRecolha, getTotalRecolhidos, atualizarColecionaveis } from './collectibles/collectibles.js';
import { criarSlots, atualizarSlots, verificarProximidadeSlot } from './slots/slots.js';
import { HUD } from './hud/hud.js';

// ─── Renderer ─────────────────────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.autoClear = false;
document.body.appendChild(renderer.domElement);

// ─── Cena ─────────────────────────────────────────────────────────────────────
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x060402);
scene.fog = new THREE.FogExp2(0x0c0804, 0.032);

// ─── Câmara ───────────────────────────────────────────────────────────────────
const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 250);
camera.position.set(0, 4.5, 42);
camera.lookAt(0, 4, 26);

// ─── HUD ──────────────────────────────────────────────────────────────────────
const hud = new HUD(renderer);

// ─── OrbitControls ───────────────────────────────────────────────────────────
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.minDistance = 3;
controls.maxDistance = 14;
controls.maxPolarAngle = Math.PI / 2 - 0.04;
controls.minPolarAngle = 0.12;
controls.mouseButtons = { LEFT: null, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE };
controls.enabled = false;

// ─── Estado ───────────────────────────────────────────────────────────────────
const keyState = {};
let gameState = 'INTRO';
let score = 0;

// ─── Mundo ────────────────────────────────────────────────────────────────────
const { paredes, colisaoPorta, pivotE, pivotD } = construirCenario(scene);

// Colisão total = paredes estáticas + porta (enquanto fechada)
const todasParedes = [...paredes];
todasParedes.push(colisaoPorta); // porta começa fechada

const jogador = criarJogador(scene);
jogador.position.set(0, 0, 32);
jogador.rotation.y = Math.PI;

const colecionaveis = criarColecionaveis(scene);
const slots = criarSlots(scene);

hud.setColecao(colecionaveis);
hud.setScore(0);

// ─── Estado das portas ────────────────────────────────────────────────────────
// pivotE.rotation.y = 0       → fechada
// pivotE.rotation.y = +PI/2   → aberta (abre para fora/esquerda)
// pivotD.rotation.y = 0       → fechada
// pivotD.rotation.y = -PI/2   → aberta (abre para fora/direita)
let portaEstado = 'FECHADA'; // FECHADA | ABRINDO | ABERTA | FECHANDO

function animarPorta(paraAbrir, onDone) {
    const alvos = {
        E: paraAbrir ?  Math.PI / 2 : 0,
        D: paraAbrir ? -Math.PI / 2 : 0,
    };
    portaEstado = paraAbrir ? 'ABRINDO' : 'FECHANDO';

    // Remover colisão da porta enquanto está a abrir (o jogador pode passar)
    if (paraAbrir) {
        const idx = todasParedes.indexOf(colisaoPorta);
        if (idx !== -1) todasParedes.splice(idx, 1);
    }

    let t = 0;
    const dur = 0.9;
    const startE = pivotE.rotation.y;
    const startD = pivotD.rotation.y;

    const id = setInterval(() => {
        t += 0.016 / dur;
        const f = easeInOut(Math.min(t, 1));
        pivotE.rotation.y = THREE.MathUtils.lerp(startE, alvos.E, f);
        pivotD.rotation.y = THREE.MathUtils.lerp(startD, alvos.D, f);

        if (t >= 1) {
            clearInterval(id);
            portaEstado = paraAbrir ? 'ABERTA' : 'FECHADA';
            // Ao fechar, repõe colisão
            if (!paraAbrir && !todasParedes.includes(colisaoPorta)) {
                todasParedes.push(colisaoPorta);
            }
            if (onDone) onDone();
        }
    }, 16);
}

// ─── Limitar câmara às paredes interiores ─────────────────────────────────────
const LIMITES_CAM = {
    xMin: -23.5, xMax: 23.5,
    zMin: -24.5, zMax: 25.5,
    yMin: 1.5,   yMax: 9.5,
};

function limitarCamara() {
    // Só aplica quando está a jogar dentro do casino
    if (gameState !== 'PLAYING') return;

    // Vetor do target até à câmara
    const offset = camera.position.clone().sub(controls.target);
    const posCorrigida = camera.position.clone();

    posCorrigida.x = THREE.MathUtils.clamp(posCorrigida.x, LIMITES_CAM.xMin, LIMITES_CAM.xMax);
    posCorrigida.z = THREE.MathUtils.clamp(posCorrigida.z, LIMITES_CAM.zMin, LIMITES_CAM.zMax);
    posCorrigida.y = THREE.MathUtils.clamp(posCorrigida.y, LIMITES_CAM.yMin, LIMITES_CAM.yMax);

    if (!posCorrigida.equals(camera.position)) {
        camera.position.copy(posCorrigida);
        // Recalcular distância ao target para evitar que os controls "minem" a correção
        const dist = camera.position.distanceTo(controls.target);
        controls.minDistance = Math.min(controls.minDistance, dist);
    }
}

// ─── Input ────────────────────────────────────────────────────────────────────
window.addEventListener('mousemove', e => {
    if (gameState !== 'INTRO') return;
    const over = hud.testarHoverBotao(e.clientX, e.clientY);
    document.body.style.cursor = over ? 'pointer' : 'default';
});

window.addEventListener('click', e => {
    if (gameState === 'INTRO') {
        if (hud.testarCliqueBotao(e.clientX, e.clientY)) iniciarEntrada();
        return;
    }
    if (gameState === 'PLAYING') {
        const recolhido = verificarRecolha(jogador, colecionaveis);
        if (recolhido) {
            score += recolhido.valor;
            hud.setScore(score);
            hud.setColecao(colecionaveis);
            const NOMES = {
                ficha_ouro:'Ficha de Ouro', ficha_prata:'Ficha de Prata',
                carta_as:'As de Espadas',   trofeu:'Trofeu do Casino',
                dado:'Dado de Marfim',      moeda:'Moeda da Sorte',
            };
            hud.mostrarNotificacao(`+${recolhido.valor} fichas  —  ${NOMES[recolhido.tipo]}`);
            if (getTotalRecolhidos(colecionaveis) === colecionaveis.length)
                setTimeout(() => hud.mostrarNotificacao('COLECAO COMPLETA!  A noite foi sua!'), 1200);
        }
    }
});

window.addEventListener('keydown', e => {
    keyState[e.code] = true;
    if (e.code === 'KeyE' && gameState === 'PLAYING') {
        const s = verificarProximidadeSlot(jogador, slots);
        if (s) {
            s.jogar(colecionaveis, bonus => {
                if (bonus > 0) { score += bonus; hud.setScore(score); hud.mostrarNotificacao(`JACKPOT!   +${bonus} fichas`); }
                else hud.mostrarNotificacao('Sem sorte desta vez...');
            });
        }
    }
});
window.addEventListener('keyup', e => { keyState[e.code] = false; });

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ─── Transição de entrada ─────────────────────────────────────────────────────
function iniciarEntrada() {
    gameState = 'WALKING_IN';
    document.body.style.cursor = 'default';

    hud.esconderIntro();

    // 1. Portas abrem
    animarPorta(true, () => {
        // 2. Câmara sobe (vista panorâmica da fachada)
        const jogStart = jogador.position.clone();
        const jogEnd   = new THREE.Vector3(0, 0, 20);
        const camStart = camera.position.clone();
        const camPan   = new THREE.Vector3(0, 9, 42);
        let t = 0;

        const fase1 = setInterval(() => {
            t += 0.016 / 2.0;
            const f = easeInOut(Math.min(t, 1));
            jogador.position.lerpVectors(jogStart, jogEnd, f);
            jogador.position.y = Math.abs(Math.sin(t * 2 * 9)) * 0.06;
            camera.position.lerpVectors(camStart, camPan, f);
            camera.lookAt(0, 4, 26);
            if (t >= 1) {
                clearInterval(fase1);
                jogador.position.y = 0;

                // 3. Câmara desce para trás do jogador
                const camStart2 = camera.position.clone();
                const camEnd2   = new THREE.Vector3(jogador.position.x, 7, jogador.position.z + 10);
                let t2 = 0;

                const fase2 = setInterval(() => {
                    t2 += 0.016 / 1.4;
                    const f2 = easeInOut(Math.min(t2, 1));
                    camera.position.lerpVectors(camStart2, camEnd2, f2);
                    camera.lookAt(jogador.position.x, 1.2, jogador.position.z);
                    if (t2 >= 1) {
                        clearInterval(fase2);
                        controls.target.set(jogador.position.x, 1.2, jogador.position.z);
                        controls.enabled = true;
                        controls.minDistance = 3;
                        jogador.rotation.y = 0;
                        gameState = 'PLAYING';

                        // 4. Portas fecham depois de o jogador estar dentro
                        setTimeout(() => {
                            animarPorta(false);
                        }, 800);
                    }
                }, 16);
            }
        }, 16);
    });
}

function easeInOut(t) {
    return t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
}

// ─── Loop ─────────────────────────────────────────────────────────────────────
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const delta = Math.min(clock.getDelta(), 0.05);

    if (gameState === 'INTRO') {
        const t = clock.elapsedTime;
        camera.position.x = Math.sin(t * 0.18) * 1.2;
        camera.lookAt(0, 4, 26);
    }

    if (gameState === 'PLAYING') {
        setDirecaoCamera(camera);
        atualizarJogador(jogador, keyState, delta, todasParedes);
        controls.target.lerp(new THREE.Vector3(jogador.position.x, 1.2, jogador.position.z), 0.08);
        controls.update();
        limitarCamara();
        hud.setSlotPrompt(!!verificarProximidadeSlot(jogador, slots));
    }

    atualizarColecionaveis(colecionaveis, delta);
    atualizarSlots(slots, delta);
    hud.atualizar(delta);

    renderer.clear();
    renderer.render(scene, camera);
    hud.render();
}

animate();