import * as THREE from 'three';

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function makeSprite(cw, ch) {
    const canvas = document.createElement('canvas');
    canvas.width = cw; canvas.height = ch;
    const ctx = canvas.getContext('2d');
    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false });
    const sprite = new THREE.Sprite(mat);
    sprite.renderOrder = 999;
    return { sprite, canvas, ctx, tex };
}

export class HUD {
    constructor(renderer) {
        this.renderer = renderer;
        this.orthoScene = new THREE.Scene();
        this.orthoCamera = new THREE.OrthographicCamera(
            -window.innerWidth / 2,  window.innerWidth / 2,
             window.innerHeight / 2, -window.innerHeight / 2,
            -10, 10
        );
        this._notifTimer = 0;
        this._introVisible = true;
        this._colItems = [];

        this._construirHUD();
        this._construirIntro();
        window.addEventListener('resize', () => this._resize());
    }

    _resize() {
        const w = window.innerWidth, h = window.innerHeight;
        this.orthoCamera.left   = -w / 2;
        this.orthoCamera.right  =  w / 2;
        this.orthoCamera.top    =  h / 2;
        this.orthoCamera.bottom = -h / 2;
        this.orthoCamera.updateProjectionMatrix();
        this._posicionar();
        this._posicionarIntro();
    }

    _construirHUD() {
        // Lista de coleção (sem score)
        this._lista = makeSprite(280, 260);
        this.orthoScene.add(this._lista.sprite);
        this._lista.sprite.visible = false;

        // Notificação
        this._notif = makeSprite(560, 74);
        this._notif.sprite.material.opacity = 0;
        this.orthoScene.add(this._notif.sprite);

        // Controles
        this._ctrl = makeSprite(760, 46);
        this._ctrl.sprite.visible = false;
        const cc = this._ctrl.ctx;
        cc.fillStyle = 'rgba(8,4,1,0.76)';
        roundRect(cc, 0, 0, 760, 46, 8); cc.fill();
        cc.strokeStyle = '#3a2a0a'; cc.lineWidth = 1.5;
        roundRect(cc, 1, 1, 758, 44, 7); cc.stroke();
        cc.fillStyle = '#5a3e18';
        cc.font = '15px Georgia,serif'; cc.textAlign = 'center';
        cc.fillText('WASD — Mover   |   Rato Dir. — Câmara   |   Rato Esq. — Recolher', 380, 30);
        this._ctrl.tex.needsUpdate = true;
        this.orthoScene.add(this._ctrl.sprite);
    }

    _construirIntro() {
        this._introBg = makeSprite(4, 4);
        const bg = this._introBg.ctx;
        bg.fillStyle = 'rgba(4,2,1,0.82)';
        bg.fillRect(0, 0, 4, 4);
        this._introBg.tex.needsUpdate = true;
        this.orthoScene.add(this._introBg.sprite);

        this._introTitulo = makeSprite(900, 120);
        const tt = this._introTitulo.ctx;
        tt.clearRect(0, 0, 900, 120);
        tt.fillStyle = '#D4AF37';
        tt.font = 'bold 62px Georgia,serif';
        tt.textAlign = 'center';
        tt.shadowColor = '#D4AF37';
        tt.shadowBlur = 28;
        tt.fillText("THE COLLECTOR'S BET", 450, 78);
        tt.shadowBlur = 0;
        this._introTitulo.tex.needsUpdate = true;
        this.orthoScene.add(this._introTitulo.sprite);

        this._introSub = makeSprite(600, 48);
        const st = this._introSub.ctx;
        st.fillStyle = '#7a5c1e';
        st.font = '24px Georgia,serif';
        st.textAlign = 'center';
        st.fillText('', 300, 34);
        this._introSub.tex.needsUpdate = true;
        this.orthoScene.add(this._introSub.sprite);

        this._introBotao = makeSprite(420, 70);
        this._desenharBotao(false);
        this.orthoScene.add(this._introBotao.sprite);

        this._botaoBounds = { w: 420, h: 70 };
        this._posicionarIntro();
    }

    _desenharBotao(hover) {
        const { ctx, tex } = this._introBotao;
        ctx.clearRect(0, 0, 420, 70);
        ctx.fillStyle = hover ? 'rgba(30,18,4,0.97)' : 'rgba(12,7,2,0.92)';
        roundRect(ctx, 0, 0, 420, 70, 12); ctx.fill();
        ctx.strokeStyle = hover ? '#FFD700' : '#D4AF37';
        ctx.lineWidth = hover ? 2.5 : 1.5;
        roundRect(ctx, 2, 2, 416, 66, 10); ctx.stroke();
        ctx.fillStyle = hover ? '#FFD700' : '#D4AF37';
        ctx.font = 'bold 26px Georgia,serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = hover ? '#D4AF37' : 'transparent';
        ctx.shadowBlur = hover ? 14 : 0;
        ctx.fillText('ENTRAR NO CASINO', 210, 44);
        ctx.shadowBlur = 0;
        tex.needsUpdate = true;
    }

    _posicionarIntro() {
        const w = window.innerWidth, h = window.innerHeight;
        this._introBg.sprite.scale.set(w, h, 1);
        this._introBg.sprite.position.set(0, 0, 0);
        this._introTitulo.sprite.scale.set(900, 120, 1);
        this._introTitulo.sprite.position.set(0, 80, 2);
        this._introSub.sprite.scale.set(600, 48, 1);
        this._introSub.sprite.position.set(0, -10, 2);
        this._introBotao.sprite.scale.set(420, 70, 1);
        this._introBotao.sprite.position.set(0, -110, 2);
    }

