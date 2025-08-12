// =============================================
// CONFIGURAÇÕES DO JOGO (TODAS AS MELHORIAS)
// =============================================
const config = {
    particleCount: 150,
    mouseRadius: 150,
    particleRespawn: {
        minParticles: 50,  // Número mínimo de partículas para ativar o respawn
        respawnAmount: 20, // Quantidade de partículas criadas por respawn
        checkInterval: 60  // Verifica a cada X frames (60 = ~1 segundo se 60FPS)
    },
    galaxies: {
        unlocked: ['classic'],
        current: 'classic',
        list: {
            classic: {
                name: "Clássico",
                description: "O universo original de partículas",
                unlockCondition: "Inicial",
                particleColorRange: { h: [0, 360], s: [80, 90], l: [50, 70] },
                background: 'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)'
            },
            neon: {
                name: "Neon",
                description: "Cores vibrantes e partículas brilhantes",
                unlockCondition: "Alcançar nível 5",
                particleColorRange: { h: [280, 320], s: [100, 100], l: [60, 80] },
                background: 'radial-gradient(ellipse at bottom, #0f0c29 0%, #302b63 50%, #24243e 100%)'
            },
            fire: {
                name: "Inferno",
                description: "Partículas flamejantes e inimigos furiosos",
                unlockCondition: "Derrotar 50 inimigos",
                particleColorRange: { h: [10, 40], s: [80, 100], l: [50, 70] },
                background: 'radial-gradient(ellipse at bottom, #200122 0%, #6f0000 100%)'
            }
        }
    },
    xp: 0,
    level: 1,
    power: 1,
    health: 100,
    maxHealth: 100,
    bigBang: {
        unlocked: false,
        availableEvery: 15,
        nextUnlockLevel: 15,
        cooldown: 0,
        maxCooldown: 300,
        active: false
    },
    isBigBangActive: false,
    players: [
        {
            id: 1,
            x: null,
            y: null,
            mode: 'normal',
            color: '#4A00E0',
            radius: 150,
            size: 30,
            face: "🐶",
            faceSize: 28,
            power: 1,
            health: 100,
            maxHealth: 100,
            active: true,
            lastModeChange: 0,
            damage: 0.5,
            skills: {
                attractRadius: 1,
                vortexPower: 1,
                doubleVortex: false,
                healthBoost: 1,
                bigBangPower: 1
            }
        },
        {
            id: 2,
            x: null,
            y: null,
            mode: 'normal',
            color: '#00F5A0',
            radius: 150,
            size: 30,
            face: "🐱",
            faceSize: 28,
            power: 1,
            health: 100,
            maxHealth: 100,
            active: false,
            lastModeChange: 0,
            damage: 0.5,
            skills: {
                attractRadius: 1,
                vortexPower: 1,
                doubleVortex: false,
                healthBoost: 1,
                bigBangPower: 1
            }
        }
    ],
    coopMode: false,
    soundEnabled: true,
    gamePaused: false,
    wave: {
        number: 1,
        enemiesToSpawn: 5,
        spawned: 0,
        timer: 0,
        update: function() {
            if(this.spawned < this.enemiesToSpawn && this.timer++ > 60) {
                spawnEnemy();
                this.spawned++;
                this.timer = 0;
            }

            if(enemies.length === 0 && this.spawned >= this.enemiesToSpawn) {
                this.number++;
                this.enemiesToSpawn = 5 + this.number * 2;
                this.spawned = 0;
                showUnlockMessage(`Onda ${this.number} começando!`);
                updateStatsPanel();
                updateQuest('wave5', 1);
            }
        }
    },
    particlesAbsorbed: 0,
    enemiesDestroyed: 0,
    gameTime: 0,
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    comboCount: 0,
    lastAbsorptionTime: 0,
    screenShakeIntensity: 0,
    enemySystem: {
        spawnRate: 180,
        baseHealth: 3,
        baseSize: 20,
        eliteSizeMultiplier: 1.3,
        healthIncreasePerLevel: 0.3,
        types: {
            normal: { 
                chance: 0.5, 
                speed: 2.0, 
                behavior: 'wander', 
                face: [">:(", "X_X", ">_<", ":O"],
                color: '#FF5555'
            },
            hunter: { 
                chance: 0.3, 
                speed: 3.0, 
                behavior: 'hunt', 
                face: ["ಠ_ಠ", "◉_◉", "⊙_⊙", "⚆_⚆"],
                color: '#FF0000',
                huntRadius: 300
            },
            cosmic: { 
                chance: 0.15, 
                speed: 1.8, 
                behavior: 'teleport', 
                face: ["☄️", "🌌", "🌠", "✨"], 
                special: 'shield',
                color: '#00AAFF',
                teleportChance: 0.008
            },
            ancient: { 
                chance: 0.05, 
                speed: 1.0, 
                behavior: 'orbit', 
                face: ["👁️", "🜏", "⚚", "♆"], 
                special: 'healer',
                color: '#AA00FF',
                orbitDistance: 100
            }
        },
        eliteMultiplier: 1.5,
        blackHoleChance: 0.02
    },
    quests: {
        active: [
            { id: 'absorb100', target: 100, current: 0, reward: 50, title: "Absorver 100 partículas" },
            { id: 'defeat20', target: 20, current: 0, reward: 100, title: "Derrotar 20 inimigos" },
            { id: 'wave5', target: 5, current: 1, reward: 200, title: "Alcançar onda 5" }
        ],
        completed: []
    },
    soundEffects: {},
    skills: {
        unlocked: [],
        tree: {
            attractRadius: { 
                name: "Raio de Atração", 
                cost: 2, 
                maxLevel: 5, 
                effect: "Aumenta o raio de atração em 20% por nível",
                currentLevel: 0 
            },
            vortexPower: { 
                name: "Poder do Vórtice", 
                cost: 3, 
                maxLevel: 3, 
                effect: "Aumenta a força do vórtice em 30% por nível",
                currentLevel: 0 
            },
            healthBoost: { 
                name: "Vitalidade", 
                cost: 1, 
                maxLevel: 10, 
                effect: "Aumenta saúde máxima em 10% por nível",
                currentLevel: 0 
            },
            bigBangPower: { 
                name: "Big Bang Plus", 
                cost: 5, 
                maxLevel: 2, 
                effect: "Aumenta o XP ganho com Big Bang em 50% por nível",
                currentLevel: 0 
            },
            particleMastery: { 
                name: "Domínio de Partículas", 
                cost: 4, 
                maxLevel: 3, 
                effect: "Partículas dão 20% mais XP",
                currentLevel: 0,
                requires: ["attractRadius:3"] 
            }
        }
    },
    skillPoints: 0,
    story: {
        enabled: true,
        currentScene: 0,
        scenes: [
            {
                npc: "👁️",
                text: "MORTAL... VOCÊ OUSA INVADIR MEU UNIVERSO?",
                background: "radial-gradient(ellipse at center, #200122 0%, #6f0000 100%)",
                effect: "terror" // Ativa modo terror
            },
            {
                npc: "👁️",
                text: "EU SOU AZATHOTH, O DEVORADOR DE GALÁXIAS...",
                background: "radial-gradient(ellipse at center, #000000 0%, #4a0000 100%)",
                effect: "terror"
            },
            {
                npc: "👽",
                text: "*sussurro* Psst... Não olhe diretamente para ele! Use as partículas para se fortalecer...",
                background: "radial-gradient(ellipse at center, #1B2735 0%, #090A0F 100%)",
                effect: "normal"
            },
            {
                npc: "👁️",
                text: "SEU DESTINO É SER DESTRUÍDO COMO TODOS OS OUTROS!",
                background: "radial-gradient(ellipse at center, #300000 0%, #000000 100%)",
                effect: "terror",
                shake: true // Ativa tremor de tela
            }
        ]
    },
    npc: {
        active: true,
        currentDialog: 0,
        dialogs: [
            "Ah, finalmente acordou... Tava demorando, hein?",
            "Olha só, um novato no universo. Vamos ver quanto tempo você dura...",
            "Cuidado com essas partículas, elas são mais espertas do que parecem!",
            "Tá com medo? Eu também estaria...",
            "Se você chegar no nível 50, algo MUITO grande te espera...",
            "Você realmente acha que está no controle? Kkk...",
            "Pressione 1, 2 ou 3... se conseguir lembrar qual é qual.",
            "Já tentou o Big Bang? Ou ainda não é digno?",
            "Os inimigos estão rindo de você... literalmente.",
            "Você é lento... mas pelo menos é consistente.",
            // NOVOS DIÁLOGOS ADICIONADOS:
            "Sabia que cada galáxia tem suas próprias leis da física? Divertido, né?",
            "Eu já vi jogadores melhores... mas também vi piores.",
            "Quer um conselho? Não confie nas partículas roxas.",
            "O modo cooperativo é para quem não consegue sozinho... igual você!",
            "Já perdi a conta de quantos universos eu vi serem destruídos...",
            "Você está evoluindo... mas ainda tem muito o que aprender.",
            "As habilidades que você desbloqueia são só a ponta do iceberg!",
            "Nível 100? Isso é só o tutorial, meu caro...",
            "Os inimigos estão ficando mais fortes... ou você que está ficando mais fraco?",
            "Você nota como o universo reage às suas ações? Interessante..."
        ],
        bossDialog: "🏆 PARABÉNS! Agora o verdadeiro desafio começa... 🐉"
    },
    skins: {
        available: [
            {
                id: 'default',
                name: 'Viajante',
                emoji: '🐶',
                type: 'normal',
                unlocked: true
            },
            {
                id: 'cosmic',
                name: 'Ser Cósmico',
                emoji: '👽',
                type: 'premium',
                unlocked: false,
                unlockCondition: 'Alcançar nível 10'
            },
            {
                id: 'nebula',
                name: 'Nebulosa',
                emoji: '🌌',
                type: 'normal',
                unlocked: true
            },
            {
                id: 'blackhole',
                name: 'Buraco Negro',
                emoji: '⚫',
                type: 'premium',
                unlocked: false,
                unlockCondition: 'Derrotar 100 inimigos'
            },
            {
                id: 'ancient',
                name: 'Antigo',
                emoji: '👁️',
                type: 'premium',
                unlocked: false,
                unlockCondition: 'Completar todas as missões'
            }
        ],
        current: 'default'
    }
};

