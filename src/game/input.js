// 방향 키 입력 처리: WASD / 화살표 -> north, west, south, east
// 노트 판정 등 다른 모듈에서 onPress / isDown 으로 입력 정보를 받아 쓴다.
const KEY_TO_DIR = {
  w: 'north', ArrowUp: 'north',
  a: 'west', ArrowLeft: 'west',
  s: 'south', ArrowDown: 'south',
  d: 'east', ArrowRight: 'east',
};

// 방향별로 현재 눌려 있는 키 목록 (WASD + 화살표 중 하나라도 눌려 있으면 눌린 상태)
const held = { north: new Set(), west: new Set(), south: new Set(), east: new Set() };
const pressListeners = [];
const releaseListeners = [];

function keyOf(e) {
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  return KEY_TO_DIR[key] ? key : null;
}

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
