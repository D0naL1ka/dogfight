import { createLoop } from './loop.js';
import { createInput } from './input.js';
import { createShip, integrate } from './sim/ship.js';
import { wrap } from './sim/arena.js';
import { setupCanvas } from './render/canvas.js';
import { drawShip, drawStarfield, drawHud } from './render/draw.js';

const canvas = document.getElementById('game');
const { ctx } = setupCanvas(canvas);

const input = createInput(window);

const stars = Array.from({ length: 140 }, () => ({
  x: Math.random() * canvas.clientWidth,
  y: Math.random() * canvas.clientHeight,
  size: Math.random() * 1.5 + 0.5,
  brightness: Math.random() * 0.6 + 0.4,
}));

let current = createShip({ x: canvas.clientWidth / 2, y: canvas.clientHeight / 2 });
let previous = { ...current };

function simulate(step) {
  previous = { ...current };
  integrate(current, input, step);

  const beforeWrapX = current.x;
  const beforeWrapY = current.y;
  wrap(current, canvas.clientWidth, canvas.clientHeight);

  previous.x += current.x - beforeWrapX;
  previous.y += current.y - beforeWrapY;

  input.endFrame();
}

function render(alpha) {
  drawStarfield(ctx, canvas.clientWidth, canvas.clientHeight, stars);
  drawShip(ctx, previous, current, alpha);
  drawHud(ctx, loop.getStats());
}

const loop = createLoop({ step: 1 / 60, simulate, render });
loop.start();