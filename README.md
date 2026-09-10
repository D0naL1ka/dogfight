# Lab 1 — Summary (M1–M4)
## M1 — The Loop, With Proof
`createLoop({ step, simulate, render })` — rAF + clamped accumulator. `getStats()` exposes steps/s, frames/s, last frame duration; `render` gets `alpha`.
**Result:** steps/s ≈ 60 on any display; frames/s matches the screen's refresh rate.

## M2 — Input as a Closure, Ship as Data
`createInput()` — key state private in a closure (`isDown`, edge-triggered `justPressed`). Ship = `{ x, y, vx, vy, angle, thrust }`; `integrate(ship, input, dt)` is pure (rotation, thrust along heading, drag, speed clamp). `wrap()` handles arena edges.
**Tuning:** `ROTATE_SPEED=π rad/s`, `THRUST_ACCEL=200 px/s²`, `DRAG=0.5`, `MAX_SPEED=300 px/s` — light inertia, no instant stop.

## M3 — Render With Interpolation
`previous`/`current` states; `render(alpha)` = `lerp(previous, current, alpha)`, with `lerpAngle` wrapping through `(-π, π]` to avoid the 0/2π snap. Arena-wrap also shifts `previous`, or lerp streaks across the screen.
DPR-aware canvas (`ctx.setTransform`), ship drawn via `translate`/`rotate`.
**Result:** smooth at 60 and 120 Hz; steps/s stays ~60 on both, frames/s tracks the display.

## M4 — Break It, Then Measure
Toggled via `?exp=1|2|3`, auto-logged to console.

**1. 100ms busy-wait in `render()`, every 60th frame**
Screen freezes ~1s intervals, ship snaps forward after. `frameTime=100.60ms` on the blocked frame; `frames/s` dips to 55–56, `steps/s` stays ~60 (accumulator catches up).
*Why:* synchronous code runs to completion — the event loop can't interrupt it from the same thread, no matter what API is used (`setTimeout`, `Promise`, etc.).

**2. `setInterval(frame, 16)` vs `rAF`**
Active tab: `setInterval` → frames/s≈63 (unsynced, runs faster than 60Hz). Background 5s: `setInterval` throttles to ~1-2 fps but keeps running; `rAF` drops to a flat 0/0 and pauses fully, then snaps instantly back to 60/60 on return (`setInterval` recovers gradually instead).

**3. Variable step (no accumulator) vs fixed step, position after 5s of thrust**

| Condition | x | y |
|---|---|---|
| Variable step, no throttle | 136.599 | 367.000 |
| Variable step, 6× throttle | 254.170 | 334.000 |
| Fixed step, 6× throttle | 1349.297 | 153.000 |
| Fixed step, no throttle | 1349.297 | 153.000 |

Variable step diverges under throttling (Δx≈117); fixed step matches to 3 decimals regardless — determinism depends only on step count, not on real-time frame slicing.