// =============================================
// VARIÁVEIS GLOBAIS
// =============================================
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let enemies = [];
let lastUpdateIndex = 0;
let lastTime = 0;
let fps = 60;
let fpsLastChecked = 0;
let frameCount = 0;
let gameLoopRunning = false;

// =============================================
// FUNÇÕES DO JOGO (TODAS AS MELHORIAS)
// =============================================

// 1. SISTEMA DE INIMIGOS
function spawnEnemy() {
    try {
        // Seleciona tipo de inimigo baseado nas chances
        let random = Math.random();
        let typeKey = 'normal';
        let cumulativeChance = 0;
        
        for (const [key, type] of Object.entries(config.enemySystem.types)) {
            cumulativeChance += type.chance;
            if (random <= cumulativeChance) {
                typeKey = key;
                break;
            }
        }
        
        const type = config.enemySystem.types[typeKey];
        const isElite = Math.random() < 0.1;
        
        const enemy = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            type: typeKey,
            health: config.enemySystem.baseHealth + 
                   (config.wave.number * config.enemySystem.healthIncreasePerLevel),
            speed: type.speed * (isElite ? config.enemySystem.eliteMultiplier : 1),
            face: type.face[Math.floor(Math.random() * type.face.length)],
            isElite,
            behavior: type.behavior,
            color: type.color,
            size: config.enemySystem.baseSize * (isElite ? config.enemySystem.eliteSizeMultiplier : 1)
        };
        
        // Adiciona propriedades específicas do tipo
        if (typeKey === 'hunter') enemy.huntRadius = type.huntRadius;
        if (typeKey === 'cosmic') enemy.teleportChance = type.teleportChance;
        if (typeKey === 'ancient') enemy.orbitDistance = type.orbitDistance;
        
        enemies.push(enemy);
        updateStatsPanel();
        return enemy;
    } catch (error) {
        console.error("Erro ao spawnar inimigo:", error);
        return null;
    }
}

function updateEnemies(deltaTime) {
    const player = config.players[0];
    
    enemies.forEach(enemy => {
        // Comportamento baseado no tipo
        switch(enemy.behavior) {
            case 'hunt':
                // Persegue o jogador apenas dentro do raio de detecção
                const dx = player.x - enemy.x;
                const dy = player.y - enemy.y;
                const distSq = dx*dx + dy*dy;
                const dist = Math.sqrt(distSq);
                
                if (dist > 0 && dist < enemy.huntRadius) {
                    enemy.x += (dx / dist) * enemy.speed * (deltaTime / 16.67);
                    enemy.y += (dy / dist) * enemy.speed * (deltaTime / 16.67);
                } else {
                    // Movimento aleatório quando não está perseguindo
                    enemy.x += (Math.random() - 0.5) * enemy.speed * 0.5 * (deltaTime / 16.67);
                    enemy.y += (Math.random() - 0.5) * enemy.speed * 0.5 * (deltaTime / 16.67);
                }
                break;
                
            case 'teleport':
                // Movimento normal com chance de teletransporte
                enemy.x += (Math.random() - 0.5) * enemy.speed * (deltaTime / 16.67);
                enemy.y += (Math.random() - 0.5) * enemy.speed * (deltaTime / 16.67);
                
                if (Math.random() < enemy.teleportChance) {
                    enemy.x = Math.random() * canvas.width;
                    enemy.y = Math.random() * canvas.height;
                }
                break;
                
            case 'orbit':
                // Orbita o jogador mantendo distância
                const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
                const targetX = player.x + Math.cos(angle + Math.PI/2) * enemy.orbitDistance;
                const targetY = player.y + Math.sin(angle + Math.PI/2) * enemy.orbitDistance;
                
                enemy.x += (targetX - enemy.x) * 0.05 * (deltaTime / 16.67);
                enemy.y += (targetY - enemy.y) * 0.05 * (deltaTime / 16.67);
                break;
                
            default: // 'wander'
                // Movimento aleatório mais suave
                enemy.x += (Math.random() - 0.5) * enemy.speed * (deltaTime / 16.67);
                enemy.y += (Math.random() - 0.5) * enemy.speed * (deltaTime / 16.67);
        }
        
        // Mantém dentro da tela com margem
        enemy.x = Math.max(10, Math.min(canvas.width - 10, enemy.x));
        enemy.y = Math.max(10, Math.min(canvas.height - 10, enemy.y));
        
        // Verifica colisão com jogador
        const distToPlayer = Math.sqrt(
            Math.pow(enemy.x - player.x, 2) + 
            Math.pow(enemy.y - player.y, 2)
        );
        
        if (distToPlayer < (player.size + enemy.size) * 0.6) {
            player.health -= 0.3 * (deltaTime / 16.67);
            updateHealthBar();
            
            // Feedback visual
            if (Date.now() % 200 < 50) {
                document.getElementById('health-bar').style.opacity = '0.5';
            } else {
                document.getElementById('health-bar').style.opacity = '1';
            }

            // Verifica se o jogador morreu
            if (player.health <= 0) {
                player.health = 0;
                updateHealthBar();
                showGameOver();
            }
        }
    });
}

