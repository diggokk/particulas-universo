const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

// ===== INICIALIZAÇÃO DO CANVAS =====
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ===== FUNÇÕES AUSENTES =====
function getRandomColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 80%, 60%)`;
}

function initParticles() {
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
        particles.push(new Particle());
    }
}

function drawStars() {
    if (!window.stars) {
        window.stars = [];
        for (let i = 0; i < config.starCount; i++) {
            window.stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.5,
                opacity: Math.random()
            });
        }
    }

    ctx.fillStyle = "white";
    window.stars.forEach(star => {
        ctx.globalAlpha = star.opacity;
        ctx.fillRect(star.x, star.y, star.size, star.size);
    });
    ctx.globalAlpha = 1;
}

function drawConnections() {
    const threshold = config.lineThreshold;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distanceSquared = dx * dx + dy * dy;
            
            if (distanceSquared < threshold * threshold) {
                const opacity = 1 - (Math.sqrt(distanceSquared) / threshold;
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function drawMouseDisk() {
    if (!mouse.x || !mouse.y) return;
    
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, config.mouseRadius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`;
    ctx.lineWidth = 1;
    ctx.stroke();
}

// ===== SISTEMA DE SUPERNOVA (MELHORADO) =====
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
        for (let i = 0; i < 150; i++) { // Aumentado para 150 partículas
            this.particles.push({
                x: this.x,
                y: this.y,
                speed: Math.random() * 7 + 3, // Aumentada velocidade
                angle: Math.random() * Math.PI * 2,
                size: Math.random() * 5 + 2, // Aumentado tamanho
                life: 80 + Math.random() * 80 // Vida mais longa
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
            p.size *= 0.97; // Decaimento mais lento
        });
        
        this.particles = this.particles.filter(p => p.life > 0);
        
        if (this.particles.length === 0 || this.frame >= this.duration * 1.5) {
            this.active = false;
        }
    },
    
    draw: function() {
        if (!this.active) return;
        
        // Onda de choque melhorada
        const gradient = ctx.createRadialGradient(
            this.x, this.y, this.radius * 0.2,
            this.x, this.y, this.radius
        );
        gradient.addColorStop(0, 'rgba(255, 230, 100, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 80, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Partículas com efeito de brilho
        this.particles.forEach(p => {
            const glow = ctx.createRadialGradient(
                p.x, p.y, 0,
                p.x, p.y, p.size * 3
            );
            glow.addColorStop(0, `rgba(255, ${200 - p.life}, 50, ${p.life/80 * 0.7})`);
            glow.addColorStop(1, 'rgba(255, 100, 0, 0)');
            
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = `rgba(255, ${150 + p.life}, 100, ${p.life/80})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }
};

// ===== BUURACO NEGRO (MELHORADO) =====
class BlackHole {
    constructor(x, y) {
        this.x = x || canvas.width/2;
        this.y = y || canvas.height/2;
        this.size = 30;
        this.power = 1;
        this.rotation = 0;
        this.pulsePhase = 0;
    }

    update() {
        this.rotation += 0.01;
        this.pulsePhase += 0.05;
        this.pulseSize = Math.sin(this.pulsePhase) * 5 + this.size;
    }

    draw() {
        this.update();
        
        // Disco de acreção
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.pulseSize * 2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(100, 150, 255, 0.3)`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Buraco negro
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.pulseSize
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        gradient.addColorStop(1, 'rgba(50, 50, 100, 0.8)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.pulseSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Anel
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        const ringGradient = ctx.createRadialGradient(
            0, 0, this.pulseSize * 0.8,
            0, 0, this.pulseSize * 1.5
        );
        ringGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        ringGradient.addColorStop(0.5, 'rgba(100, 150, 255, 0.3)');
        ringGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = ringGradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.pulseSize * 1.5, this.pulseSize * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// ===== SISTEMA DE PARTÍCULAS (OTIMIZADO) =====
class Particle {
    constructor() {
        this.reset();
        this.baseSpeedX = this.speedX;
        this.baseSpeedY = this.speedY;
        this.trail = [];
        this.maxTrailLength = 10;
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
        // Atualiza trilha
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }

        this.x += this.speedX * (1 + progressionSystem.level * 0.05);
        this.y += this.speedY * (1 + progressionSystem.level * 0.05);
        this.life--;

        if (this.life <= 0) {
            this.reset();
            return;
        }

        // Colisão com bordas (melhorada)
        if (this.x < 0 || this.x > canvas.width) {
            this.speedX *= -0.8;
            this.x = Math.max(this.size, Math.min(canvas.width - this.size, this.x));
        }
        if (this.y < 0 || this.y > canvas.height) {
            this.speedY *= -0.8;
            this.y = Math.max(this.size, Math.min(canvas.height - this.size, this.y));
        }

        this.handleMouseInteraction();
    }

    handleMouseInteraction() {
        if (!mouse.x || !mouse.y) return;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distanceSq = dx*dx + dy*dy;
        const mouseRadiusSq = config.mouseRadius * config.mouseRadius;
        
        if (distanceSq < mouseRadiusSq) {
            const distance = Math.sqrt(distanceSq);
            const angle = Math.atan2(dy, dx);
            const force = config.mouseRadius / (distance + 1);
            
            if (config.mode === 'attract') {
                this.x += Math.cos(angle) * force * 0.2;
                this.y += Math.sin(angle) * force * 0.2;
                config.power = Math.min(config.power + 0.01, 100);
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
        // Desenha trilha
        if (this.trail.length > 1) {
            ctx.strokeStyle = `${this.color.replace(')', ', 0.3)').replace('hsl', 'hsla')}`;
            ctx.lineWidth = this.size * 0.5;
            ctx.beginPath();
            ctx.moveTo(this.trail[0].x, this.trail[0].y);
            for (let i = 1; i < this.trail.length; i++) {
                ctx.lineTo(this.trail[i].x, this.trail[i].y);
            }
            ctx.stroke();
        }

        // Desenha partícula
        ctx.shadowColor = this.highlight ? this.color : 'rgba(255,255,255,0.3)';
        ctx.shadowBlur = this.highlight ? 15 : 5;
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
    }
}

// ===== CONTROLES INTERATIVOS =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'a') config.mode = 'attract';
    if (e.key === 'r') config.mode = 'repel';
    if (e.key === 'd' && progressionSystem.unlockedAbilities.doubleBlackHole) {
        activateDoubleBlackHole();
    }
    if (e.key === ' ') {
        supernova.explode(mouse.x || canvas.width/2, mouse.y || canvas.height/2);
    }
});

// ===== LOOP PRINCIPAL (OTIMIZADO) =====
let lastTime = 0;
const blackHoles = [new BlackHole()]; // Agora suporta múltiplos buracos negros

function animate(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    // Fundo com fade para efeito de trail
    ctx.fillStyle = 'rgba(0, 0, 10, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawStars();
    drawConnections();
    drawMouseDisk();
    
    progressionSystem.checkAchievements();
    
    // Atualiza power com decay
    config.power = Math.max(0, config.power - (0.05 * deltaTime / 16));
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    blackHoles.forEach(hole => hole.draw());
    supernova.update();
    supernova.draw();
    
    powerDisplay.textContent = Math.floor(config.power);
    healthDisplay.textContent = Math.floor(config.health);
    levelDisplay.textContent = progressionSystem.level;
    
    requestAnimationFrame(animate);
}

// ===== INICIALIZAÇÃO =====
const mouse = { x: 0, y: 0 };
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

initParticles();
animate();