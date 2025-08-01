// ===== CONFIGURAÇÕES GERAIS =====
const config = {
    particleCount: 100,
    mouseRadius: 100,
    mode: 'repel',
    lineThreshold: 100,
    starCount: 200,
    power: 0,
    health: 100,
    blackHoleActive: false,
    doubleBlackHole: false,
    doubleHoleDuration: 10000 // 10 segundos
};

// ===== ELEMENTOS DO DOM =====
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
const powerDisplay = document.getElementById("power");
const healthDisplay = document.getElementById("health");
const levelDisplay = document.getElementById("level");

// ===== INICIALIZAÇÃO DO CANVAS =====
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ===== SISTEMA DE CONQUISTAS =====
const achievements = {
    firstParticles: false,
    blackHoleMaster: false,
    doubleHoleUnlocked: false,
    check: function() {
        if (progressionSystem.level >= 3 && !this.doubleHoleUnlocked) {
            this.doubleHoleUnlocked = true;
            showMessage("Conquista: Mestre do Buraco Negro Desbloqueado!");
            updateAchievementsDisplay();
            return true;
        }
        return false;
    }
};

function updateAchievementsDisplay() {
    const achv2 = document.getElementById("achv2");
    if (achievements.doubleHoleUnlocked) {
        achv2.style.textDecoration = "line-through";
        achv2.style.color = "#00ff00";
    }
}

// ===== SISTEMA DE PROGRESSÃO =====
const progressionSystem = {
    level: 1,
    experience: 0,
    unlockedAbilities: {
        doubleBlackHole: false
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
        
        if (this.level === 3) {
            this.unlockedAbilities.doubleBlackHole = true;
            showMessage("Habilidade Liberada: Pressione [D] para Buraco Negro Duplo!");
            achievements.check();
        }
        
        supernova.explode(canvas.width/2, canvas.height/2);
    }
};

// ===== BURACO NEGRO (TAMANHO FIXO) =====
class BlackHole {
    constructor(x, y, isTemporary = false) {
        this.x = x || canvas.width/2;
        this.y = y || canvas.height/2;
        this.size = isTemporary ? 25 : 30;
        this.rotation = 0;
        this.isTemporary = isTemporary;
    }

    update() {
        this.rotation += this.isTemporary ? 0.02 : 0.005;
    }

    draw() {
        this.update();
        
        // Disco de acreção
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        const gradient = ctx.createRadialGradient(
            0, 0, this.size * 0.5,
            0, 0, this.size * (this.isTemporary ? 2.5 : 2)
        );
        
        if (this.isTemporary) {
            gradient.addColorStop(0, 'rgba(255, 100, 255, 0.1)');
            gradient.addColorStop(0.7, 'rgba(150, 200, 255, 0.4)');
            gradient.addColorStop(1, 'rgba(100, 150, 255, 0)');
        } else {
            gradient.addColorStop(0, 'rgba(100, 150, 255, 0)');
            gradient.addColorStop(0.7, 'rgba(100, 200, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(100, 150, 255, 0)');
        }
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, 
            this.size * (this.isTemporary ? 2.5 : 2), 
            this.size * 0.8, 
            0, 0, Math.PI * 2
        );
        ctx.fill();
        ctx.restore();
        
        // Buraco negro
        const holeGradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size
        );
        holeGradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        holeGradient.addColorStop(1, this.isTemporary 
            ? 'rgba(80, 50, 120, 0.8)' 
            : 'rgba(50, 50, 100, 0.8)'
        );
        
        ctx.fillStyle = holeGradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ===== SISTEMA DE SUPERNOVA ===== 
const supernova = {
    // ... (mantenha o mesmo código da supernova que você já tem)
};

// ===== PARTÍCULAS ===== 
class Particle {
    // ... (mantenha o mesmo código de partículas que você já tem)
}

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
    if (!progressionSystem.unlockedAbilities.doubleBlackHole || 
        config.doubleBlackHole || 
        blackHoles.length >= 2) return;
    
    config.doubleBlackHole = true;
    const x = mouse.x || canvas.width * 0.3;
    const y = mouse.y || canvas.height * 0.3;
    
    blackHoles.push(new BlackHole(x, y, true));
    showMessage("Buraco Negro Duplo Ativado! (10 segundos)");
    
    setTimeout(() => {
        if (blackHoles.length > 1) blackHoles.pop();
        config.doubleBlackHole = false;
    }, config.doubleHoleDuration);
}

// ===== CONTROLES =====
const mouse = { x: 0, y: 0 };
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'a') config.mode = 'attract';
    if (e.key === 'r') config.mode = 'repel';
    if (e.key === ' ') supernova.explode(mouse.x, mouse.y);
    if (e.key.toLowerCase() === 'd') activateDoubleBlackHole();
});

// ===== INICIALIZAÇÃO =====
let particles = [];
let blackHoles = [new BlackHole()];

function initParticles() {
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
        particles.push(new Particle());
    }
}

// ===== LOOP PRINCIPAL =====
function animate() {
    ctx.fillStyle = 'rgba(0, 0, 20, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => p.update());
    blackHoles.forEach(hole => hole.draw());
    particles.forEach(p => p.draw());
    
    supernova.update();
    supernova.draw();
    
    powerDisplay.textContent = config.power.toFixed(0);
    healthDisplay.textContent = config.health.toFixed(0);
    levelDisplay.textContent = progressionSystem.level;
    
    requestAnimationFrame(animate);
}

initParticles();
animate();