// 2. SISTEMA DE PARTÍCULAS (COM RESPAWN AUTOMÁTICO)
const particlePool = [];

function getParticle(x, y) {
    // Posições aleatórias longe do jogador (evita spawn na frente)
    const spawnPadding = 200;
    let posX, posY;
    
    do {
        posX = x !== undefined ? x : Math.random() * canvas.width;
        posY = y !== undefined ? y : Math.random() * canvas.height;
    } while (
        Math.abs(posX - config.players[0].x) < spawnPadding && 
        Math.abs(posY - config.players[0].y) < spawnPadding
    );

    if (particlePool.length > 0) {
        const p = particlePool.pop();
        p.x = posX;
        p.y = posY;
        p.size = Math.random() * 4 + 2;
        p.color = `hsl(${Math.random() * 360}, 80%, 60%)`;
        p.speedX = (Math.random() - 0.5) * 3;
        p.speedY = (Math.random() - 0.5) * 3;
        p.baseSpeedX = p.speedX;
        p.baseSpeedY = p.speedY;
        p.trail = [];
        p.life = undefined;
        return p;
    }
    return createParticle(posX, posY);
}

function createParticle(x, y) {
    const types = [
        { color: `hsl(${Math.random() * 60 + 180}, 80%, 60%)`, size: 3, xp: 1 }, // Normal
        { color: `hsl(${Math.random() * 60 + 60}, 80%, 60%)`, size: 5, xp: 2 }, // Grande
        { color: `hsl(${Math.random() * 60 + 300}, 80%, 60%)`, size: 2, xp: 3, special: 'speed' }, // Rápida
        { color: 'white', size: 6, xp: 5, special: 'heal' } // Cura
    ];
    
    const type = Math.random() > 0.8 ? types[Math.floor(Math.random() * types.length)] : types[0];
    
    return {
        x: x,
        y: y,
        size: type.size,
        color: type.color,
        xpValue: type.xp,
        special: type.special,
        speedX: (Math.random() - 0.5) * (type.special === 'speed' ? 6 : 3),
        speedY: (Math.random() - 0.5) * (type.special === 'speed' ? 6 : 3),
        trail: []
    };
}

function initParticles() {
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
        particles.push(getParticle());
    }
}

function autoRespawnParticles() {
    if (particles.length < config.particleRespawn.minParticles) {
        for (let i = 0; i < config.particleRespawn.respawnAmount; i++) {
            const p = getParticle();
            p.size = 10; // Partículas começam grandes
            p.targetSize = p.size; // Tamanho original
            particles.push(p);
        }
        playSound('respawn');
    }
}

function updateParticles(deltaTime) {
    const player = config.players[0];
    const updatesThisFrame = Math.min(100, particles.length);
    
    for (let i = 0; i < updatesThisFrame; i++) {
        const idx = (lastUpdateIndex + i) % particles.length;
        const p = particles[idx];
        
        // Reduz tamanho se for partícula respawnada
        if (p.size > (p.targetSize || 3)) {
            p.size -= 0.1;
        }
        
        // Movimento básico
        p.x += p.speedX * (deltaTime / 16.67);
        p.y += p.speedY * (deltaTime / 16.67);
        
        // Interação com o jogador
        const dx = player.x - p.x;
        const dy = player.y - p.y;
        const distSq = dx*dx + dy*dy;
        const dist = Math.sqrt(distSq);
        
        if (distSq < player.radius*player.radius) {
            // Efeito de sucção quando muito próximo (20% do raio)
            const suctionRadius = player.radius * 0.2;
            const isVeryClose = dist < suctionRadius;
            
            // Modo atração - efeito mais forte quando perto
            if (player.mode === 'attract') {
                const force = isVeryClose ? 0.5 : 0.1; // Mais forte quando perto
                const nx = dx/dist;
                const ny = dy/dist;
                
                p.speedX += nx * force * (1 - dist/player.radius) * (deltaTime / 16.67);
                p.speedY += ny * force * (1 - dist/player.radius) * (deltaTime / 16.67);
                
                // Absorve a partícula se estiver muito perto
                if (isVeryClose && dist < player.size * 0.8) {
                    // Ganha XP baseado no tipo de partícula
                    const xpGain = p.xpValue || 1;
                    config.xp += xpGain;
                    config.particlesAbsorbed++;
                    
                    // Toca som
                    playSound('absorb');
                    
                    // Remove a partícula
                    particlePool.push(particles.splice(idx, 1)[0]);
                    updateXPBar();
                    updateStatsPanel();
                    updateQuest('absorb100');
                    checkLevelUp();
                    continue; // Pula para a próxima partícula
                }
            }
            // Modo repulsão (mantido igual)
            else if (player.mode === 'repel') {
                const nx = dx/dist;
                const ny = dy/dist;
                p.speedX -= nx * 0.2 * (1 - dist/player.radius) * (deltaTime / 16.67);
                p.speedY -= ny * 0.2 * (1 - dist/player.radius) * (deltaTime / 16.67);
            }
        }
        
        // Limites da tela
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -0.8;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -0.8;
        
        // Atualiza trilha
        p.trail.push({x: p.x, y: p.y, size: p.size});
        if (p.trail.length > 5) p.trail.shift();
    }
    
    lastUpdateIndex = (lastUpdateIndex + updatesThisFrame) % particles.length;
}

