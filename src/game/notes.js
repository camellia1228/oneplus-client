const SPEED = 400;

const playerEl = document.querySelector('.player-east');
const noteImages = {};
for (const dir of ['East', 'West', 'South', 'North']) {
  const img = new Image();
  img.src = `../public/img/Note_${dir}.png`;
  noteImages[dir.toLowerCase()] = img;
}

function noteSize(img) {
  return img.naturalWidth * (playerEl.width / playerEl.naturalWidth);
}

function notePos(note, canvas, elapsed) {
  const half = noteSize(noteImages[note.dir]) / 2;
  const cx = canvas.width / 2 - half;
  const cy = canvas.height / 2 - half;
  const dist = (note.hitTime - elapsed) * SPEED;
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
