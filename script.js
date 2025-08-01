const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

// ===== SISTEMA DE SUPERNOVA =====
const supernova = {
    active: false,
    x: 0,
    y: 0,
    radius: 0,
    maxRadius: 0,
    particles: [],
    duration: 60,
    frame: 0,
    
    explode: function(x, y) {
        this.active = true;
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.maxRadius = Math.min(canvas.width, canvas.height) * 0.7;
        this.frame = 0;
        
        this.particles = [];
        for (let i = 0; i < 100; i++) {
            this.particles.push({
                x: this.x,
                y: this.y,
                speed: Math.random() * 5 + 2,
                angle: Math.random() * Math.PI * 2,
                size: Math.random() * 4 + 2,
                life: 60 + Math.random() * 60
            });
        }
    },
    
    update: function() {
        if (!this.active) return;
        
        this.frame++;
        this.radius = easeOut(this.frame/this.duration) * this.maxRadius;
        
        this.particles.forEach(p => {
            p.x += Math.cos(p.angle) * p.speed;
            p.y += Math.sin(p.angle) * p.speed;
            p.life--;
            p.size *= 0.98;
        });
        
        this.particles = this.particles.filter(p => p.life > 0);
        
        if (this.frame >= this.duration) {
            this.active = false;
        }
    },
    
    draw: function() {
        if (!this.active) return;
        
        // Onda de choque
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 200, 100, ${1 - this.frame/this.duration})`;
        ctx.lineWidth = 10;
        ctx.stroke();
        
        // Núcleo
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius * 0.3
        );
        gradient.addColorStop(0, 'rgba(255, 255, 200, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Partículas
        this.particles.forEach(p => {
            ctx.fillStyle = `rgba(255, ${200 - p.life}, 50, ${p.life/60})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }
};

function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
}

// ===== BUURACO NEGRO (TAMANHO FIXO) =====
class BlackHole {
    constructor() {
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        this.size = 30; // Tamanho fixo
        this.power = 1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}

// ===== SISTEMA DE PROGRESSÃO =====
const progressionSystem = {
    level: 1,
    experience: 0,
    unlockedAbilities: {
        doubleBlackHole: false,
        timeWarp: false,
        particleShield: false
    },
    achievements: {
        firstBlood: false,
        masterOfAttraction: false,
        connectionMaster: false
    },
    
    addExperience: function(points) {
        this.experience += points;
        if (this.experience >= this.level * 100) {
            this.levelUp();
        }
    },
    
    levelUp: function() {
        this.level++;
        this.experience = 0;
        showMessage(`Nível ${this.level} alcançado!`);
        
        if (this.level % 3 === 0) {
            if (!this.unlockedAbilities.doubleBlackHole) {
                this.unlockedAbilities.doubleBlackHole = true;
                showMessage("Habilidade desbloqueada: Buraco Negro Duplo!");
            } else if (!this.unlockedAbilities.timeWarp) {
                this.unlockedAbilities.timeWarp = true;
                showMessage("Habilidade desbloqueada: Distorção Temporal!");
            }
        }
        
        // Ativa supernova ao subir de nível
        supernova.explode(canvas.width/2, canvas.height/2);
    },
    
    checkAchievements: function() {
        if (!this.achievements.firstBlood && config.particleCount >= 200) {
            this.achievements.firstBlood = true;
            showMessage("Conquista: Primeiro Sangue!");
        }
        if (!this.achievements.masterOfAttraction && config.mode === 'attract') {
            this.achievements.masterOfAttraction = true;
            showMessage("Conquista: Mestre da Atração!");
        }
    }
};

// ===== CONFIGURAÇÕES =====
const config = {
    particleCount: 150,
    mouseRadius: 100,
    mode: 'repel',
    lineThreshold: 100,
    starCount: 200,
    power: 0,
    health: 100,
    blackHoleActive: false,
    doubleBlackHole: false
};

// ===== ELEMENTOS DE CONTROLE =====
const powerDisplay = document.getElementById("power");
const healthDisplay = document.getElementById("health");
const levelDisplay = document.getElementById("level");
const achievementsPanel = document.getElementById("achievementsPanel");

// ===== PARTÍCULAS =====
class Particle {
    constructor() {
        this.reset();
        this.baseSpeedX = this.speedX;
        this.baseSpeedY = this.speedY;
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = getRandomColor();
        this.baseColor = this.color;
        this.highlight = false;
        this.life = 1000 + Math.random() * 2000;
    }

    update() {
        this.x += this.speedX * (1 + progressionSystem.level * 0.05);
        this.y += this.speedY * (1 + progressionSystem.level * 0.05);
        this.life--;

        if (this.life <= 0) {
            this.reset();
            return;
        }

        if (this.x < 0 || this.x > canvas.width) {
            this.speedX *= -0.9;
            this.x = Math.max(0, Math.min(canvas.width, this.x));
        }
        if (this.y < 0 || this.y > canvas.height) {
            this.speedY *= -0.9;
            this.y = Math.max(0, Math.min(canvas.height, this.y));
        }

        this.handleMouseInteraction();
    }

    handleMouseInteraction() {
        if (!mouse.x || !mouse.y) return;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < config.mouseRadius) {
            const angle = Math.atan2(dy, dx);
            const force = config.mouseRadius / (distance + 1);
            
            if (config.mode === 'attract') {
                this.x += Math.cos(angle) * force * 0.2;
                this.y += Math.sin(angle) * force * 0.2;
                config.power += 0.01;
            } else {
                this.x -= Math.cos(angle) * force * 0.1;
                this.y -= Math.sin(angle) * force * 0.1;
            }
            
            this.highlight = true;
            this.color = `hsl(${(progressionSystem.level * 10) % 360}, 80%, 60%)`;
        } else {
            this.highlight = false;
            this.color = this.baseColor;
        }
    }

    draw() {
        ctx.shadowColor = this.highlight ? this.color : 'rgba(255,255,255,0.3)';
        ctx.shadowBlur = this.highlight ? 15 : 5;
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
    }
}

// Certifique-se que o objeto mouse está definido:
const mouse = { x: 0, y: 0 };

// Atualize as coordenadas do mouse:
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

// ===== FUNÇÕES AUXILIARES =====
function showMessage(text) {
    const message = document.createElement('div');
    message.className = 'game-message';
    message.textContent = text;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.classList.add('fade-out');
        setTimeout(() => document.body.removeChild(message), 1000);
    }, 2000);
}

function activateDoubleBlackHole() {
    if (!progressionSystem.unlockedAbilities.doubleBlackHole) return;
    
    config.doubleBlackHole = true;
    setTimeout(() => {
        config.doubleBlackHole = false;
    }, 5000);
}

// ===== LOOP PRINCIPAL =====
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawStars();
    drawConnections();
    drawMouseDisk();
    
    progressionSystem.checkAchievements();
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    blackHole.draw();
    supernova.update();
    supernova.draw();
    
    powerDisplay.textContent = Math.floor(config.power);
    healthDisplay.textContent = Math.floor(config.health);
    levelDisplay.textContent = progressionSystem.level;
    
    requestAnimationFrame(animate);
}

// ===== INICIALIZAÇÃO =====
const blackHole = new BlackHole();
let particles = [];
initParticles();
animate();