// 3. SISTEMA DE BIG BANG
function checkBigBangUnlock() {
    // Verifica se o jogador alcançou um nível de desbloqueio
    if (config.level >= config.bigBang.nextUnlockLevel && !config.bigBang.unlocked) {
        config.bigBang.unlocked = true;
        config.bigBang.nextUnlockLevel += config.bigBang.availableEvery;
        showUnlockMessage("HABILIDADE DESBLOQUEADA: Big Bang Cósmico! (Barra de Espaço)");
        
        // Ativa o botão do Big Bang
        document.getElementById('bigbang-btn').style.display = 'flex';
        updateBigBangRequirement();
    }
}

function activateBigBang() {
    // Verifica se está desbloqueado e disponível
    if (!config.bigBang.unlocked || config.bigBang.cooldown > 0 || config.bigBang.active) {
        if (!config.bigBang.unlocked) {
            showUnlockMessage(`Desbloqueie o Big Bang no nível ${config.bigBang.nextUnlockLevel}`);
        }
        return;
    }
    
    config.bigBang.active = true;
    config.gamePaused = true;
    
    // Mostra mensagem dramática
    const message = document.getElementById('big-bang-message');
    message.style.opacity = '1';
    
    // Toca o som
    playSound('bigBang');
    
    // Fase 1: Preparação (3 segundos)
    setTimeout(() => {
        // Remove a mensagem
        message.style.opacity = '0';
        
        // Cria a supernova
        const supernova = document.getElementById('supernova');
        const shockwave = document.getElementById('shockwave');
        
        // Configura a supernova
        supernova.style.width = '0';
        supernova.style.height = '0';
        supernova.style.opacity = '1';
        
        // Animação de crescimento da supernova
        const growSupernova = () => {
            const size = parseInt(supernova.style.width || '0') + 10;
            supernova.style.width = `${size}px`;
            supernova.style.height = `${size}px`;
            
            if (size < 300) {
                requestAnimationFrame(growSupernova);
            } else {
                // Explosão final
                explodeSupernova();
            }
        };
        
        growSupernova();
        
        // Configura a shockwave
        shockwave.style.animation = 'shockwave 1.5s forwards';
        
    }, 3000);
    
    function explodeSupernova() {
        // Efeito visual de explosão
        const supernova = document.getElementById('supernova');
        supernova.style.animation = 'supernova-explosion 1s forwards';
        
        // Flash branco
        document.body.style.animation = 'cosmic-flash 0.5s';
        
        // Tremor de tela intenso
        document.body.classList.add('camera-shake');
        
        // Efeitos de partículas (expandir todas para fora)
        particles.forEach(p => {
            const angle = Math.atan2(p.y - config.players[0].y, p.x - config.players[0].x);
            const force = 20 + Math.random() * 10;
            p.speedX = Math.cos(angle) * force;
            p.speedY = Math.sin(angle) * force;
        });
        
        // Remove inimigos e concede XP
        enemies.forEach(enemy => {
            config.xp += enemy.isElite ? 5 : 2;
            config.enemiesDestroyed++;
            updateQuest('defeat20');
        });
        enemies = [];
        
        // Atualiza UI
        updateXPBar();
        updateStatsPanel();
        
        // Fim dos efeitos (2 segundos depois)
        setTimeout(() => {
            document.body.classList.remove('camera-shake');
            supernova.style.opacity = '0';
            supernova.style.animation = '';
            document.body.style.animation = '';
            
            // Reseta cooldown
            config.bigBang.cooldown = config.bigBang.maxCooldown;
            document.getElementById('bigbang-btn').classList.remove('bigbang-ready');
            config.bigBang.active = false;
            config.gamePaused = false;
            
            // Verifica se subiu de nível com a recompensa
            checkLevelUp();
            
            // Esconde o botão até o próximo desbloqueio se for o caso
            if (config.level < config.bigBang.nextUnlockLevel) {
                document.getElementById('bigbang-btn').style.display = 'none';
                config.bigBang.unlocked = false;
            }
        }, 2000);
    }
}

function updateBigBangCooldownUI() {
    if (!config.bigBang.unlocked) return;
    
    const progress = (1 - (config.bigBang.cooldown / config.bigBang.maxCooldown)) * 100;
    document.getElementById('bigbang-progress').style.width = `${progress}%`;
    document.querySelector('.cooldown-overlay').style.width = `${100 - progress}%`;
    
    if (config.bigBang.cooldown === 0) {
        document.getElementById('bigbang-btn').classList.add('bigbang-ready');
    }
}

function updateBigBangRequirement() {
    const requirementEl = document.getElementById('bigbang-requirement');
    
    if (config.bigBang.unlocked) {
        requirementEl.textContent = `Próximo em nível ${config.bigBang.nextUnlockLevel}`;
    } else {
        requirementEl.textContent = `Desbloqueie no nível ${config.bigBang.nextUnlockLevel}`;
    }
}

