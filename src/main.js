import { createLoop } from './loop.js';
import { createInput } from './input.js';
import { createShip, integrate } from './sim/ship.js';
import { wrap } from './sim/arena.js';
import { setupCanvas } from './render/canvas.js';
import { drawShip, drawStarfield, drawHud } from './render/draw.js';

const experiment = new URLSearchParams(location.search).get('exp');
let frameCount = 0;

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

let thrustHeldSeconds = 0;
let thrustLogDone = false;

function simulate(step) {
  previous = { ...current };
  integrate(current, input, step);

  const beforeWrapX = current.x;
  const beforeWrapY = current.y;
  wrap(current, canvas.clientWidth, canvas.clientHeight);

  previous.x += current.x - beforeWrapX;
  previous.y += current.y - beforeWrapY;

  if (current.thrust && !thrustLogDone) {
    thrustHeldSeconds += step;
    if (thrustHeldSeconds >= 5) {
      thrustLogDone = true;
      console.log(
        `[exp=${experiment ?? 'none (fixed step)'}] позиція після 5с тяги: x=${current.x.toFixed(3)}, y=${current.y.toFixed(3)}`,
      );
    }
  }

  input.endFrame();
}

function render(alpha) {
  frameCount++;

  if (experiment === '1' && frameCount % 60 === 0) {
    const blockUntil = performance.now() + 100;
    while (performance.now() < blockUntil) {
    }
    console.log('[exp=1] Кадр заблоковано на', (performance.now() - (blockUntil - 100)).toFixed(1), 'мс');
  }

  drawStarfield(ctx, canvas.clientWidth, canvas.clientHeight, stars);
  drawShip(ctx, previous, current, alpha);
  drawHud(ctx, loop.getStats());
}

let loop;

if (experiment === '2') {
  loop = runIntervalLoop();
} else if (experiment === '3') {
  loop = runVariableStepLoop();
} else {
  loop = createLoop({ step: 1 / 60, simulate, render });
  loop.start();
}

setInterval(() => {
  const stats = loop.getStats();
  console.log(
    `[exp=${experiment ?? 'none'}] steps/s=${stats.stepsPerSecond} frames/s=${stats.framesPerSecond} frameTime=${stats.lastFrameDuration.toFixed(2)}ms`,
  );
}, 1000);

function runIntervalLoop() {
  const step = 1 / 60;
  let accumulator = 0;
  let last = performance.now();
  let stepsThisSecond = 0;
  let framesThisSecond = 0;
  let statsWindowStart = last;
  let stepsPerSecond = 0;
  let framesPerSecond = 0;
  let lastFrameDuration = 0;

  setInterval(() => {
    const frameStart = performance.now();
    const now = performance.now();
    const delta = Math.min((now - last) / 1000, 0.25);
    last = now;

    accumulator += delta;
    while (accumulator >= step) {
      simulate(step);
      accumulator -= step;
      stepsThisSecond++;
    }

    render(accumulator / step);
    framesThisSecond++;
    lastFrameDuration = performance.now() - frameStart;

    if (now - statsWindowStart >= 1000) {
      stepsPerSecond = stepsThisSecond;
      framesPerSecond = framesThisSecond;
      stepsThisSecond = 0;
      framesThisSecond = 0;
      statsWindowStart = now;
    }
  }, 16);

  return { getStats: () => ({ stepsPerSecond, framesPerSecond, lastFrameDuration }) };
}

function runVariableStepLoop() {
  let last = performance.now();
  let framesThisSecond = 0;
  let statsWindowStart = last;
  let framesPerSecond = 0;
  let lastFrameDuration = 0;

  function frame(now) {
    const frameStart = performance.now();
    const dt = Math.min((now - last) / 1000, 0.25);
    last = now;

    simulate(dt); 
    render(1);

    framesThisSecond++;
    lastFrameDuration = performance.now() - frameStart;

    if (now - statsWindowStart >= 1000) {
      framesPerSecond = framesThisSecond;
      framesThisSecond = 0;
      statsWindowStart = now;
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  return { getStats: () => ({ stepsPerSecond: framesPerSecond, framesPerSecond, lastFrameDuration }) };
}