function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpAngle(a, b, t) {
  let diff = b - a;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return a + diff * t;
}

export function drawShip(ctx, previous, current, alpha) {
  const x = lerp(previous.x, current.x, alpha);
  const y = lerp(previous.y, current.y, alpha);
  const angle = lerpAngle(previous.angle, current.angle, alpha);
  const thrust = current.thrust;
  const SHIP_SCALE = 2;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(SHIP_SCALE, SHIP_SCALE);

  if (thrust) {
    const jitter = () => (Math.random() - 0.5) * 4;


    ctx.fillStyle = '#ff8a3d';
    ctx.beginPath();
    ctx.moveTo(-20, 7);
    ctx.lineTo(-28 + jitter(), 3);
    ctx.lineTo(-34 + jitter(), 0);
    ctx.lineTo(-28 + jitter(), -3);
    ctx.lineTo(-20, -7);
    ctx.closePath();
    ctx.fill();


    ctx.fillStyle = '#ffd23d';
    ctx.beginPath();
    ctx.moveTo(-20, 4);
    ctx.lineTo(-26 + jitter(), 2);
    ctx.lineTo(-30 + jitter(), 0);
    ctx.lineTo(-26 + jitter(), -2);
    ctx.lineTo(-20, -4);
    ctx.closePath();
    ctx.fill();
  }


  ctx.fillStyle = '#1f3a5f';
  ctx.beginPath();
  ctx.moveTo(-15, 7);
  ctx.lineTo(-20, 4);
  ctx.lineTo(-20, -4);
  ctx.lineTo(-15, -7);
  ctx.closePath();
  ctx.fill();


  ctx.fillStyle = '#1f3a5f';
  ctx.beginPath();
  ctx.moveTo(-6, 7);
  ctx.lineTo(-20, 16);
  ctx.lineTo(-12, 7);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-6, -7);
  ctx.lineTo(-20, -16);
  ctx.lineTo(-12, -7);
  ctx.closePath();
  ctx.fill();


  ctx.fillStyle = '#bfe0ff';
  ctx.beginPath();
  ctx.moveTo(18, 8);
  ctx.lineTo(-15, 8);
  ctx.lineTo(-15, -8);
  ctx.lineTo(18, -8);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#4a6b96';
  ctx.lineWidth = 1;
  ctx.stroke();


  ctx.fillStyle = '#1f3a5f';
  ctx.beginPath();
  ctx.moveTo(32, 0);
  ctx.lineTo(18, 9);
  ctx.lineTo(18, -9);
  ctx.closePath();
  ctx.fill();


  ctx.fillStyle = '#1f3a5f';
  ctx.fillRect(-2, -8, 5, 16);


  ctx.fillStyle = '#1f3a5f';
  ctx.beginPath();
  ctx.arc(8, 0, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#7fd4ff';
  ctx.beginPath();
  ctx.arc(8, 0, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.beginPath();
  ctx.arc(6.5, -1.5, 1.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawStarfield(ctx, width, height, stars) {
  ctx.fillStyle = '#0a0e1a';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#ffffff';
  for (const s of stars) {
    ctx.globalAlpha = s.brightness;
    ctx.fillRect(s.x, s.y, s.size, s.size);
  }
  ctx.globalAlpha = 1;
}

export function drawHud(ctx, stats) {
  ctx.fillStyle = '#8fd3ff';
  ctx.font = '14px monospace';
  ctx.fillText(`steps/s: ${stats.stepsPerSecond}`, 12, 20);
  ctx.fillText(`frames/s: ${stats.framesPerSecond}`, 12, 38);
  ctx.fillText(`frame time: ${stats.lastFrameDuration.toFixed(2)} ms`, 12, 56);
}