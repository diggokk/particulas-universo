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
    doubleBlackHole: false,
    particleColorRange: [0, 360] // Padrão para todas as cores
};

// ===== ELEMENTOS DOM =====
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
const fpsCounter = document.getElementById("fps-counter");
const particleCounter = document.getElementById("particle-counter");

// ===== BOSS (OLHO) =====
class Boss {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 4;
        this.size = 80;
        this.pupilSize = 30;
        this.health = 100;
        this.color = '#FF5555';
        this.pulseSize = 0;
        this.pulsing = true;
    }
    
    draw() {
        if (this.pulsing) {
            this.pulseSize = Math.sin(Date.now() / 300) * 5;
        }
        
        ctx.save();
        
        // Branco do olho
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size + this.pulseSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Íris (vermelha)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, (this.size * 0.6) + this.pulseSize/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupila (preta)
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.pupilSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Brilho
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.arc(this.x - this.size/3, this.y - this.size/3, this.size/5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

const boss = new Boss();

// ===== SISTEMA DE SKINS E LOJA =====
const skinsSystem = {
    currentSkin: 'default',
    coins: 1000,
    unlockedSkins: ['default'],
    
    skins: {
        default: {
            name: "Clássico",
            emoji: "🌌",
            description: "Aparência padrão do universo",
            price: 0,
            effect: () => {
                config.particleColorRange = [0, 360];
            }
        },
        neon: {
            name: "Neon",
            emoji: "💠",
            description: "Cores vibrantes e brilhantes",
            price: 500,
            effect: () => {
                config.particleColorRange = [120, 240];
            }
        },
        fire: {
            name: "Inferno",
            emoji: "🔥",
            description: "Universo em chamas",
            price: 750,
            effect: () => {
                config.particleColorRange = [0, 40];
            }
        },
        ice: {
            name: "Gélido",
            emoji: "❄️",
            description: "Congele o universo",
            price: 750,
            effect: () => {
                config.particleColorRange = [180, 220];
            }
        },
        rainbow: {
            name: "Arco-Íris",
            emoji: "🌈",
            description: "Cores psicodélicas",
            price: 1000,
            effect: () => {
                config.particleColorRange = [0, 360];
            }
        },
        cosmic: {
            name: "Cósmico",
            emoji: "👁️",
            description: "Olho que tudo vê",
            price: 1500,
            effect: () => {
                config.particleColorRange = [240, 300];
            }
        }
    },
    
    applySkin: function(skinId) {
        if (!this.unlockedSkins.includes(skinId)) return false;
        
        this.currentSkin = skinId;
        const skin = this.skins[skinId];
        
        if (skin.effect) skin.effect();
        localStorage.setItem('currentSkin', skinId);
        
        return true;
    },
    
    purchaseSkin: function(skinId) {
        const skin = this.skins[skinId];
        if (!skin || this.unlockedSkins.includes(skinId)) return false;
        if (this.coins < skin.price) return false;
        
        this.coins -= skin.price;
        this.unlockedSkins.push(skinId);
        
        localStorage.setItem('unlockedSkins', JSON.stringify(this.unlockedSkins));
        localStorage.setItem('coins', this.coins);
        
        return true;
    },
    
    loadData: function() {
        const savedSkin = localStorage.getItem('currentSkin');
        const savedSkins = localStorage.getItem('unlockedSkins');
        const savedCoins = localStorage.getItem('coins');
        
        if (savedSkin) this.currentSkin = savedSkin;
        if (savedSkins) this.unlockedSkins = JSON.parse(savedSkins);
        if (savedCoins) this.coins = parseInt(savedCoins);
        
        this.applySkin(this.currentSkin);
    },
    
    renderShop: function() {
        const skinsGrid = document.getElementById('skins-grid');
        skinsGrid.innerHTML = '';
        
        for (const [skinId, skinData] of Object.entries(this.skins)) {
            const isUnlocked = this.unlockedSkins.includes(skinId);
            const isEquipped = this.currentSkin === skinId;
            
            const skinCard = document.createElement('div');
            skinCard.className = `skin-card ${isEquipped ? 'equipped' : ''} ${!isUnlocked ? 'locked' : ''}`;
            skinCard.dataset.skinId = skinId;
            
            skinCard.innerHTML = `
                <div class="skin-preview">${skinData.emoji}</div>
                <div class="skin-name">${skinData.name}</div>
                ${!isUnlocked ? `<div class="skin-price">${skinData.price} moedas</div>` : ''}
                <div class="skin-description">${skinData.description}</div>
            `;
            
            skinCard.addEventListener('click', () => {
                if (isUnlocked) {
                    this.applySkin(skinId);
                    this.renderShop();
                } else if (confirm(`Deseja comprar "${skinData.name}" por ${skinData.price} moedas?`)) {
                    if (this.purchaseSkin(skinId)) {
                        this.renderShop();
                        updateCurrencyDisplay();
                    } else {
                        alert("Moedas insuficientes!");
                    }
                }
            });
            
            skinsGrid.appendChild(skinCard);
        }
    }
};

// Inicializa o sistema de skins
skinsSystem.loadData();

// Atualiza o display de moedas
function updateCurrencyDisplay() {
    const currencyDisplay = document.getElementById('currency-display');
    if (!currencyDisplay) return;
    currencyDisplay.textContent = skinsSystem.coins;
}

// Cria o display de moedas
function createCurrencyDisplay() {
    if (document.getElementById('currency-display')) return;
    
    const display = document.createElement('div');
    display.id = 'currency-display';
    display.textContent = skinsSystem.coins;
    document.body.appendChild(display);
}

// Mostra/oculta a loja de skins
function toggleSkinsModal() {
    const modal = document.getElementById('skins-modal');
    if (modal.style.display === 'block') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'block';
        skinsSystem.renderShop();
    }
}

// Adiciona moedas
function addCoins(amount) {
    skinsSystem.coins += amount;
    localStorage.setItem('coins', skinsSystem.coins);
    updateCurrencyDisplay();
    
    const coinEffect = document.createElement('div');
    coinEffect.className = 'coin-effect';
    coinEffect.textContent = `+${amount}💰`;
    coinEffect.style.position = 'fixed';
    coinEffect.style.bottom = '20px';
    coinEffect.style.right = '20px';
    coinEffect.style.color = '#FFD700';
    coinEffect.style.fontSize = '24px';
    coinEffect.style.fontWeight = 'bold';
    coinEffect.style.animation = 'coinFloat 2s forwards';
    document.body.appendChild(coinEffect);
    
    setTimeout(() => {
        coinEffect.remove();
    }, 2000);
}

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
        this.size = 2;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.color = `hsl(${Math.random() * (config.particleColorRange[1] - config.particleColorRange[0]) + config.particleColorRange[0]}, 80%, 60%)`;
        this.alive = true;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
    }
    
    draw() {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        if (this.trail.length > 1) {
            ctx.strokeStyle = `${this.color}60`;
            ctx.lineWidth = this.size / 2;
            ctx.beginPath();
            ctx.moveTo(this.trail[0].x, this.trail[0].y);
            for (let i = 1; i < this.trail.length; i++) {
                ctx.lineTo(this.trail[i].x, this.trail[i].y);
            }
            ctx.stroke();
        }
        ctx.restore();
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
        ctx.save();
        ctx.fillStyle = `${w.color}60`;
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.size, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();

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

// ===== SISTEMA DE ESTRELAS DE FUNDO =====
let stars = [];

function initStars() {
    stars = Array(config.starCount).fill().map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5,
        alpha: Math.random() * 0.8 + 0.2
    }));
}

function drawStars() {
    ctx.save();
    stars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.restore();
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

// ===== ANIMAÇÃO PRINCIPAL =====
function animate() {
    ctx.fillStyle = 'rgba(0, 0, 20, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawStars();
    updateWormholes();
    boss.draw();

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    particles = particles.filter(p => {
        if (!p.alive || p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
            particlePool.pool.push(p);
            return false;
        }
        return true;
    });

    while (particles.length < config.particleCount) {
        particles.push(particlePool.get());
    }

    requestAnimationFrame(animate);
}

// Inicialização
function init() {
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        boss.x = canvas.width / 2;
        boss.y = canvas.height / 4;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Event listeners para a loja
    document.querySelector('[data-action="showSkins"]').addEventListener('click', toggleSkinsModal);
    document.getElementById('close-skins').addEventListener('click', toggleSkinsModal);
    
    createCurrencyDisplay();
    initStars();
    animate();
    
    // Adiciona algumas moedas iniciais (para teste)
    setTimeout(() => addCoins(500), 3000);
}

init();
