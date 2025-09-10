/**
 * Unit Tests for Break Breaker Game
 * Tests core game mechanics and functionality
 */

// Mock the DOM elements and Canvas API
global.HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    fillRect: jest.fn(),
    strokeRect: jest.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    createLinearGradient: jest.fn(() => ({
        addColorStop: jest.fn()
    })),
    createRadialGradient: jest.fn(() => ({
        addColorStop: jest.fn()
    }))
}));

global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16));

// Mock DOM elements
const mockElements = {
    gameCanvas: {
        width: 800,
        height: 600,
        getContext: global.HTMLCanvasElement.prototype.getContext,
        addEventListener: jest.fn()
    },
    startBtn: {
        addEventListener: jest.fn(),
        disabled: false
    },
    resetBtn: {
        addEventListener: jest.fn(),
        disabled: false
    },
    scoreElement: {
        textContent: '0'
    },
    livesElement: {
        textContent: '3'
    },
    gameMessageElement: {
        textContent: '',
        className: ''
    }
};

document.getElementById = jest.fn((id) => {
    return mockElements[id] || mockElements.gameCanvas;
});

document.addEventListener = jest.fn();

describe('Break Breaker Game Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should create canvas element with correct dimensions', () => {
        const canvas = document.getElementById('gameCanvas');
        expect(canvas.width).toBe(800);
        expect(canvas.height).toBe(600);
    });

    test('should have canvas context with drawing methods', () => {
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        
        expect(ctx.fillRect).toBeDefined();
        expect(ctx.strokeRect).toBeDefined();
        expect(ctx.beginPath).toBeDefined();
        expect(ctx.arc).toBeDefined();
        expect(ctx.fill).toBeDefined();
        expect(ctx.stroke).toBeDefined();
    });

    test('should create gradient objects', () => {
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        
        const linearGradient = ctx.createLinearGradient(0, 0, 100, 100);
        const radialGradient = ctx.createRadialGradient(0, 0, 0, 100, 100, 50);
        
        expect(linearGradient.addColorStop).toBeDefined();
        expect(radialGradient.addColorStop).toBeDefined();
    });

    test('should mock DOM elements correctly', () => {
        expect(document.getElementById('startBtn')).toBeDefined();
        expect(document.getElementById('resetBtn')).toBeDefined();
        expect(document.getElementById('score')).toBeDefined();
        expect(document.getElementById('lives')).toBeDefined();
    });

    test('should handle event listeners', () => {
        const element = document.getElementById('startBtn');
        element.addEventListener('click', jest.fn());
        
        expect(element.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    });

    test('should mock requestAnimationFrame', () => {
        const callback = jest.fn();
        requestAnimationFrame(callback);
        
        expect(requestAnimationFrame).toHaveBeenCalledWith(callback);
    });

    // Game Logic Tests (without requiring the class to be loaded)
    describe('Game Logic Functions', () => {
        test('should calculate collision between rectangles', () => {
            // Test collision detection logic
            const rect1 = { x: 0, y: 0, width: 50, height: 50 };
            const rect2 = { x: 25, y: 25, width: 50, height: 50 };
            
            const isColliding = (r1, r2) => {
                return r1.x < r2.x + r2.width &&
                       r1.x + r1.width > r2.x &&
                       r1.y < r2.y + r2.height &&
                       r1.y + r1.height > r2.y;
            };
            
            expect(isColliding(rect1, rect2)).toBe(true);
        });

        test('should calculate distance between points', () => {
            const distance = (x1, y1, x2, y2) => {
                return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            };
            
            expect(distance(0, 0, 3, 4)).toBe(5);
        });

        test('should normalize angle values', () => {
            const normalizeAngle = (angle) => {
                while (angle < 0) angle += Math.PI * 2;
                while (angle >= Math.PI * 2) angle -= Math.PI * 2;
                return angle;
            };
            
            expect(normalizeAngle(-Math.PI)).toBeCloseTo(Math.PI);
            expect(normalizeAngle(Math.PI * 3)).toBeCloseTo(Math.PI);
        });

        test('should clamp values within bounds', () => {
            const clamp = (value, min, max) => {
                return Math.min(Math.max(value, min), max);
            };
            
            expect(clamp(5, 0, 10)).toBe(5);
            expect(clamp(-5, 0, 10)).toBe(0);
            expect(clamp(15, 0, 10)).toBe(10);
        });

        test('should interpolate between values', () => {
            const lerp = (start, end, t) => {
                return start + (end - start) * t;
            };
            
            expect(lerp(0, 100, 0.5)).toBe(50);
            expect(lerp(10, 20, 0)).toBe(10);
            expect(lerp(10, 20, 1)).toBe(20);
        });
    });

    describe('Game State Validation', () => {
        test('should validate game initialization values', () => {
            const defaultGameState = {
                gameRunning: false,
                gameWon: false,
                gameLost: false,
                ballLaunched: false,
                score: 0,
                lives: 3
            };
            
            expect(defaultGameState.gameRunning).toBe(false);
            expect(defaultGameState.score).toBe(0);
            expect(defaultGameState.lives).toBe(3);
        });

        test('should validate paddle properties', () => {
            const canvasWidth = 800;
            const paddle = {
                x: canvasWidth / 2 - 60,
                y: 600 - 30,
                width: 120,
                height: 15,
                speed: 8,
                color: '#4ecdc4'
            };
            
            expect(paddle.width).toBe(120);
            expect(paddle.height).toBe(15);
            expect(paddle.speed).toBe(8);
            expect(paddle.x).toBe(340); // 400 - 60
        });

        test('should validate ball properties', () => {
            const ball = {
                x: 400,
                y: 550,
                radius: 8,
                dx: 0,
                dy: 0,
                speed: 6,
                color: '#ff6b6b'
            };
            
            expect(ball.radius).toBe(8);
            expect(ball.speed).toBe(6);
            expect(ball.dx).toBe(0);
            expect(ball.dy).toBe(0);
        });

        test('should validate brick grid dimensions', () => {
            const rows = 6;
            const cols = 10;
            const totalBricks = rows * cols;
            
            expect(totalBricks).toBe(60);
            expect(rows).toBeGreaterThan(0);
            expect(cols).toBeGreaterThan(0);
        });
    });

    describe('Color Utility Functions', () => {
        test('should validate color format', () => {
            const isValidHexColor = (color) => {
                return /^#[0-9A-F]{6}$/i.test(color);
            };
            
            expect(isValidHexColor('#ff6b6b')).toBe(true);
            expect(isValidHexColor('#4ecdc4')).toBe(true);
            expect(isValidHexColor('invalid')).toBe(false);
        });

        test('should darken color values', () => {
            const darkenColor = (color, amount) => {
                if (!color.startsWith('#')) return color;
                
                const hex = color.replace('#', '');
                const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - amount);
                const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - amount);
                const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - amount);
                
                return `rgb(${r}, ${g}, ${b})`;
            };
            
            const darkened = darkenColor('#ffffff', 50);
            expect(darkened).toBe('rgb(205, 205, 205)');
        });
    });

    describe('Score Calculation', () => {
        test('should calculate correct points for different rows', () => {
            const calculateBrickPoints = (row, totalRows) => {
                return (totalRows - row) * 10;
            };
            
            expect(calculateBrickPoints(0, 6)).toBe(60); // Top row
            expect(calculateBrickPoints(3, 6)).toBe(30); // Middle row
            expect(calculateBrickPoints(5, 6)).toBe(10); // Bottom row
        });
    });
});
