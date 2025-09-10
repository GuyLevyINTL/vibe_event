# Break Breaker Game 🎮

A classic brick-breaking web game built with HTML5 Canvas, CSS3, and vanilla JavaScript.

## 🎯 Game Features

- **Classic Gameplay**: Break all the bricks to win!
- **Smooth Controls**: Use arrow keys or A/D to move the paddle
- **Physics Engine**: Realistic ball physics with angle-based bounces
- **Scoring System**: Different colored bricks give different points (10-60 points)
- **Lives System**: 3 lives to complete the challenge
- **Visual Effects**: Gradients, glow effects, and smooth animations
- **Responsive Design**: Works on different screen sizes

## 🕹️ How to Play

1. Open `index.html` in your web browser
2. Click "Start Game"
3. Use **Left/Right arrow keys** or **A/D keys** to move the paddle
4. Press **Spacebar** to launch the ball
5. Break all the bricks to win!
6. Don't let the ball fall below the paddle

## 🚀 Getting Started

### Method 1: Direct Browser Opening
Simply double-click `index.html` or right-click and select "Open with Browser".

### Method 2: Local Web Server
```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (if you have it installed)
npx http-server

# Using PHP (if you have it installed)
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 📁 Project Structure

```
vibe_event/
├── index.html      # Main game page
├── style.css       # Game styling and animations
├── script.js       # Game logic and physics
└── README.md       # This file
```

## 🎨 Game Mechanics

- **Paddle Movement**: Horizontal movement with boundary detection
- **Ball Physics**: Velocity-based movement with collision detection
- **Brick System**: 6 rows × 10 columns = 60 bricks to break
- **Collision Detection**: Precise collision detection for paddle, walls, and bricks
- **Scoring**: Higher rows give more points (10-60 points per brick)

## 🛠️ Technologies Used

- **HTML5 Canvas** for game rendering
- **CSS3** for styling and animations
- **Vanilla JavaScript** for game logic
- **RequestAnimationFrame** for smooth 60fps gameplay

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🎮 Controls

| Key | Action |
|-----|--------|
| ← → Arrow Keys | Move paddle left/right |
| A / D | Alternative paddle movement |
| Spacebar | Launch ball |
| Start Game Button | Begin new game |
| Reset Game Button | Reset to initial state |

---

**Enjoy breaking those bricks!** 🧱💥
