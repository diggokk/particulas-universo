// ===== LOOP PRINCIPAL ATUALIZADO =====
function animate(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    // Fundo com fade para efeito de trail
    ctx.fillStyle = 'rgba(0, 0, 10, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawStars();
    drawConnections();
    // drawMouseDisk(); // REMOVIDO DEFINITIVAMENTE
    
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