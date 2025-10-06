// Elementos do DOM
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const winnerText = document.getElementById('winner-text');
const player1HealthBar = document.getElementById('player1-health');
const player2HealthBar = document.getElementById('player2-health');

// Estado do jogo
let gameRunning = false;
let gameOver = false;

// Carregar imagens dos personagens
const luffyImg = new Image();
luffyImg.src = "accent/Luffy1.png"; // arquivo do Luffy na mesma pasta do HTML

const gokuImg = new Image();
gokuImg.src = "accent/goku.png"; // arquivo do Goku na mesma pasta do HTML

// Personagens
const player1 = {
    x: 150,
    y: 300,
    width: 40,
    height: 60,
    speed: 5,
    jumpForce: 12,
    velocityY: 0,
    isJumping: false,
    health: 100,
    facingRight: true,
    attacking: false,
    attackCooldown: 0
};

const player2 = {
    x: 650,
    y: 300,
    width: 40,
    height: 60,
    speed: 5,
    jumpForce: 12,
    velocityY: 0,
    isJumping: false,
    health: 100,
    facingRight: false,
    attacking: false,
    attackCooldown: 0
};

// Chaves pressionadas
const keys = {
    a: false,
    d: false,
    w: false,
    space: false,
    arrowLeft: false,
    arrowRight: false,
    arrowUp: false,
    enter: false
};

// Inicialização
function init() {
    // Event listeners para teclado
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'a': keys.a = true; break;
            case 'd': keys.d = true; break;
            case 'w': keys.w = true; break;
            case ' ': keys.space = true; break;
            case 'ArrowLeft': keys.arrowLeft = true; break;
            case 'ArrowRight': keys.arrowRight = true; break;
            case 'ArrowUp': keys.arrowUp = true; break;
            case 'Enter': keys.enter = true; break;
        }
    });

    document.addEventListener('keyup', (e) => {
        switch(e.key) {
            case 'a': keys.a = false; break;
            case 'd': keys.d = false; break;
            case 'w': keys.w = false; break;
            case ' ': keys.space = false; break;
            case 'ArrowLeft': keys.arrowLeft = false; break;
            case 'ArrowRight': keys.arrowRight = false; break;
            case 'ArrowUp': keys.arrowUp = false; break;
            case 'Enter': keys.enter = false; break;
        }
    });

    // Botões
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', restartGame);
}

// Iniciar jogo
function startGame() {
    startScreen.style.display = 'none';
    gameRunning = true;
    gameOver = false;
    gameLoop();
}

// Reiniciar jogo
function restartGame() {
    gameOverScreen.style.display = 'none';
    
    // Resetar personagens
    player1.x = 150;
    player1.y = 300;
    player1.health = 100;
    player1.velocityY = 0;
    player1.isJumping = false;
    player1.attacking = false;
    
    player2.x = 650;
    player2.y = 300;
    player2.health = 100;
    player2.velocityY = 0;
    player2.isJumping = false;
    player2.attacking = false;
    
    // Atualizar barras de vida
    player1HealthBar.style.width = '100%';
    player2HealthBar.style.width = '100%';
    
    gameRunning = true;
    gameOver = false;
    gameLoop();
}