    _posicionar() {
        const w = window.innerWidth, h = window.innerHeight;
        const lh = Math.max(260, 50 + this._colItems.length * 34 + 16);
        this._lista.sprite.scale.set(280, lh, 1);
        this._lista.sprite.position.set(w/2 - 140 - 14, h/2 - lh/2 - 14, 1);
        this._notif.sprite.scale.set(560, 74, 1);
        this._notif.sprite.position.set(0, h/2 - 53, 1);
        this._ctrl.sprite.scale.set(760, 46, 1);
        this._ctrl.sprite.position.set(0, -h/2 + 23 + 12, 1);
    }

    setColecao(items) {
        this._colItems = items;
        const NOMES = {
            ficha_prata:'Ficha de Prata',
            trofeu:'Trofeu Cinzento',
            dado:'Dado Amarelo',
            moeda:'Moeda Azul',
        };
        const lh = 50 + items.length * 34 + 16;
        const { ctx, tex, canvas } = this._lista;
        canvas.height = lh;
        ctx.clearRect(0, 0, 280, lh);
        ctx.fillStyle = 'rgba(12,7,2,0.88)';
        roundRect(ctx, 0, 0, 280, lh, 10); ctx.fill();
        ctx.strokeStyle = '#8B6914'; ctx.lineWidth = 2;
        roundRect(ctx, 1.5, 1.5, 277, lh - 1.5, 9); ctx.stroke();
        ctx.strokeStyle = 'rgba(139,105,20,0.35)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(14, 44); ctx.lineTo(266, 44); ctx.stroke();
        ctx.fillStyle = '#D4AF37'; ctx.font = 'bold 14px Georgia,serif'; ctx.textAlign = 'left';
        ctx.fillText('COLEÇÃO', 14, 30);
        items.forEach((item, i) => {
            const y = 50 + i * 34 + 20;
            ctx.strokeStyle = item.recolhido ? '#D4AF37' : '#4a3010';
            ctx.lineWidth = 1.5; ctx.strokeRect(14, y - 11, 13, 13);
            if (item.recolhido) {
                ctx.fillStyle = '#D4AF37'; ctx.fillRect(14, y - 11, 13, 13);
                ctx.fillStyle = '#0a0604'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
                ctx.fillText('✓', 20.5, y + 0.5); ctx.textAlign = 'left';
            }
            ctx.fillStyle = item.recolhido ? 'rgba(212,175,55,0.4)' : '#9a7838';
            ctx.font = '13px Georgia,serif';
            ctx.fillText(NOMES[item.tipo] || item.tipo, 34, y + 1);
        });
        tex.needsUpdate = true;
        this._posicionar();
    }

    mostrarNotificacao(texto) {
        this._notifTimer = 2.6;
        const { ctx, tex } = this._notif;
        ctx.clearRect(0, 0, 560, 74);
        ctx.fillStyle = 'rgba(16,9,2,0.95)';
        roundRect(ctx, 0, 0, 560, 74, 10); ctx.fill();
        ctx.strokeStyle = '#D4AF37'; ctx.lineWidth = 2;
        roundRect(ctx, 1.5, 1.5, 557, 71, 9); ctx.stroke();
        ctx.fillStyle = '#D4AF37'; ctx.font = 'bold 21px Georgia,serif'; ctx.textAlign = 'center';
        ctx.fillText(texto, 280, 45);
        tex.needsUpdate = true;
        this._notif.sprite.material.opacity = 1;
    }

    testarCliqueBotao(clientX, clientY) {
        if (!this._introVisible) return false;
        const sp = this._introBotao.sprite;
        const sw = sp.scale.x / 2, sh = sp.scale.y / 2;
        const cx = sp.position.x, cy = sp.position.y;
        const ox = clientX - window.innerWidth  / 2;
        const oy = -(clientY - window.innerHeight / 2);
        return ox >= cx - sw && ox <= cx + sw && oy >= cy - sh && oy <= cy + sh;
    }

    testarHoverBotao(clientX, clientY) {
        if (!this._introVisible) return false;
        const hover = this.testarCliqueBotao(clientX, clientY);
        this._desenharBotao(hover);
        return hover;
    }

    esconderIntro(onDone) {
        let alpha = 1;
        const id = setInterval(() => {
            alpha -= 0.04;
            [this._introBg, this._introTitulo, this._introSub, this._introBotao].forEach(s => {
                s.sprite.material.opacity = Math.max(0, alpha);
            });
            if (alpha <= 0) {
                clearInterval(id);
                [this._introBg, this._introTitulo, this._introSub, this._introBotao].forEach(s => {
                    s.sprite.visible = false;
                });
                this._introVisible = false;
                this._lista.sprite.visible = true;
                this._ctrl.sprite.visible = true;
                this._posicionar();
                if (onDone) onDone();
            }
        }, 16);
    }

    atualizar(delta) {
        if (this._notifTimer > 0) {
            this._notifTimer -= delta;
            if (this._notifTimer < 0.7)
                this._notif.sprite.material.opacity = Math.max(0, this._notifTimer / 0.7);
        }
    }

    render() {
        this.renderer.clearDepth();
        this.renderer.render(this.orthoScene, this.orthoCamera);
    }
}