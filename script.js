const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

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
        
        // Desbloqueia habilidades a cada 3 níveis
        if (this.level % 3 === 0) {
            if (!this.unlockedAbilities.doubleBlackHole) {
                this.unlockedAbilities.doubleBlackHole = true;
                showMessage("Habilidade desbloqueada: Buraco Negro Duplo!");
            } else if (!this.unlockedAbilities.timeWarp) {
                this.unlockedAbilities.timeWarp = true;
                showMessage("Habilidade desbloqueada: Distorção Temporal!");
            }
        }
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
    },
    
    updateUI: function() {
        // Atualiza a UI com informações de progresso
    }
};

// ===== CONFIGURAÇÕES MELHORADAS =====
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

// ===== ELEMENTOS DE CONTROLE ADICIONAIS =====
const powerDisplay = document.getElementById("power");
const healthDisplay = document.getElementById("health");
const levelDisplay = document.getElementById("level");
const achievementsPanel = document.getElementById("achievementsPanel");

// ===== CLASSES MELHORADAS =====
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
        // Movimento básico com variação de nível
        this.x += this.speedX * (1 + progressionSystem.level * 0.05);
        this.y += this.speedY * (1 + progressionSystem.level * 0.05);
        this.life--;

        // Reset da partícula quando a vida acaba
        if (this.life <= 0) {
            this.reset();
            return;
        }

        // Limites da tela com efeito de ricochete
        if (this.x < 0 || this.x > canvas.width) {
            this.speedX *= -0.9;
            this.x = Math.max(0, Math.min(canvas.width, this.x));
        }
        if (this.y < 0 || this.y > canvas.height) {
            this.speedY *= -0.9;
            this.y = Math.max(0, Math.min(canvas.height, this.y));
        }

        // Interação com o mouse (melhorada)
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
        // Efeito de brilho melhorado
        ctx.shadowColor = this.highlight ? this.color : 'rgba(255,255,255,0.3)';
        ctx.shadowBlur = this.highlight ? 15 : 5;
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
    }
}

// ===== FUNÇÕES ADICIONAIS =====
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

// ===== FUNÇÕES EXISTENTES MELHORADAS =====
function initParticles() {
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawStars();
    drawConnections();
    
    // Atualizações do sistema de progressão
    progressionSystem.checkAchievements();
    progressionSystem.updateUI();
    
    // Atualiza e desenha partículas
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    // Atualiza displays
    powerDisplay.textContent = Math.floor(config.power);
    healthDisplay.textContent = Math.floor(config.health);
    levelDisplay.textContent = progressionSystem.level;
    
    requestAnimationFrame(animate);
}

// ===== EVENT LISTENERS ADICIONAIS =====
document.getElementById("doubleBlackHole").addEventListener('click', activateDoubleBlackHole);

// ... (restante dos event listeners existentes)

// ===== INICIALIZAÇÃO =====
initParticles();
animate();