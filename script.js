// ===== CONFIGURAÇÕES =====
const config = {
    particleCount: 150,
    mouseRadius: 120,
    mode: 'attract',
    lineThreshold: 100,
    starCount: 200,
    power: 0,
    health: 100,
    blackHoleActive: false,
    doubleBlackHole: false
};

// ===== ELEMENTOS DOM =====
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
const fpsCounter = document.getElementById("fps-counter");
const particleCounter = document.getElementById("particle-counter");

// ===== SISTEMA DE POOL DE PARTÍCULAS =====
class Particle {
    constructor() {
        this.reset();
        this.trail = [];
        this.maxTrailLength = 5;
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.color = `hsl(${Math.random() * 360}, 80%, 60%)`;
        this.alive = true;
    }
}

class ParticlePool {
    constructor(size) {
        this.pool = Array(size).fill().map(() => new Particle());
    }
    
    get() {
        const particle = this.pool.find(p => !p.alive) || new Particle();
        particle.reset();
        return particle;
    }
}

const particlePool = new ParticlePool(1000);
let particles = Array(config.particleCount).fill().map(() => particlePool.get());

// ===== WORMHOLES =====
const wormholes = [
    { x: 100, y: 100, target: { x: canvas.width-100, y: canvas.height-100 }, size: 30, color: '#8A2BE2' },
    { x: canvas.width-100, y: canvas.height-100, target: { x: 100, y: 100 }, size: 30, color: '#00FFFF' }
];

function updateWormholes() {
    wormholes.forEach(w => {
        // Desenha o portal
        ctx.save();
        ctx.fillStyle = `${w.color}60`;
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.size, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();

        // Teletransporte
        particles.forEach(p => {
            const dist = Math.sqrt((p.x - w.x) ** 2 + (p.y - w.y) ** 2);
            if (dist < w.size) {
                p.x = w.target.x + (Math.random() - 0.5) * 20;
                p.y = w.target.y + (Math.random() - 0.5) * 20;
                p.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
            }
        });
    });
}

// ===== DEBUG SYSTEM =====
let lastTime = performance.now();
let fps = 0;

function updateDebugPanel() {
    const now = performance.now();
    fps = Math.round(1000 / (now - lastTime));
    lastTime = now;
    
    fpsCounter.textContent = fps;
    particleCounter.textContent = particles.length;
    
    requestAnimationFrame(updateDebugPanel);
}
updateDebugPanel();

// ===== [RESTANTE DO SEU CÓDIGO ORIGINAL] =====
// (Mantenha todo o restante do seu código JavaScript existente,
//  incluindo a classe BlackHole, Supernova, event listeners, etc.)

// ===== ANIMAÇÃO PRINCIPAL (ATUALIZADA) =====
function animate() {
    ctx.fillStyle = 'rgba(0, 0, 20, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawStars();
    updateWormholes();

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Filtra partículas "mortas" e adiciona novas se necessário
    particles = particles.filter(p => {
        if (!p.alive || p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
            particlePool.pool.push(p);
            return false;
        }
        return true;
    });

    // Mantém o número correto de partículas
    while (particles.length < config.particleCount) {
        particles.push(particlePool.get());
    }

    blackHole.draw();
    supernova.update();
    supernova.draw();

    requestAnimationFrame(animate);
}

// Inicialização
initStars();
animate();