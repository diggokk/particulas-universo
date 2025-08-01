// ===== NOVAS ALTERAÇÕES ===== 

// 1. Atualize o objeto config:
const config = {
    // ... (mantenha as outras propriedades)
    doubleBlackHole: false,
    doubleHoleDuration: 10000 // 10 segundos
};

// 2. Modifique a classe BlackHole para suportar efeitos especiais:
class BlackHole {
    constructor(x, y, isTemporary = false) {
        this.x = x || canvas.width/2;
        this.y = y || canvas.height/2;
        this.size = isTemporary ? 25 : 30; // Buracos temporários são menores
        this.rotation = 0;
        this.isTemporary = isTemporary;
        this.pulsePhase = 0;
    }

    update() {
        this.rotation += this.isTemporary ? 0.02 : 0.005; // Gira mais rápido se for temporário
        this.pulsePhase += 0.05;
        this.pulseSize = this.size + Math.sin(this.pulsePhase) * (this.isTemporary ? 8 : 5);
    }

    draw() {
        this.update();
        
        // Disco de acreção com efeito diferente para buracos temporários
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        const gradient = ctx.createRadialGradient(
            0, 0, this.pulseSize * 0.5,
            0, 0, this.pulseSize * (this.isTemporary ? 2.5 : 2)
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
            this.pulseSize * (this.isTemporary ? 2.5 : 2), 
            this.pulseSize * 0.8, 
            0, 0, Math.PI * 2
        );
        ctx.fill();
        ctx.restore();
        
        // Buraco negro principal
        const holeGradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.pulseSize
        );
        holeGradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        holeGradient.addColorStop(1, this.isTemporary 
            ? 'rgba(80, 50, 120, 0.8)' 
            : 'rgba(50, 50, 100, 0.8)'
        );
        
        ctx.fillStyle = holeGradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.pulseSize, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 3. Adicione a função de ativação:
function activateDoubleBlackHole() {
    if (!progressionSystem.unlockedAbilities?.doubleBlackHole || config.doubleBlackHole) return;
    
    config.doubleBlackHole = true;
    blackHoles.push(new BlackHole(
        mouse.x || canvas.width * 0.3, 
        mouse.y || canvas.height * 0.3,
        true
    ));
    
    showMessage("Buraco Negro Duplo Ativado!");
    
    setTimeout(() => {
        if (blackHoles.length > 1) {
            blackHoles.pop(); // Remove o buraco temporário
            showMessage("Buraco Negro Duplo Desativado");
        }
        config.doubleBlackHole = false;
    }, config.doubleHoleDuration);
}

// 4. Atualize o sistema de progressão:
const progressionSystem = {
    // ... (mantenha outras propriedades)
    unlockedAbilities: {
        doubleBlackHole: false
    },
    
    levelUp: function() {
        this.level++;
        this.experience = 0;
        
        // Desbloqueia no nível 3
        if (this.level === 3 && !this.unlockedAbilities.doubleBlackHole) {
            this.unlockedAbilities.doubleBlackHole = true;
            showMessage("Habilidade Desbloqueada: Buraco Negro Duplo! (Pressione D)");
        }
        
        supernova.explode(canvas.width/2, canvas.height/2);
    }
};

// 5. Modifique o loop principal para usar array de buracos negros:
let blackHoles = [new BlackHole()]; // Agora é um array

function animate() {
    // ... (código anterior)
    
    // Substitua blackHole.draw() por:
    blackHoles.forEach(hole => hole.draw());
    
    // ... (restante do código)
}

// 6. Atualize os controles (adicione ao event listener de teclado):
document.addEventListener('keydown', (e) => {
    // ... (outros controles)
    if (e.key.toLowerCase() === 'd') {
        activateDoubleBlackHole();
    }
});

// 7. Adicione interação entre partículas e buracos negros (dentro da classe Particle):
class Particle {
    // ... (métodos existentes)
    
    update() {
        // ... (código anterior)
        
        // Nova física: atração pelos buracos negros
        blackHoles.forEach(hole => {
            const dx = hole.x - this.x;
            const dy = hole.y - this.y;
            const distSq = dx*dx + dy*dy;
            const forceRadius = hole.pulseSize * 15;
            
            if (distSq < forceRadius * forceRadius && distSq > 100) {
                const dist = Math.sqrt(distSq);
                const force = (forceRadius / dist) * 0.1;
                this.x += dx * force / dist;
                this.y += dy * force / dist;
                
                // Efeito visual
                if (hole.isTemporary) {
                    this.color = `hsl(${(this.x + this.y) % 360}, 80%, 60%)`;
                }
            }
        });
    }
}