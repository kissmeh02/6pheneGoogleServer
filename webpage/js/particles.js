// Configuration
const hexRadius = 40; 
const mouseRadius = 250; 

let hexagons = [];
let mouse = { x: undefined, y: undefined };

// Create Canvas
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Canvas Setup
const container = document.getElementById('canvas-container') || document.body;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
container.appendChild(canvas);

// Nebula Properties
let nebulaTime = 0;

// Hexagon Math
const a = 2 * Math.PI / 6;
const r = hexRadius;

class Hexagon {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.scale = 1;
        this.baseOpacity = 0;
        this.opacity = 0;
        this.starPhase = Math.random() * Math.PI * 2;
        this.starSpeed = Math.random() * 0.03 + 0.01;
        this.starBrightness = 0;
        this.targetOpacity = 0;
    }

    update() {
        // Star Twinkle
        this.starPhase += this.starSpeed;
        this.starBrightness = 0.1 + (Math.sin(this.starPhase) + 1) * 0.2;

        // Mouse Interaction
        if (mouse.x !== undefined) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouseRadius) {
                const intensity = 1 - (dist / mouseRadius);
                this.targetOpacity = 0.02 + (0.3 * intensity); 
                this.starBrightness += intensity * 0.5;
                this.scale = 1 + (0.05 * intensity); 
            } else {
                this.targetOpacity = 0.02; 
                this.scale = 1;
            }
        } else {
            this.targetOpacity = 0.02;
            this.scale = 1;
        }

        this.opacity += (this.targetOpacity - this.opacity) * 0.1;
        if (this.starBrightness > 1) this.starBrightness = 1;
    }

    draw() {
        // Draw Stars
        for (let i = 0; i < 6; i++) {
            const angle = a * i - Math.PI / 6; 
            const px = this.x + this.scale * r * Math.cos(angle);
            const py = this.y + this.scale * r * Math.sin(angle);
            
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, ${this.starBrightness * 0.8})`;
            ctx.arc(px, py, 1.2, 0, Math.PI * 2);
            ctx.fill();
            
            if (this.starBrightness > 0.6) {
                ctx.beginPath();
                ctx.fillStyle = `rgba(56, 189, 248, ${this.starBrightness * 0.3})`;
                ctx.arc(px, py, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Draw Lines
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = a * i - Math.PI / 6; 
            const px = this.x + this.scale * r * Math.cos(angle);
            const py = this.y + this.scale * r * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        
        ctx.strokeStyle = `rgba(56, 189, 248, ${this.opacity})`;
        ctx.lineWidth = 1; 
        ctx.stroke();
    }
}

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    hexagons = [];
    
    const stepX = r * Math.sqrt(3);
    const stepY = r * 1.5;
    const cols = Math.ceil(canvas.width / stepX) + 2;
    const rows = Math.ceil(canvas.height / stepY) + 2;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let x = col * stepX;
            let y = row * stepY;
            if (row % 2 === 1) x += stepX / 2;
            hexagons.push(new Hexagon(x, y));
        }
    }
}

function animate() {
    // Clear with transparent black to allow layering if needed, 
    // but here we clear completely to draw the gradient fresh
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Nebula Gradient
    nebulaTime += 0.002;
    const cx = canvas.width * 0.5 + Math.sin(nebulaTime) * 200;
    const cy = canvas.height * 0.5 + Math.cos(nebulaTime * 0.7) * 100;
    
    // Deep Space Gradient
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, canvas.width * 0.8);
    // Inner: Deep Indigo/Purple (very faint)
    gradient.addColorStop(0, 'rgba(30, 27, 75, 0.2)'); 
    // Middle: Deep Cyan (faint)
    gradient.addColorStop(0.4, 'rgba(15, 23, 42, 0.1)');
    // Outer: Transparent (fades to HTML background)
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    hexagons.forEach(hex => {
        hex.update();
        hex.draw();
    });
    requestAnimationFrame(animate);
}

window.addEventListener('resize', init);
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

init();
animate();
console.log('Nebula Constellation Initialized');
