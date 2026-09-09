export function createShip({ x = 0, y = 0 } = {}) {
  return { x, y, vx: 0, vy: 0, angle: 0, thrust: false };
}

const ROTATE_SPEED = Math.PI;
const THRUST_ACCEL = 100;
const DRAG = 0.5;
const MAX_SPEED = 200;

export function integrate(ship, input, dt) {
  if (input.isDown('ArrowLeft') || input.isDown('KeyA')) {
    ship.angle -= ROTATE_SPEED * dt;
  }
  if (input.isDown('ArrowRight') || input.isDown('KeyD')) {
    ship.angle += ROTATE_SPEED * dt;
  }

  ship.thrust = input.isDown('ArrowUp') || input.isDown('KeyW');
  if (ship.thrust) {
    ship.vx += Math.cos(ship.angle) * THRUST_ACCEL * dt;
    ship.vy += Math.sin(ship.angle) * THRUST_ACCEL * dt;
  }

  const dragFactor = Math.max(0, 1 - DRAG * dt);
  ship.vx *= dragFactor;
  ship.vy *= dragFactor;

  const speed = Math.hypot(ship.vx, ship.vy);
  if (speed > MAX_SPEED) {
    const scale = MAX_SPEED / speed;
    ship.vx *= scale;
    ship.vy *= scale;
  }

  ship.x += ship.vx * dt;
  ship.y += ship.vy * dt;
}