// 4. SISTEMA DE MENU E CONTROLES
function setupControls() {
    // Fecha menu quando clicar fora
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('menu');
        if (menu.style.display === 'block' && !e.target.closest('#menu') && e.target.id !== 'menu-toggle') {
            menu.style.display = 'none';
        }
    });

    // Menu toggle
    document.getElementById('menu-toggle').addEventListener('click', (e) => {
        e.stopPropagation();
        const menu = document.getElementById('menu');
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });

    // Controle delegado para todos os itens do menu
    document.getElementById('menu').addEventListener('click', (e) => {
        const menuItem = e.target.closest('.menu-item');
        if (!menuItem) return;

        const action = menuItem.getAttribute('data-action');
        const mode = menuItem.getAttribute('data-mode');

        switch(action) {
            case 'setMode':
                setPlayerMode(mode);
                highlightActiveMode();
                break;
                
            case 'toggleCoop':
                toggleCoopMode();
                break;
                
            case 'showGalaxies':
                showGalaxyMap();
                break;
                
            case 'showSkills':
                showSkillTree();
                break;
                
            case 'showSkins':
                showSkinsModal();
                break;
                
            case 'resetGame':
                resetGame();
                break;
                
            case 'toggleSound':
                toggleSound();
                break;
        }
    });

    // Botão Big Bang
    document.getElementById('bigbang-btn').addEventListener('click', activateBigBang);

    // Controles mobile
    if (config.isMobile) {
        document.getElementById('mobileAttract').addEventListener('touchstart', (e) => {
            e.preventDefault();
            config.players[0].mode = 'attract';
            e.target.classList.add('active');
        });
        
        document.getElementById('mobileRepel').addEventListener('touchstart', (e) => {
            e.preventDefault();
            config.players[0].mode = 'repel';
            e.target.classList.add('active');
        });
        
        document.getElementById('mobileVortex').addEventListener('touchstart', (e) => {
            e.preventDefault();
            config.players[0].mode = 'vortex';
            e.target.classList.add('active');
        });
        
        // Reset ao soltar
        ['mobileAttract', 'mobileRepel', 'mobileVortex'].forEach(id => {
            const btn = document.getElementById(id);
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                config.players[0].mode = 'normal';
                btn.classList.remove('active');
            });
        });
    }
    
    // Controles de teclado
    window.addEventListener('keydown', (e) => {
        if (config.gamePaused) return;
        
        const player2 = config.players[1];
        const speed = 5;
        
        // Controles do jogador 2 (WASD)
        if (config.coopMode && player2.active) {
            switch(e.key.toLowerCase()) {
                case 'w': player2.y -= speed; break;
                case 'a': player2.x -= speed; break;
                case 's': player2.y += speed; break;
                case 'd': player2.x += speed; break;
            }
        }
        
        // Controles do jogador 1 (1-3 e espaço)
        switch(e.key) {
            case '1': 
                config.players[0].mode = 'attract';
                document.getElementById('mobileAttract')?.classList.add('active');
                break;
            case '2': 
                config.players[0].mode = 'repel';
                document.getElementById('mobileRepel')?.classList.add('active');
                break;
            case '3': 
                config.players[0].mode = 'vortex';
                document.getElementById('mobileVortex')?.classList.add('active');
                break;
            case ' ': 
                activateBigBang();
                break;
        }
    });
    
    window.addEventListener('keyup', (e) => {
        if (['1', '2', '3'].includes(e.key)) {
            config.players[0].mode = 'normal';
            document.getElementById('mobileAttract')?.classList.remove('active');
            document.getElementById('mobileRepel')?.classList.remove('active');
            document.getElementById('mobileVortex')?.classList.remove('active');
        }
    });
    
    // Mouse/touch
    canvas.addEventListener('mousemove', (e) => {
        config.players[0].x = e.clientX;
        config.players[0].y = e.clientY;
    });
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        config.players[0].x = touch.clientX;
        config.players[0].y = touch.clientY;
    }, { passive: false });

    // Botão de reinício
    document.getElementById('restart-btn').addEventListener('click', restartGame);

    // Fechar mapas
    document.getElementById('close-galaxy-map').addEventListener('click', () => {
        document.getElementById('galaxy-map').style.display = 'none';
    });

    document.getElementById('close-skill-tree').addEventListener('click', () => {
        document.getElementById('skill-tree').style.display = 'none';
    });

    // Modo História
    document.getElementById('next-dialog-btn').addEventListener('click', nextStoryDialog);

    // Skins Modal
    document.getElementById('close-skins').addEventListener('click', () => {
        document.getElementById('skins-modal').style.display = 'none';
    });
}

function setPlayerMode(mode) {
    config.players[0].mode = mode;
    showUnlockMessage(`Modo ${getModeName(mode)} ativado`);
}

function getModeName(mode) {
    const names = {
        attract: 'Atração',
        repel: 'Repulsão',
        vortex: 'Vórtice',
        normal: 'Normal'
    };
    return names[mode] || mode;
}

function highlightActiveMode() {
    document.querySelectorAll('[data-action="setMode"]').forEach(item => {
        if (item.getAttribute('data-mode') === config.players[0].mode) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function toggleCoopMode() {
    config.coopMode = !config.coopMode;
    config.players[1].active = config.coopMode;
    
    document.getElementById('coop-status').textContent = config.coopMode ? 'ON' : 'OFF';
    showUnlockMessage(`Modo Cooperativo ${config.coopMode ? 'ativado' : 'desativado'}`);
    
    // Posiciona o jogador 2 em uma posição inicial
    if (config.coopMode) {
        config.players[1].x = canvas.width * 0.3;
        config.players[1].y = canvas.height * 0.5;
    }
}

function toggleSound() {
    config.soundEnabled = !config.soundEnabled;
    document.getElementById('sound-status').textContent = config.soundEnabled ? 'ON' : 'OFF';
    
    // Atualiza todos os sons
    for (const sound of Object.values(config.soundEffects)) {
        sound.muted = !config.soundEnabled;
    }
    
    // Armazena preferência
    localStorage.setItem('soundEnabled', config.soundEnabled);
    
    showUnlockMessage(`Som ${config.soundEnabled ? 'ligado' : 'desligado'}`);
}

function playSound(soundName) {
    try {
        if (config.soundEnabled && config.soundEffects[soundName]) {
            config.soundEffects[soundName].currentTime = 0;
            config.soundEffects[soundName].play().catch(e => console.log("Erro ao tocar som:", e));
        }
    } catch (error) {
        console.error("Erro no sistema de som:", error);
    }
}

// 5. SISTEMA DE GALÁXIAS
function showGalaxyMap() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('galaxy-map').style.display = 'block';
    
    // Atualiza a lista de galáxias
    const galaxiesList = document.getElementById('galaxies-list');
    galaxiesList.innerHTML = '';
    
    for (const [key, galaxy] of Object.entries(config.galaxies.list)) {
        const galaxyEl = document.createElement('div');
        galaxyEl.className = `galaxy ${config.galaxies.unlocked.includes(key) ? 'unlocked' : 'locked'}`;
        galaxyEl.innerHTML = `
            <h3>${galaxy.name}</h3>
            <p>${galaxy.description}</p>
            ${!config.galaxies.unlocked.includes(key) ? 
              `<small>Requisito: ${galaxy.unlockCondition}</small>` : ''}
        `;
        
        if (config.galaxies.unlocked.includes(key)) {
            galaxyEl.addEventListener('click', () => {
                config.galaxies.current = key;
                document.body.style.background = galaxy.background;
                document.getElementById('galaxy-map').style.display = 'none';
                showUnlockMessage(`Galáxia ${galaxy.name} selecionada!`);
            });
        }
        
        galaxiesList.appendChild(galaxyEl);
    }
}

// 6. SISTEMA DE HABILIDADES
function showSkillTree() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('skill-tree').style.display = 'block';
    
    // Atualiza a lista de habilidades
    const skillsList = document.getElementById('skills-list');
    skillsList.innerHTML = '';
    
    for (const [key, skill] of Object.entries(config.skills.tree)) {
        const skillEl = document.createElement('div');
        skillEl.className = `skill ${skill.currentLevel > 0 ? 'unlocked' : 'locked'} 
                           ${skill.currentLevel >= skill.maxLevel ? 'maxed' : ''}`;
        
        skillEl.innerHTML = `
            <h3>${skill.name} (Nível ${skill.currentLevel}/${skill.maxLevel})</h3>
            <p>${skill.effect}</p>
            <div class="skill-cost">Custo: ${skill.cost} pontos</div>
            ${skill.requires ? `<div class="skill-requires">Requer: ${skill.requires.join(', ')}</div>` : ''}
            ${skill.currentLevel < skill.maxLevel && 
              config.skillPoints > 0 &&
              (!skill.requires || checkSkillRequirements(skill.requires)) ?
              '<button class="upgrade-btn" data-skill="'+key+'">Melhorar</button>' : ''}
        `;
        
        skillsList.appendChild(skillEl);
    }
    
    // Adiciona eventos aos botões de upgrade
    document.querySelectorAll('.upgrade-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const skillKey = this.getAttribute('data-skill');
            upgradeSkill(skillKey);
        });
    });
}

