import { getUnit } from './layout.js';

const SPEED = 20.83; // u/s (1920x1080 기준 400px/s)
const PLAYER_W = 7; // u, game.css의 플레이어 버튼 너비와 동일
const PLAYER_IMG_W = 760;

const noteImages = {};
for (const dir of ['East', 'West', 'South', 'North']) {
  const img = new Image();
  img.src = `../public/img/Note_${dir}.png`;
  noteImages[dir.toLowerCase()] = img;
}

function noteSize(img) {
  return img.naturalWidth * ((PLAYER_W * getUnit()) / PLAYER_IMG_W);
}

function notePos(note, canvas, elapsed) {
  const half = noteSize(noteImages[note.dir]) / 2;
  const cx = canvas.width / 2 - half;
  const cy = canvas.height / 2 - half;
  const dist = (note.hitTime - elapsed) * SPEED * getUnit();
  switch (note.dir) {
    case 'east': return { x: cx + dist, y: cy };
    case 'west': return { x: cx - dist, y: cy };
    case 'south': return { x: cx, y: cy + dist };
    case 'north': return { x: cx, y: cy - dist };
  }
}

export function drawNotes(ctx, canvas, notes, elapsed) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const n of notes) {
    const p = notePos(n, canvas, elapsed);
    const size = noteSize(noteImages[n.dir]);
    ctx.drawImage(noteImages[n.dir], p.x, p.y, size, size);
  }
}