// Loop principal do jogo
function gameLoop() {
    if (!gameRunning) return;
    
    update();
    render();
    
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

// Atualizar estado do jogo
function update() {
    // Movimento do jogador 1
    if (keys.a && player1.x > 0) {
        player1.x -= player1.speed;
        player1.facingRight = false;
    }
    if (keys.d && player1.x < canvas.width - player1.width) {
        player1.x += player1.speed;
        player1.facingRight = true;
    }
    if (keys.w && !player1.isJumping) {
        player1.velocityY = -player1.jumpForce;
        player1.isJumping = true;
    }
    if (keys.space && player1.attackCooldown <= 0) {
        player1.attacking = true;
        player1.attackCooldown = 20;
        
        // Verificar se o ataque acertou
        if (isAttacking(player1, player2)) {
            player2.health -= 10;
            player2HealthBar.style.width = player2.health + '%';
            
            if (player2.health <= 0) {
                endGame("JOGADOR 1 VENCEU!");
            }
        }
    }
    
    // Movimento do jogador 2
    if (keys.arrowLeft && player2.x > 0) {
        player2.x -= player2.speed;
        player2.facingRight = false;
    }
    if (keys.arrowRight && player2.x < canvas.width - player2.width) {
        player2.x += player2.speed;
        player2.facingRight = true;
    }
    if (keys.arrowUp && !player2.isJumping) {
        player2.velocityY = -player2.jumpForce;
        player2.isJumping = true;
    }
    if (keys.enter && player2.attackCooldown <= 0) {
        player2.attacking = true;
        player2.attackCooldown = 20;
        
        // Verificar se o ataque acertou
        if (isAttacking(player2, player1)) {
            player1.health -= 10;
            player1HealthBar.style.width = player1.health + '%';
            
            if (player1.health <= 0) {
                endGame("JOGADOR 2 VENCEU!");
            }
        }
    }
    
    // Aplicar gravidade
    player1.velocityY += 0.5;
    player2.velocityY += 0.5;
    
    // Atualizar posição Y
    player1.y += player1.velocityY;
    player2.y += player2.velocityY;
    
    // Verificar colisão com o chão
    if (player1.y > 300) {
        player1.y = 300;
        player1.velocityY = 0;
        player1.isJumping = false;
    }
    
    if (player2.y > 300) {
        player2.y = 300;
        player2.velocityY = 0;
        player2.isJumping = false;
    }
    
    // Reduzir cooldown de ataque
    if (player1.attackCooldown > 0) {
        player1.attackCooldown--;
        if (player1.attackCooldown === 0) {
            player1.attacking = false;
        }
    }
    
    if (player2.attackCooldown > 0) {
        player2.attackCooldown--;
        if (player2.attackCooldown === 0) {
            player2.attacking = false;
        }
    }
}

// Verificar se um ataque acertou
function isAttacking(attacker, defender) {
    const attackRange = 50;
    const horizontalDistance = Math.abs(attacker.x - defender.x);
    const verticalDistance = Math.abs(attacker.y - defender.y);
    
    return horizontalDistance < attackRange && 
           verticalDistance < attacker.height && 
           ((attacker.facingRight && attacker.x < defender.x) || 
            (!attacker.facingRight && attacker.x > defender.x));
}

// Finalizar jogo
function endGame(winner) {
    gameRunning = false;
    gameOver = true;
    winnerText.textContent = winner;
    gameOverScreen.style.display = 'flex';
}

// Renderizar o jogo
// Renderizar o jogo
function render() {
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar chão
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 360, canvas.width, 40);

    // Jogador 1 (Luffy)
    if (player1.facingRight) {
        ctx.drawImage(luffyImg, player1.x - 20, player1.y - 40, 80, 80);
    } else {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(luffyImg, -player1.x - 60, player1.y - 40, 80, 80);
        ctx.restore();
    }

    // Jogador 2 (Goku)
    if (player2.facingRight) {
        ctx.drawImage(gokuImg, player2.x - 20, player2.y - 40, 80, 80);
    } else {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(gokuImg, -player2.x - 60, player2.y - 40, 80, 80);
        ctx.restore();
    }

    // Desenhar ataques
    if (player1.attacking) {
        ctx.fillStyle = '#FF9900';
        const attackX = player1.facingRight ? player1.x + player1.width : player1.x - 20;
        ctx.fillRect(attackX, player1.y + 10, 20, 20);
    }

    if (player2.attacking) {
        ctx.fillStyle = '#00FFFF';
        const attackX = player2.facingRight ? player2.x + player2.width : player2.x - 20;
        ctx.fillRect(attackX, player2.y + 10, 20, 20);
    }
}

// Inicializar o jogo quando a página carregar
window.addEventListener('load', init);