function checkSkillRequirements(requirements) {
    for (const req of requirements) {
        const [skillName, level] = req.split(':');
        if ((config.skills.tree[skillName]?.currentLevel || 0) < parseInt(level)) {
            return false;
        }
    }
    return true;
}

function upgradeSkill(skillKey) {
    const skill = config.skills.tree[skillKey];
    if (skill.currentLevel < skill.maxLevel && config.skillPoints >= skill.cost) {
        if (skill.requires && !checkSkillRequirements(skill.requires)) {
            showUnlockMessage("Requisitos não atendidos!");
            return;
        }
        
        skill.currentLevel++;
        config.skillPoints -= skill.cost;
        showUnlockMessage(`${skill.name} melhorado para nível ${skill.currentLevel}!`);
        
        // Aplica efeitos da habilidade
        applySkillEffects();
        
        // Atualiza a árvore de habilidades
        showSkillTree();
    }
}

function applySkillEffects() {
    const skills = config.skills.tree;
    const player = config.players[0];
    
    // Atração
    player.radius = 150 * (1 + (skills.attractRadius.currentLevel * 0.2));
    
    // Saúde
    player.maxHealth = 100 * (1 + (skills.healthBoost.currentLevel * 0.1));
    player.health = Math.min(player.health, player.maxHealth);
    updateHealthBar();
}

// 7. SISTEMA DE MISSÕES
function updateQuest(questId, amount = 1) {
    const quest = config.quests.active.find(q => q.id === questId);
    if (quest) {
        quest.current += amount;
        
        // Atualiza a UI imediatamente
        updateQuestUI();
        
        if (quest.current >= quest.target) {
            config.xp += quest.reward;
            config.quests.completed.push(quest.id);
            config.quests.active = config.quests.active.filter(q => q.id !== questId);
            showUnlockMessage(`Missão completa! +${quest.reward}XP`);
            
            // Verifica se subiu de nível com a recompensa
            checkLevelUp();
            
            // Adicionar nova missão se for a de absorver partículas
            if (quest.id === 'absorb100') {
                config.quests.active.push(
                    { id: 'absorb500', target: 500, current: config.particlesAbsorbed, reward: 250, title: "Absorver 500 partículas" }
                );
                updateQuestUI();
            }
            else if (quest.id === 'defeat20') {
                config.quests.active.push(
                    { id: 'defeat50', target: 50, current: config.enemiesDestroyed, reward: 300, title: "Derrotar 50 inimigos" }
                );
                updateQuestUI();
            }
        }
    }
}

function updateQuestUI() {
    const container = document.getElementById('quests-container');
    container.innerHTML = '';
    
    config.quests.active.forEach(quest => {
        const progress = Math.min(100, (quest.current / quest.target) * 100);
        const questEl = document.createElement('div');
        questEl.className = 'quest-item';
        questEl.innerHTML = `
            <div>${quest.title}</div>
            <div class="quest-progress">
                <div class="quest-progress-bar" style="width: ${progress}%"></div>
            </div>
            <small>${quest.current}/${quest.target} (${Math.round(progress)}%)</small>
        `;
        container.appendChild(questEl);
    });
}

// 8. SISTEMA DE GAME OVER
function showGameOver() {
    // Pausa o jogo
    config.gamePaused = true;
    
    // Toca som de game over
    playSound('gameOver');
    
    // Preenche estatísticas
    document.getElementById('go-level').textContent = config.level;
    document.getElementById('go-wave').textContent = config.wave.number;
    document.getElementById('go-particles').textContent = config.particlesAbsorbed;
    document.getElementById('go-enemies').textContent = config.enemiesDestroyed;
    
    // Cria estrelas de fundo
    createStars();
    
    // Mostra tela de game over
    document.getElementById('game-over-screen').style.display = 'flex';
}

function createStars() {
    const container = document.getElementById('game-over-stars');
    container.innerHTML = '';
    
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = `${Math.random() * 3 + 1}px`;
        star.style.height = star.style.width;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(star);
    }
}

function restartGame() {
    // Esconde tela de game over
    document.getElementById('game-over-screen').style.display = 'none';
    
    // Reseta o estado do jogo
    config.players[0].health = config.players[0].maxHealth;
    config.gamePaused = false;
    
    // Reinicia elementos do jogo
    particles = [];
    enemies = [];
    initParticles();
    config.wave.number = 1;
    config.wave.spawned = 0;
    config.wave.timer = 0;
    config.wave.enemiesToSpawn = 5;
    config.xp = 0;
    config.level = 1;
    config.particlesAbsorbed = 0;
    config.enemiesDestroyed = 0;
    config.skillPoints = 0;
    
    // Reseta habilidades
    for (const skill of Object.values(config.skills.tree)) {
        skill.currentLevel = 0;
    }
    
    // Atualiza UI
    updateHealthBar();
    updateXPBar();
    updateStatsPanel();
    updateQuestUI();
    
    // Reinicia missões
    config.quests.active = [
        { id: 'absorb100', target: 100, current: 0, reward: 50, title: "Absorver 100 partículas" },
        { id: 'defeat20', target: 20, current: 0, reward: 100, title: "Derrotar 20 inimigos" },
        { id: 'wave5', target: 5, current: 1, reward: 200, title: "Alcançar onda 5" }
    ];
    config.quests.completed = [];
    
    // Reinicia o loop se necessário
    if (!gameLoopRunning) {
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    }
}

function resetGame() {
    restartGame();
    document.getElementById('menu').style.display = 'none';
    showUnlockMessage("Jogo reiniciado!");
}

// 9. SISTEMA DE UI
function updateHealthBar() {
    const healthPercent = (config.players[0].health / config.players[0].maxHealth) * 100;
    const healthBar = document.getElementById('health-bar');
    
    healthBar.style.width = `${healthPercent}%`;
    healthBar.style.backgroundColor = 
        healthPercent > 60 ? '#00F5A0' : 
        healthPercent > 30 ? '#FFA500' : '#FF0000';
    
    // Efeito de piscar quando a vida está baixa
    if (healthPercent < 30) {
        healthBar.style.animation = 'pulse 1s infinite';
    } else {
        healthBar.style.animation = 'none';
    }
}

function checkLevelUp() {
    const xpNeeded = config.level * 100;
    if (config.xp >= xpNeeded) {
        config.level++;
        config.xp -= xpNeeded;
        config.skillPoints++;
        showUnlockMessage(`Nível ${config.level} alcançado! +1 Ponto de Habilidade`);
        
        // Toca som de level up
        playSound('levelUp');
        
        updateXPBar();
        updateStatsPanel();
        checkBigBangUnlock();
        checkSkinUnlocks();
        checkForBossDialog();
    }
}

function updateXPBar() {
    const xpNeeded = config.level * 100;
    const xpPercent = (config.xp / xpNeeded) * 100;
    document.getElementById('xp-bar').style.width = `${xpPercent}%`;
    document.getElementById('xp-text').textContent = 
        `${config.xp}/${xpNeeded} XP (Nível ${config.level})`;
}

