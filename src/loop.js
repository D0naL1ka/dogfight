const MAX_FRAME_DELTA = 0.25;

export function createLoop({ step = 1 / 60, simulate, render }) {
  let accumulator = 0;
  let last = null;
  let rafId = null;
  let running = false;

  let stepsThisSecond = 0;
  let framesThisSecond = 0;
  let statsWindowStart = 0;
  let stepsPerSecond = 0;
  let framesPerSecond = 0;
  let lastFrameDuration = 0;

  function frame(now) {
    if (!running) return;

    if (last === null) {
      last = now;
      statsWindowStart = now;
      rafId = requestAnimationFrame(frame);
      return;
    }

    const frameStart = performance.now();

    const rawDelta = (now - last) / 1000;
    const delta = Math.min(rawDelta, MAX_FRAME_DELTA);
    last = now;

    accumulator += delta;
    while (accumulator >= step) {
      simulate(step);
      accumulator -= step;
      stepsThisSecond++;
    }

    const alpha = accumulator / step;
    render(alpha);
    framesThisSecond++;

    lastFrameDuration = performance.now() - frameStart;

    if (now - statsWindowStart >= 1000) {
      stepsPerSecond = stepsThisSecond;
      framesPerSecond = framesThisSecond;
      stepsThisSecond = 0;
      framesThisSecond = 0;
      statsWindowStart = now;
    }

    rafId = requestAnimationFrame(frame);
  }

  return {
    start() {
      if (running) return;
      running = true;
      last = null;
      rafId = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
    },
    getStats() {
      return { stepsPerSecond, framesPerSecond, lastFrameDuration };
    },
  };
}