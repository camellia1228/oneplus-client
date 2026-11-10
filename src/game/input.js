
const KEY_TO_DIR = {
  KeyW: 'north', ArrowUp: 'north',
  KeyA: 'west', ArrowLeft: 'west',
  KeyS: 'south', ArrowDown: 'south',
  KeyD: 'east', ArrowRight: 'east',
};

const held = { north: new Set(), west: new Set(), south: new Set(), east: new Set() };
const pressListeners = [];
const releaseListeners = [];

function keyOf(e) {
  return KEY_TO_DIR[e.code] ? e.code : null;
}//                    ^ key 가 아니라 code 인 이유 = 맥 os 와 한영키 입력 불가로 인해

window.addEventListener('keydown', (e) => {
  const key = keyOf(e);
  if (!key) return;
  e.preventDefault();
  const dir = KEY_TO_DIR[key];
  if (held[dir].has(key)) return; // 누르고 있는 동안 반복 이벤트 무시
  const wasDown = held[dir].size > 0;
  held[dir].add(key);
  if (!wasDown) pressListeners.forEach((fn) => fn(dir, performance.now()));
});

window.addEventListener('keyup', (e) => {
  const key = keyOf(e);
  if (!key) return;
  const dir = KEY_TO_DIR[key];
  if (!held[dir].delete(key)) return;
  if (held[dir].size === 0) releaseListeners.forEach((fn) => fn(dir, performance.now()));
});

// 창 포커스를 잃으면 눌린 상태 초기화
window.addEventListener('blur', () => {
  for (const dir of Object.keys(held)) {
    if (held[dir].size > 0) {
      held[dir].clear();
      releaseListeners.forEach((fn) => fn(dir, performance.now()));
    }
  }
});

export const onPress = (fn) => pressListeners.push(fn);
export const onRelease = (fn) => releaseListeners.push(fn);
export const isDown = (dir) => held[dir].size > 0;
