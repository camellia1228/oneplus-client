const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 노트 크기는 game.css
const NOTE_SIZE = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--note-size'));
const SPEED = 400; // px per second
const OVERSHOOT = 50; // 노트가 중앙을 지나 이만큼(px) 더 간 뒤에 사라짐

const noteImages = {};
for (const dir of ['East', 'West', 'South', 'North']) {
  const img = new Image();
  img.src = `../public/Note_${dir}.png`;
  noteImages[dir.toLowerCase()] = img;
}

let notes = []; // 화면에 날아오는 노트
let elapsed = 0; // 게임 시작 후 지난 초
let lastTime = 0;

// 노트 위치
function notePos(note) {
  const cx = canvas.width / 2 - NOTE_SIZE / 2;
  const cy = canvas.height / 2 - NOTE_SIZE / 2;
  const dist = (note.hitTime - elapsed) * SPEED;
  switch (note.dir) {
    case 'east': return { x: cx + dist, y: cy };
    case 'west': return { x: cx - dist, y: cy };
    case 'south': return { x: cx, y: cy + dist };
    case 'north': return { x: cx, y: cy - dist };
  }
}

function loop(now) {
  const dt = Math.min((now - lastTime) / 1000, 1 / 30); // 탭 전환 등 큰
  lastTime = now;
  elapsed += dt;

  notes = notes.filter((n) => elapsed < n.hitTime + OVERSHOOT / SPEED); // 중앙을 조금 지난 노트 제거

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const n of notes) {
    const p = notePos(n);
    ctx.drawImage(noteImages[n.dir], p.x, p.y, NOTE_SIZE, NOTE_SIZE);
  }

  if (notes.length > 0) requestAnimationFrame(loop);
}

// pattern: [{ "time": 1.0, "dir": "east" }, ...]  (time = 중앙에 도착할 초)
function startPattern(pattern) {
  notes = pattern.map((p) => ({ dir: p.dir, hitTime: p.time }));
  elapsed = 0;
  lastTime = performance.now();
  requestAnimationFrame(loop);
}

async function loadPattern(url) {
  const res = await fetch(url);
  startPattern(await res.json());
}

const song = new URLSearchParams(location.search).get('song');
if (song) {
  loadPattern(`../public/Pattern/${encodeURIComponent(song)}.json`);
}