function updateStatsPanel() {
    document.getElementById('stat-level').textContent = config.level;
    document.getElementById('stat-xp').textContent = `${config.xp}/${config.level * 100}`;
    document.getElementById('stat-particles').textContent = config.particlesAbsorbed;
    document.getElementById('stat-enemies').textContent = enemies.length;
    document.getElementById('stat-wave').textContent = config.wave.number;
}

function showUnlockMessage(message) {
    const el = document.createElement('div');
    el.className = 'unlock-message';
    el.textContent = message;
    document.body.appendChild(el);
    
    setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translate(-50%, -50%) scale(1)';
        
        setTimeout(() => {
            el.style.opacity = '0';
            el.style.transform = 'translate(-50%, -50%) scale(0.5)';
            
            setTimeout(() => {
                document.body.removeChild(el);
            }, 300);
        }, 2000);
    }, 10);
}

// 10. INICIALIZAÇÃO DO SISTEMA DE SOM
function initSoundSystem() {
    // Configuração inicial dos sons
    const soundPaths = {
        absorb: 'https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3',
        enemyDefeat: 'https://assets.mixkit.co/sfx/preview/mixkit-explosion-impact-1684.mp3',
        levelUp: 'https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3',
        bigBang: 'https://assets.mixkit.co/sfx/preview/mixkit-big-explosion-2814.mp3',
        gameOver: 'https://assets.mixkit.co/sfx/preview/mixkit-arcade-retro-game-over-213.mp3',
        respawn: 'https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3',
        bossRoar: 'https://assets.mixkit.co/sfx/preview/mixkit-monster-deep-rumble-395.mp3'
    };

    // Carrega os sons
    for (const [key, url] of Object.entries(soundPaths)) {
        config.soundEffects[key] = new Audio(url);
        config.soundEffects[key].volume = 0.5;
        config.soundEffects[key].muted = !config.soundEnabled;
        config.soundEffects[key].load(); // Pré-carrega o áudio
    }

    // Carrega preferência salva
    const savedSoundPref = localStorage.getItem('soundEnabled');
    if (savedSoundPref !== null) {
        config.soundEnabled = savedSoundPref === 'true';
    }
    document.getElementById('sound-status').textContent = config.soundEnabled ? 'ON' : 'OFF';
}

// 11. MODO HISTÓRIA (COM BOSS CÓSMICO)
function startStoryMode() {
    if (!config.story.enabled) return;
    
    config.gamePaused = true;
    document.getElementById('story-mode').style.display = 'flex';
    showStoryScene(0);
}

function showStoryScene(index) {
    if (index >= config.story.scenes.length) {
        endStoryMode();
        return;
    }
    
    config.story.currentScene = index;
    const scene = config.story.scenes[index];
    
    // Configura NPC (Boss ou Aliado)
    if (scene.effect === "terror") {
        document.getElementById('boss-npc').style.display = "block";
        document.getElementById('tentacles-container').style.display = "block";
        document.getElementById('story-npc').style.display = "none";
        document.getElementById('story-mode').classList.add("terror");
        document.querySelector('.story-dialog-box').classList.add("terror");
    } else {
        document.getElementById('boss-npc').style.display = "none";
        document.getElementById('tentacles-container').style.display = "none";
        document.getElementById('story-npc').style.display = "block";
        document.getElementById('story-mode').classList.remove("terror");
        document.querySelector('.story-dialog-box').classList.remove("terror");
    }
    
    // Tremor de tela para cenas intensas
    if (scene.shake) {
        document.getElementById('story-mode').classList.add("camera-shake");
        playSound("bossRoar");
    } else {
        document.getElementById('story-mode').classList.remove("camera-shake");
    }
    
    // Atualiza conteúdo
    document.getElementById('story-npc').textContent = scene.npc;
    document.getElementById('boss-npc').textContent = scene.npc;
    document.getElementById('story-dialog-text').textContent = scene.text;
    document.body.style.background = scene.background;
}

function nextStoryDialog() {
    showStoryScene(config.story.currentScene + 1);
}

function endStoryMode() {
    document.getElementById('story-mode').style.display = 'none';
    config.gamePaused = false;
    config.story.enabled = false;
    initParticles();
}

// 12. NPC FIXO
function showNPCDialog() {
    if (!config.npc.active || config.level >= 50) return;

    const npcDialog = document.getElementById("npc-dialog");
    const npcText = document.getElementById("npc-text");
    
    npcDialog.classList.add("show");

    // Diálogos baseados no progresso do jogador
    let dialog;
    
    if (config.level < 5) {
        // Diálogos para iniciantes
        dialog = [
            "Começando devagar, hein? Não se preocupe, todo mundo foi iniciante um dia...",
            "Essas partículas são só o básico, espere até ver o que vem depois!",
            "Dica: Partículas coloridas dão mais XP!"
        ][Math.floor(Math.random() * 3)];
    }
    else if (config.level < 15) {
        // Diálogos intermediários
        dialog = [
            "Começando a pegar o jeito, né? Mas não fique muito confiante...",
            "Já percebeu como os inimigos estão ficando mais espertos?",
            "O Big Bang está quase ao seu alcance... será que você está pronto?"
        ][Math.floor(Math.random() * 3)];
    }
    else if (config.level < 30) {
        // Diálogos avançados
        dialog = [
            "Você está indo bem... mas o verdadeiro desafio está por vir!",
            "Já notou como o universo muda conforme você avança?",
            "Nível 30 é onde a diversão realmente começa..."
        ][Math.floor(Math.random() * 3)];
    }
    else {
        // Diálogos para especialistas
        dialog = config.npc.dialogs[Math.floor(Math.random() * config.npc.dialogs.length)];
    }
    
    npcText.textContent = dialog;

    // Esconde o diálogo após 5 segundos
    setTimeout(() => {
        npcDialog.classList.remove("show");
    }, 5000);
}

function checkForBossDialog() {
    if (config.level === 50 && config.npc.active) {
        const npcText = document.getElementById("npc-text");
        const npcDialog = document.getElementById("npc-dialog");
        
        npcText.textContent = config.npc.bossDialog;
        npcDialog.classList.add("show");
        
        setTimeout(() => {
            npcDialog.classList.remove("show");
            config.npc.active = false; // NPC desaparece após o Boss
        }, 7000);
    }
}

// 13. SISTEMA DE SKINS
function showSkinsModal() {
    const modal = document.getElementById('skins-modal');
    const grid = document.getElementById('skins-grid');
    
    grid.innerHTML = '';
    
    config.skins.available.forEach(skin => {
        const skinCard = document.createElement('div');
        skinCard.className = `skin-card ${skin.type} ${skin.id === config.skins.current ? 'selected' : ''} ${skin.unlocked ? '' : 'locked'}`;
        skinCard.innerHTML = `
            <div class="skin-emoji">${skin.emoji}</div>
            <div class="skin-name">${skin.name}</div>
            <div class="skin-type">${skin.type.toUpperCase()}</div>
            ${!skin.unlocked ? `<div class="skin-requirement">${skin.unlockCondition}</div>` : ''}
        `;
        
        if (skin.unlocked) {
            skinCard.addEventListener('click', () => {
                selectSkin(skin.id);
            });
        }
        
        grid.appendChild(skinCard);
    });
    
    modal.style.display = 'flex';
}

