import { createLoop } from './loop.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let totalSteps = 0;

function simulate(step) {
  totalSteps++;
}

function render(alpha) {
  ctx.fillStyle = '#0a0e1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const stats = loop.getStats();

  ctx.fillStyle = '#8fd3ff';
  ctx.font = '16px monospace';
  ctx.fillText(`steps/s: ${stats.stepsPerSecond}`, 16, 30);
  ctx.fillText(`frames/s: ${stats.framesPerSecond}`, 16, 54);
  ctx.fillText(`frame time: ${stats.lastFrameDuration.toFixed(2)} ms`, 16, 78);
  ctx.fillText(`alpha: ${alpha.toFixed(3)}`, 16, 102);
  ctx.fillText(`total steps: ${totalSteps}`, 16, 126);
}

const loop = createLoop({ step: 1 / 60, simulate, render });
loop.start();