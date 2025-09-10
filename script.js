class BreakBreakerGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        this.gameMessageElement = document.getElementById('gameMessage');
        
        // Game state
        this.gameRunning = false;
        this.gameWon = false;
        this.gameLost = false;
        this.ballLaunched = false;
        
        // Game objects
        this.paddle = {
            x: this.canvas.width / 2 - 60,
            y: this.canvas.height - 30,
            width: 120,
            height: 15,
            speed: 8,
            color: '#4ecdc4'
        };
        
        this.ball = {
            x: this.canvas.width / 2,
            y: this.canvas.height - 50,
            radius: 8,
            dx: 0,
            dy: 0,
            speed: 6,
            color: '#ff6b6b'
        };
        
        this.score = 0;
        this.lives = 3;
        this.bricks = [];
        
        // Input handling
        this.keys = {};
        
        this.init();
    }
    
    init() {
        this.createBricks();
        this.bindEvents();
        this.resetGame();
        this.gameLoop();
    }
    
    createBricks() {
        const rows = 6;
        const cols = 10;
        const brickWidth = 75;
        const brickHeight = 20;
        const padding = 5;
        const offsetTop = 60;
        const offsetLeft = (this.canvas.width - (cols * (brickWidth + padding) - padding)) / 2;
        
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                this.bricks.push({
                    x: offsetLeft + col * (brickWidth + padding),
                    y: offsetTop + row * (brickHeight + padding),
                    width: brickWidth,
                    height: brickHeight,
                    color: colors[row],
                    visible: true,
                    points: (rows - row) * 10 // Higher rows give more points
                });
            }
        }
    }
    
    bindEvents() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            // Launch ball with spacebar
            if (e.key === ' ' && this.gameRunning && !this.ballLaunched) {
                this.launchBall();
                e.preventDefault();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // Button events
        this.startBtn.addEventListener('click', () => {
            this.startGame();
        });
        
        this.resetBtn.addEventListener('click', () => {
            this.resetGame();
        });
        
        // Prevent context menu on canvas
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    startGame() {
        this.gameRunning = true;
        this.gameWon = false;
        this.gameLost = false;
        this.startBtn.disabled = true;
        this.gameMessageElement.textContent = 'Press SPACE to launch the ball!';
        this.gameMessageElement.className = 'game-message';
    }
    
    resetGame() {
        this.gameRunning = false;
        this.gameWon = false;
        this.gameLost = false;
        this.ballLaunched = false;
        this.score = 0;
        this.lives = 3;
        
        // Reset paddle
        this.paddle.x = this.canvas.width / 2 - this.paddle.width / 2;
        
        // Reset ball
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height - 50;
        this.ball.dx = 0;
        this.ball.dy = 0;
        
        // Reset bricks
        this.bricks.forEach(brick => brick.visible = true);
        
        // Reset UI
        this.updateScore();
        this.updateLives();
        this.startBtn.disabled = false;
        this.gameMessageElement.textContent = '';
        this.gameMessageElement.className = 'game-message';
    }
    
    launchBall() {
        this.ballLaunched = true;
        const angle = (Math.random() - 0.5) * 0.5; // Random angle between -0.25 and 0.25 radians
        this.ball.dx = Math.sin(angle) * this.ball.speed;
        this.ball.dy = -Math.cos(angle) * this.ball.speed;
        this.gameMessageElement.textContent = '';
    }
    
    update() {
        if (!this.gameRunning || this.gameWon || this.gameLost) return;
        
        this.updatePaddle();
        
        if (this.ballLaunched) {
            this.updateBall();
            this.checkCollisions();
            this.checkWinCondition();
        } else {
            // Ball follows paddle when not launched
            this.ball.x = this.paddle.x + this.paddle.width / 2;
        }
    }
    
    updatePaddle() {
        // Move paddle with arrow keys or A/D keys
        if ((this.keys['arrowleft'] || this.keys['a']) && this.paddle.x > 0) {
            this.paddle.x -= this.paddle.speed;
        }
        if ((this.keys['arrowright'] || this.keys['d']) && this.paddle.x < this.canvas.width - this.paddle.width) {
            this.paddle.x += this.paddle.speed;
        }
    }
    
    updateBall() {
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
        
        // Wall collisions
        if (this.ball.x <= this.ball.radius || this.ball.x >= this.canvas.width - this.ball.radius) {
            this.ball.dx = -this.ball.dx;
            this.ball.x = Math.max(this.ball.radius, Math.min(this.canvas.width - this.ball.radius, this.ball.x));
        }
        
        if (this.ball.y <= this.ball.radius) {
            this.ball.dy = -this.ball.dy;
            this.ball.y = this.ball.radius;
        }
        
        // Check if ball fell below paddle
        if (this.ball.y > this.canvas.height) {
            this.lives--;
            this.updateLives();
            
            if (this.lives <= 0) {
                this.endGame(false);
            } else {
                this.resetBall();
            }
        }
    }
    
    resetBall() {
        this.ballLaunched = false;
        this.ball.x = this.paddle.x + this.paddle.width / 2;
        this.ball.y = this.canvas.height - 50;
        this.ball.dx = 0;
        this.ball.dy = 0;
        this.gameMessageElement.textContent = 'Press SPACE to launch the ball!';
    }
    
    checkCollisions() {
        // Paddle collision
        if (this.ball.y + this.ball.radius >= this.paddle.y &&
            this.ball.y - this.ball.radius <= this.paddle.y + this.paddle.height &&
            this.ball.x >= this.paddle.x &&
            this.ball.x <= this.paddle.x + this.paddle.width) {
            
            // Calculate hit position relative to paddle center
            const hitPos = (this.ball.x - (this.paddle.x + this.paddle.width / 2)) / (this.paddle.width / 2);
            const angle = hitPos * Math.PI / 3; // Max angle of 60 degrees
            
            this.ball.dx = Math.sin(angle) * this.ball.speed;
            this.ball.dy = -Math.abs(Math.cos(angle) * this.ball.speed);
            this.ball.y = this.paddle.y - this.ball.radius;
        }
        
        // Brick collisions
        for (let brick of this.bricks) {
            if (!brick.visible) continue;
            
            if (this.ball.x + this.ball.radius >= brick.x &&
                this.ball.x - this.ball.radius <= brick.x + brick.width &&
                this.ball.y + this.ball.radius >= brick.y &&
                this.ball.y - this.ball.radius <= brick.y + brick.height) {
                
                brick.visible = false;
                this.score += brick.points;
                this.updateScore();
                
                // Determine collision side
                const ballCenterX = this.ball.x;
                const ballCenterY = this.ball.y;
                const brickCenterX = brick.x + brick.width / 2;
                const brickCenterY = brick.y + brick.height / 2;
                
                const dx = ballCenterX - brickCenterX;
                const dy = ballCenterY - brickCenterY;
                
                // Calculate which side was hit
                const crossWidth = brick.width * dy;
                const crossHeight = brick.height * dx;
                
                if (Math.abs(crossWidth) > Math.abs(crossHeight)) {
                    // Hit top or bottom
                    this.ball.dy = -this.ball.dy;
                } else {
                    // Hit left or right
                    this.ball.dx = -this.ball.dx;
                }
                
                break; // Only hit one brick per frame
            }
        }
    }
    
    checkWinCondition() {
        const remainingBricks = this.bricks.filter(brick => brick.visible).length;
        if (remainingBricks === 0) {
            this.endGame(true);
        }
    }
    
    endGame(won) {
        this.gameRunning = false;
        this.gameWon = won;
        this.gameLost = !won;
        this.startBtn.disabled = false;
        
        if (won) {
            this.gameMessageElement.textContent = `🎉 You Win! Final Score: ${this.score}`;
            this.gameMessageElement.className = 'game-message win';
        } else {
            this.gameMessageElement.textContent = `💥 Game Over! Final Score: ${this.score}`;
            this.gameMessageElement.className = 'game-message lose';
        }
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
    }
    
    updateLives() {
        this.livesElement.textContent = this.lives;
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background pattern
        this.drawBackground();
        
        // Draw paddle
        this.drawPaddle();
        
        // Draw ball
        this.drawBall();
        
        // Draw bricks
        this.drawBricks();
        
        // Draw trail effect for ball when moving
        if (this.ballLaunched) {
            this.drawBallTrail();
        }
    }
    
    drawBackground() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;
        
        // Draw grid pattern
        for (let x = 0; x < this.canvas.width; x += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y < this.canvas.height; y += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    drawPaddle() {
        // Paddle gradient
        const gradient = this.ctx.createLinearGradient(this.paddle.x, this.paddle.y, this.paddle.x, this.paddle.y + this.paddle.height);
        gradient.addColorStop(0, this.paddle.color);
        gradient.addColorStop(1, '#369a8b');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
        
        // Paddle border
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
    }
    
    drawBall() {
        // Ball glow effect
        const gradient = this.ctx.createRadialGradient(this.ball.x, this.ball.y, 0, this.ball.x, this.ball.y, this.ball.radius * 2);
        gradient.addColorStop(0, this.ball.color);
        gradient.addColorStop(0.7, this.ball.color);
        gradient.addColorStop(1, 'transparent');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius * 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Ball core
        this.ctx.fillStyle = this.ball.color;
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Ball highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x - 2, this.ball.y - 2, this.ball.radius / 2, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawBallTrail() {
        if (!this.ballLaunched) return;
        
        // Simple trail effect
        this.ctx.fillStyle = 'rgba(255, 107, 107, 0.1)';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x - this.ball.dx, this.ball.y - this.ball.dy, this.ball.radius * 0.8, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawBricks() {
        for (let brick of this.bricks) {
            if (!brick.visible) continue;
            
            // Brick gradient
            const gradient = this.ctx.createLinearGradient(brick.x, brick.y, brick.x, brick.y + brick.height);
            gradient.addColorStop(0, brick.color);
            gradient.addColorStop(1, this.darkenColor(brick.color, 20));
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
            
            // Brick border
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
            
            // Brick highlight
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            this.ctx.fillRect(brick.x + 2, brick.y + 2, brick.width - 4, 3);
        }
    }
    
    darkenColor(color, amount) {
        const hex = color.replace('#', '');
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - amount);
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - amount);
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - amount);
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new BreakBreakerGame();
});
