export function createInput(target = window) {
  const down = new Set();
  const pressedThisFrame = new Set();

  function onKeyDown(e) {
    if (!down.has(e.code)) pressedThisFrame.add(e.code);
    down.add(e.code);
  }

  function onKeyUp(e) {
    down.delete(e.code);
  }

  target.addEventListener('keydown', onKeyDown);
  target.addEventListener('keyup', onKeyUp);

  return {
    isDown: (code) => down.has(code),
    justPressed: (code) => pressedThisFrame.has(code),
    endFrame() {
      pressedThisFrame.clear();
    },
    dispose() {
      target.removeEventListener('keydown', onKeyDown);
      target.removeEventListener('keyup', onKeyUp);
    },
  };
}