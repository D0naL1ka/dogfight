import { createLoop } from './loop.js';
import { createInput } from './input.js';
import { createShip, integrate } from './sim/ship.js';
import { wrap } from './sim/arena.js'

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const input = createInput(window);
const ship = createShip({ x: 400, y: 300 });

function simulate(step) {
integrate(ship, input, step);
  wrap(ship, canvas.width, canvas.height);
  input.endFrame();
}

function render(alpha) {
  ctx.fillStyle = '#0a0e1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(ship.x, ship.y);
  ctx.rotate(ship.angle);
  ctx.fillStyle = '#e8eef7';
  ctx.beginPath();
  ctx.moveTo(16, 0);
  ctx.lineTo(-12, 10);
  ctx.lineTo(-6, 0);
  ctx.lineTo(-12, -10);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  const stats = loop.getStats();

  ctx.fillStyle = '#8fd3ff';
  ctx.font = '16px monospace';
  ctx.fillText(`steps/s: ${stats.stepsPerSecond}`, 16, 30);
  ctx.fillText(`frames/s: ${stats.framesPerSecond}`, 16, 54);
  ctx.fillText(`frame time: ${stats.lastFrameDuration.toFixed(2)} ms`, 16, 78);
  ctx.fillText(`alpha: ${alpha.toFixed(3)}`, 16, 102);
}

const loop = createLoop({ step: 1 / 60, simulate, render });
loop.start();