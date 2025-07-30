const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

// Configurações
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Estado do simulador
const config = {
    particleCount: 150,
    mouseRadius: 100,
    mode: 'repel', // 'attract' ou 'repel'
    lineThreshold: 100,
    starCount: 200
};

// Elementos de controle
const attractBtn = document.getElementById("attract");
const repelBtn = document.getElementById("repel");
const countDisplay = document.getElementById("count");
const particleRange = document.getElementById("particleRange");

// Estrelas de fundo
const stars = Array.from({ length: config.starCount }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 1.5,
    opacity: Math.random()
}));

// Partículas
let particles = [];
const mouse = { x: null, y: null };

// Cores aleatórias
function getRandomColor() {
    const colors = [
        '#4A00E0', '#8E2DE2', '#00F5A0', '#00D4FF', 
        '#FF5F6D', '#FFC371', '#7F00FF', '#E100FF'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

class Particle {
    constructor() {
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
        // Movimento básico
        this.x += this.speedX;
        this.y += this.speedY;

        // Limites da tela
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        // Interação com o mouse
        if (mouse.x && mouse.y) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < config.mouseRadius) {
                const force = config.mouseRadius / distance;
                const angle = Math.atan2(dy, dx);
                
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
        // Efeito de brilho quando destacada
        if (this.highlight) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.color;
        } else {
            ctx.shadowBlur = 5;
        }
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// Desenha estrelas de fundo
function drawStars() {
    ctx.fillStyle = 'white';
    stars.forEach(star => {
        ctx.globalAlpha = star.opacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
}

// Desenha linhas entre partículas próximas
function drawConnections() {
    particles.forEach(p1 => {
        particles.forEach(p2 => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < config.lineThreshold) {
                const opacity = 1 - (distance / config.lineThreshold);
                ctx.strokeStyle = `rgba(150, 150, 255, ${opacity * 0.3})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        });
    });
}

// Inicializa partículas
function initParticles() {
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
        particles.push(new Particle());
    }
}

// Loop de animação
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawStars();
    drawConnections();
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    requestAnimationFrame(animate);
}

// Event Listeners
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

attractBtn.addEventListener('click', () => {
    config.mode = 'attract';
    attractBtn.classList.add('active');
    repelBtn.classList.remove('active');
});

repelBtn.addEventListener('click', () => {
    config.mode = 'repel';
    repelBtn.classList.add('active');
    attractBtn.classList.remove('active');
});

particleRange.addEventListener('input', (e) => {
    config.particleCount = parseInt(e.target.value);
    countDisplay.textContent = config.particleCount;
    initParticles();
});

// Inicialização
initParticles();
repelBtn.classList.add('active'); // Modo repulsão ativo por padrão
animate();
// Configuração otimizada do buraco negro
class BlackHole {
    constructor() {
        this.size = 0;
        this.maxSize = 150;
        this.element = document.createElement('div');
        this.element.className = 'black-hole';
        document.body.appendChild(this.element);
    }

    update(x, y, active) {
        if (active) {
            this.size = Math.min(this.size + 3, this.maxSize);
            this.element.style.display = 'block';
        } else {
            this.size = Math.max(0, this.size - 6);
            if (this.size === 0) this.element.style.display = 'none';
        }
        
        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }
}