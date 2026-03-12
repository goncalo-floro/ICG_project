// main.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { criarJogador, atualizarJogador } from './player/player.js';
import { construirCenario } from './cenario/cenario.js';
import { criarColecionaveis, verificarRecolha } from './collectibles/collectibles.js';
import { criarSlots, atualizarSlots, interagirSlot } from './slots/slots.js';