function selectSkin(skinId) {
    const skin = config.skins.available.find(s => s.id === skinId);
    if (!skin || !skin.unlocked) return;
    
    config.skins.current = skinId;
    config.players[0].face = skin.emoji;
    
    // Atualiza UI
    document.querySelectorAll('.skin-card').forEach(card => {
        card.classList.remove('selected');
        if (card.querySelector('.skin-name').textContent === skin.name) {
            card.classList.add('selected');
        }
    });
    
    showUnlockMessage(`Skin "${skin.name}" selecionada!`);
}

function checkSkinUnlocks() {
    config.skins.available.forEach(skin => {
        if (skin.unlocked) return;
        
        let unlocked = false;
        
        if (skin.unlockCondition.includes('nível') && 
            config.level >= parseInt(skin.unlockCondition.match(/nível (\d+)/)[1])) {
            unlocked = true;
        }
        else if (skin.unlockCondition.includes('inimigos') && 
                 config.enemiesDestroyed >= parseInt(skin.unlockCondition.match(/Derrotar (\d+) inimigos/)[1])) {
            unlocked = true;
        }
        else if (skin.unlockCondition.includes('missões') && 
                 config.quests.active.length === 0) {
            unlocked = true;
        }
        
        if (unlocked && !skin.unlocked) {
            skin.unlocked = true;
            showUnlockMessage(`Skin desbloqueada: ${skin.name}!`);
        }
    });
}

// 14. RENDERIZAÇÃO
function render() {
    try {
        // Limpa o canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Aplica screen shake se necessário
        const shakeX = config.screenShakeIntensity > 0 ? 
            (Math.random() - 0.5) * config.screenShakeIntensity : 0;
        const shakeY = config.screenShakeIntensity > 0 ? 
            (Math.random() - 0.5) * config.screenShakeIntensity : 0;
        
        ctx.save();
        ctx.translate(shakeX, shakeY);
        
        // Reduz o screen shake gradualmente
        if (config.screenShakeIntensity > 0) {
            config.screenShakeIntensity -= 0.5;
        }
        
        // Desenha partículas
        particles.forEach(p => {
            // Trilha
            p.trail.forEach((trail, i) => {
                const alpha = i / p.trail.length;
                ctx.fillStyle = p.color.replace(')', `, ${alpha})`).replace('hsl', 'hsla');
                ctx.beginPath();
                ctx.arc(trail.x, trail.y, trail.size * alpha, 0, Math.PI * 2);
                ctx.fill();
            });
            
            // Partícula principal
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Desenha jogador 1
        const player = config.players[0];
        ctx.fillStyle = player.color;
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.font = `${player.faceSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(player.face, player.x, player.y);
        
        // Desenha jogador 2 se o modo coop estiver ativo
        if (config.coopMode && config.players[1].active) {
            const player2 = config.players[1];
            ctx.fillStyle = player2.color;
            ctx.beginPath();
            ctx.arc(player2.x, player2.y, player2.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.font = `${player2.faceSize}px Arial`;
            ctx.fillText(player2.face, player2.x, player2.y);
        }
        
        // Desenha inimigos
        enemies.forEach(enemy => {
            // Corpo do inimigo
            ctx.fillStyle = enemy.color;
            ctx.beginPath();
            ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Destaque para elites
            if (enemy.isElite) {
                ctx.strokeStyle = 'gold';
                ctx.lineWidth = 3;
                ctx.stroke();
                
                // Efeito de brilho
                ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
                ctx.beginPath();
                ctx.arc(enemy.x, enemy.y, enemy.size + 5, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Rosto do inimigo
            ctx.font = `${enemy.size * 0.8}px Arial`;
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(enemy.face, enemy.x, enemy.y);
        });
        
        ctx.restore();
    } catch (error) {
        console.error("Erro na renderização:", error);
    }
}

// 15. GAME LOOP (COM RESPAWN AUTOMÁTICO)
function gameLoop(timestamp) {
    try {
        // Calcula deltaTime
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        
        // Atualiza FPS counter
        frameCount++;
        if (timestamp - fpsLastChecked >= 1000) {
            fps = Math.round((frameCount * 1000) / (timestamp - fpsLastChecked));
            document.getElementById('fps-counter').textContent = `FPS: ${fps}`;
            fpsLastChecked = timestamp;
            frameCount = 0;
        }
        
        // Processa física em intervalos fixos
        const physicsSteps = Math.min(Math.floor(deltaTime / (1000/60)), 3);
        for (let i = 0; i < physicsSteps; i++) {
            updatePhysics(1000/60);
        }
        
        // Renderização
        render();
        
        gameLoopRunning = true;
        requestAnimationFrame(gameLoop);
    } catch (error) {
        console.error("Erro no game loop:", error);
        initGame();
    }
}

function updatePhysics(deltaTime) {
    if (config.gamePaused) return;
    
    // Verifica desbloqueio do Big Bang
    checkBigBangUnlock();
    
    // Atualiza cooldown
    if (config.bigBang.cooldown > 0) {
        config.bigBang.cooldown--;
        updateBigBangCooldownUI();
    }
    
    // Verifica respawn de partículas
    if (config.gameTime % config.particleRespawn.checkInterval === 0) {
        autoRespawnParticles();
    }
    config.gameTime++;
    
    // Atualiza partículas
    updateParticles(deltaTime);
    
    // Atualiza inimigos
    updateEnemies(deltaTime);
    
    // Atualiza sistema de ondas
    config.wave.update();
}

// 16. INICIALIZAÇÃO DO JOGO
function initGame() {
    try {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        config.players[0].x = canvas.width/2;
        config.players[0].y = canvas.height/2;
        
        initSoundSystem();
        setupControls();
        updateHealthBar();
        updateXPBar();
        updateStatsPanel();
        updateQuestUI();
        updateBigBangRequirement();
        
        // Atualiza missões com progresso atual
        updateQuest('absorb100', 0);
        updateQuest('defeat20', 0);
        updateQuest('wave5', 0);
        
        // Inicia diálogos do NPC
        setInterval(showNPCDialog, 5000 + Math.random() * 10000);
        
        // Inicia com o modo história se for a primeira vez
        const hasPlayedBefore = localStorage.getItem('hasPlayedBefore');
        if (!hasPlayedBefore) {
            startStoryMode();
            localStorage.setItem('hasPlayedBefore', 'true');
        } else {
            initParticles();
        }
        
        // Inicia o game loop
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    } catch (error) {
        console.error("Erro na inicialização:", error);
        setTimeout(initGame, 1000);
    }
}

// Inicia o jogo quando a página carrega
window.addEventListener('load', initGame);
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
