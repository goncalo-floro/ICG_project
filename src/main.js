import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { criarJogador, atualizarJogador, setDirecaoCamera } from './player/player.js';
import { construirCenario } from './cenario/cenario.js';
import { criarColecionaveis, recolherItem, getTotalRecolhidos} from './collectibles/collectibles.js';
import { criarSlots } from './slots/slots.js';
import { HUD } from './hud/hud.js';

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.autoClear = false;
document.body.appendChild(renderer.domElement);

// Cena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x060402);
scene.fog = new THREE.FogExp2(0x0c0804, 0.032);

// Câmara
const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 250);
camera.position.set(0, 4.5, 42);
camera.lookAt(0, 4, 26);

// HUD
const hud = new HUD(renderer);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.minDistance = 3;
controls.maxDistance = 14;
controls.maxPolarAngle = Math.PI / 2 - 0.04;
controls.minPolarAngle = 0.12;
controls.mouseButtons = { LEFT: null, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE };
controls.enabled = false;

const keyState = {};
let gameState = 'INTRO';

// Mundo
const { paredes, colisaoPorta, pivotE, pivotD, followLight, followSpot} = construirCenario(scene);

const todasParedes = [...paredes];

const jogador = criarJogador(scene);
jogador.position.set(0, 0, 32);
jogador.rotation.y = Math.PI;

const colecionaveis = criarColecionaveis(scene);
criarSlots(scene);   // apenas modelos, ainda me falta implementar os extras

hud.setColecao(colecionaveis);

// Raycaster para recolha
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function recolherPorClique(event) {
    if (gameState !== 'PLAYING') return;

    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const activeItems = colecionaveis.filter(item => !item.recolhido);
    const intersects = raycaster.intersectObjects(activeItems.map(item => item.group), true);
    if (intersects.length > 0) {
        let hitGroup = intersects[0].object;
        while (hitGroup.parent && !colecionaveis.find(c => c.group === hitGroup)) {
            hitGroup = hitGroup.parent;
        }
        const item = colecionaveis.find(c => c.group === hitGroup);
        if (item && !item.recolhido) {
            recolherItem(item);
            hud.setColecao(colecionaveis);
            const NOMES = {
                ficha_prata:'Ficha de Prata',
                trofeu:'Trofeu Cinzento',
                dado:'Dado Amarelo',
                moeda:'Moeda Azul',
            };
            hud.mostrarNotificacao(`${NOMES[item.tipo]} recolhido!`);
            if (getTotalRecolhidos(colecionaveis) === colecionaveis.length)
                setTimeout(() => hud.mostrarNotificacao('COLEÇÃO COMPLETA!'), 1200);
        }
    }
}

// Fechar portas
function fecharPortas(onDone) {
    if (!todasParedes.includes(colisaoPorta)) {
        todasParedes.push(colisaoPorta);
    }
    let t = 0;
    const dur = 0.9;
    const startE = pivotE.rotation.y;
    const startD = pivotD.rotation.y;
    const targetE = 0;
    const targetD = 0;
    const id = setInterval(() => {
        t += 0.016 / dur;
        const f = easeInOut(Math.min(t, 1));
        pivotE.rotation.y = THREE.MathUtils.lerp(startE, targetE, f);
        pivotD.rotation.y = THREE.MathUtils.lerp(startD, targetD, f);
        if (t >= 1) {
            clearInterval(id);
            if (onDone) onDone();
        }
    }, 16);
}

// Limites da câmara
const LIMITES_CAM = { xMin: -23.5, xMax: 23.5, zMin: -24.5, zMax: 25.5, yMin: 1.5, yMax: 9.5 };
function limitarCamara() {
    if (gameState !== 'PLAYING') return;
    const pos = camera.position;
    let changed = false;
    if (pos.x < LIMITES_CAM.xMin) { pos.x = LIMITES_CAM.xMin; changed = true; }
    if (pos.x > LIMITES_CAM.xMax) { pos.x = LIMITES_CAM.xMax; changed = true; }
    if (pos.z < LIMITES_CAM.zMin) { pos.z = LIMITES_CAM.zMin; changed = true; }
    if (pos.z > LIMITES_CAM.zMax) { pos.z = LIMITES_CAM.zMax; changed = true; }
    if (pos.y < LIMITES_CAM.yMin) { pos.y = LIMITES_CAM.yMin; changed = true; }
    if (pos.y > LIMITES_CAM.yMax) { pos.y = LIMITES_CAM.yMax; changed = true; }
    if (changed) {
        camera.position.copy(pos);
        controls.minDistance = Math.min(controls.minDistance, camera.position.distanceTo(controls.target));
    }
}

// Input
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
    recolherPorClique(e);
});

window.addEventListener('keydown', e => { keyState[e.code] = true; });
window.addEventListener('keyup', e => { keyState[e.code] = false; });

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Transição de entrada
function iniciarEntrada() {
    gameState = 'WALKING_IN';
    document.body.style.cursor = 'default';
    hud.esconderIntro();

    const jogStart = jogador.position.clone();
    const jogEnd   = new THREE.Vector3(0, 0, 20);
    const camStart = camera.position.clone();
    const camPan   = new THREE.Vector3(0, 6.5, 38);
    let t = 0;

    const fase1 = setInterval(() => {
        t += 0.016 / 2.0;
        const f = easeInOut(Math.min(t, 1));
        jogador.position.lerpVectors(jogStart, jogEnd, f);
        camera.position.lerpVectors(camStart, camPan, f);
        camera.lookAt(0, 4, 26);
        if (t >= 1) {
            clearInterval(fase1);
            const camStart2 = camera.position.clone();
            const camEnd2   = new THREE.Vector3(jogador.position.x, 5.5, jogador.position.z + 5);
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
                    gameState = 'PLAYING';
                    fecharPortas();
                }
            }, 16);
        }
    }, 16);
}

function easeInOut(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }

// Loop
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
        
        const playerPos = jogador.position;
        const playerHeight = 1.2;
        followLight.position.set(playerPos.x, playerPos.y + playerHeight, playerPos.z);
        
        const forwardDir = new THREE.Vector3(0, 0, 1).applyQuaternion(jogador.quaternion);
        const spotOffset = forwardDir.clone().multiplyScalar(1.5);
        followSpot.position.set(playerPos.x + spotOffset.x, playerPos.y + 1.5, playerPos.z + spotOffset.z);
        const targetPoint = playerPos.clone().add(forwardDir.multiplyScalar(3));
        followSpot.target.position.copy(targetPoint);
        scene.add(followSpot.target);
        
        controls.target.lerp(new THREE.Vector3(jogador.position.x, 1.2, jogador.position.z), 0.08);
        controls.update();
        limitarCamara();
    }

    hud.atualizar(delta);

    renderer.clear();
    renderer.render(scene, camera);
    hud.render();
}

animate();