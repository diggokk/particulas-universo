// ===== CONFIGURAÇÕES GERAIS =====
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

// ===== FUNÇÕES AUXILIARES =====
function getRandomColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 80%, 60%)`;
}

function easeOutElastic(t) {
    return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1;
}

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

// ===== SISTEMA DE SUPERNOVA TURBINADA =====
const supernova = {
    active: false,
    x: 0,
    y: 0,
    radius: 0,
    maxRadius: Math.min(canvas.width, canvas.height) * 0.9,
    shockwaveParticles: [],
    coreParticles: [],
    debrisParticles: [],
    duration: 90,
    frame: 0,
    
    explode: function(x, y) {
        this.active = true;
        this.x = x || canvas.width/2;
        this.y = y || canvas.height/2;
        this.radius = 10;
        this.frame = 0;

        // Reset particles
        this.shockwaveParticles = [];
        this.coreParticles = [];
        this.debrisParticles = [];

        // Shockwave particles
        for (let i = 0; i < 300; i++) {
            this.shockwaveParticles.push({
                x: this.x,
                y: this.y,
                speed: Math.random() * 10 + 5,
                angle: Math.random() * Math.PI * 2,
                size: Math.random() * 8 + 4,
                life: 60 + Math.random() * 40,
                type: 'shockwave'
            });
        }

        // Core particles
        for (let i = 0; i < 150; i++) {
            this.coreParticles.push({
                x: this.x + (Math.random() - 0.5) * 20,
                y: this.y + (Math.random() - 0.5) * 20,
                speed: Math.random() * 3 + 1,
                angle: Math.random() * Math.PI * 2,
                size: Math.random() * 6 + 3,
                life: 90 + Math.random() * 60,
                type: 'core'
            });
        }

        // Debris particles
        for (let i = 0; i < 50; i++) {
            this.debrisParticles.push({
                x: this.x,
                y: this.y,
                speed: Math.random() * 3 + 1,
                angle: Math.random() * Math.PI * 2,
                size: Math.random() * 12 + 6,
                life: 120 + Math.random() * 80,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.1,
                type: 'debris'
            });
        }
    },

    update: function() {
        if (!this.active) return;
        
        this.frame++;
        this.radius = easeOutElastic(this.frame/this.duration) * this.maxRadius;

        const allParticles = [
            ...this.shockwaveParticles,
            ...this.coreParticles,
            ...this.debrisParticles
        ];

        allParticles.forEach(p => {
            p.x += Math.cos(p.angle) * p.speed;
            p.y += Math.sin(p.angle) * p.speed;
            
            switch(p.type) {
                case 'shockwave':
                    p.size *= 0.96;
                    p.life -= 1.5;
                    break;
                case 'core':
                    p.size *= 0.98;
                    p.life -= 0.7;
                    break;
                case 'debris':
                    p.rotation += p.rotationSpeed;
                    p.life -= 0.3;
                    break;
            }
        });

        this.shockwaveParticles = this.shockwaveParticles.filter(p => p.life > 0);
        this.coreParticles = this.coreParticles.filter(p => p.life > 0);
        this.debrisParticles = this.debrisParticles.filter(p => p.life > 0);

        if (this.frame >= this.duration && this.shockwaveParticles.length === 0) {
            this.active = false;
        }
    },

    draw: function() {
        if (!this.active) return;
        
        // Shockwave
        const gradient = ctx.createRadialGradient(
            this.x, this.y, this.radius * 0.1,
            this.x, this.y, this.radius
        );
        gradient.addColorStop(0, 'rgba(255, 240, 150, 0.9)');
        gradient.addColorStop(0.7, 'rgba(255, 100, 0, 0.5)');
        gradient.addColorStop(1, 'rgba(100, 50, 255, 0)');
        
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Particles
        const allParticles = [
            ...this.shockwaveParticles,
            ...this.coreParticles,
            ...this.debrisParticles
        ];
        
        allParticles.forEach(p => {
            ctx.save();
            
            switch(p.type) {
                case 'shockwave':
                    ctx.fillStyle = `hsla(${40 + (p.life % 30)}, 100%, 60%, ${p.life/100 * 0.7})`;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 'core':
                    const coreGradient = ctx.createRadialGradient(
                        p.x, p.y, 0,
                        p.x, p.y, p.size * 1.5
                    );
                    coreGradient.addColorStop(0, `hsla(60, 100%, 80%, ${p.life/150})`);
                    coreGradient.addColorStop(1, 'hsla(20, 100%, 50%, 0)');
                    ctx.fillStyle = coreGradient;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 'debris':
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rotation);
                    ctx.fillStyle = `hsla(${200 + p.life % 60}, 70%, 50%, ${p.life/200})`;
                    ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
                    break;
            }
            ctx.restore();
        });
        ctx.globalCompositeOperation = 'source-over';
    }
};

// ===== SISTEMA DE ESTRELAS DE FUNDO =====
function initStars() {
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

function drawStars() {
    if (!window.stars) initStars();
    
    ctx.fillStyle = "white";
    window.stars.forEach(star => {
        ctx.globalAlpha = star.opacity;
        ctx.fillRect(star.x, star.y, star.size, star.size);
    });
    ctx.globalAlpha = 1;
}

// ===== SISTEMA DE PARTÍCULAS =====
let particles = [];

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
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = getRandomColor();
        this.baseColor = this.color;
        this.highlight = false;
    }

    update() {
        // Update trail
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }

        this.x += this.speedX;
        this.y += this.speedY;

        // Border collision
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -0.8;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -0.8;
        this.x = Math.max(0, Math.min(canvas.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height, this.y));

        // Mouse interaction
        if (mouse.x && mouse.y) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distSq = dx*dx + dy*dy;
            const mouseRadiusSq = config.mouseRadius * config.mouseRadius;
            
            if (distSq < mouseRadiusSq) {
                const dist = Math.sqrt(distSq);
                const angle = Math.atan2(dy, dx);
                const force = config.mouseRadius / (dist + 1);
                
                if (config.mode === 'attract') {
                    this.x += Math.cos(angle) * force * 0.2;
                    this.y += Math.sin(angle) * force * 0.2;
                } else {
                    this.x -= Math.cos(angle) * force * 0.1;
                    this.y -= Math.sin(angle) * force * 0.1;
                }
                this.highlight = true;
            } else {
                this.highlight = false;
            }
        }
    }

    draw() {
        // Draw trail
        if (this.trail.length > 1) {
            ctx.strokeStyle = `${this.color.replace(')', ', 0.2)').replace('hsl', 'hsla')}`;
            ctx.lineWidth = this.size * 0.5;
            ctx.beginPath();
            ctx.moveTo(this.trail[0].x, this.trail[0].y);
            for (let i = 1; i < this.trail.length; i++) {
                ctx.lineTo(this.trail[i].x, this.trail[i].y);
            }
            ctx.stroke();
        }

        // Draw particle
        ctx.fillStyle = this.highlight ? `hsl(${(Date.now()/50) % 360}, 80%, 60%)` : this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
        particles.push(new Particle());
    }
}

// ===== SISTEMA DE BURACO NEGRO =====
class BlackHole {
    constructor(x, y) {
        this.x = x || canvas.width/2;
        this.y = y || canvas.height/2;
        this.size = 30;
        this.rotation = 0;
    }

    update() {
        this.rotation += 0.005;
    }

    draw() {
        this.update();
        
        // Accretion disk
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        const gradient = ctx.createRadialGradient(
            0, 0, this.size * 0.5,
            0, 0, this.size * 2
        );
        gradient.addColorStop(0, 'rgba(100, 150, 255, 0)');
        gradient.addColorStop(0.7, 'rgba(100, 200, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(100, 150, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 2, this.size * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Black hole
        const holeGradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size
        );
        holeGradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        holeGradient.addColorStop(1, 'rgba(50, 50, 100, 0.8)');
        
        ctx.fillStyle = holeGradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ===== SISTEMA DE PROGRESSÃO =====
const progressionSystem = {
    level: 1,
    experience: 0,
    addExperience: function(points) {
        this.experience += points;
        if (this.experience >= this.level * 100) {
            this.levelUp();
        }
    },
    levelUp: function() {
        this.level++;
        this.experience = 0;
        showMessage(`Level ${this.level} reached!`);
        supernova.explode(canvas.width/2, canvas.height/2);
    }
};

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
});

// ===== LOOP PRINCIPAL =====
const blackHole = new BlackHole();

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 20, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawStars();
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    blackHole.draw();
    supernova.update();
    supernova.draw();
    
    requestAnimationFrame(animate);
}

// ===== INICIALIZAÇÃO =====
initParticles();
initStars();
animate();