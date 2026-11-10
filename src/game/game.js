import { onPress } from './input.js';
import { judgePress, sweepMisses } from './timing.js';
import { drawNotes } from './notes.js';
import { showJudge } from './ui/judge-view.js';
import { hit } from './ui/combo.js';
import { addAccuracy } from './ui/accuracy.js';
import { finishGame } from './finish.js';
import './layout.js';
import './ui/player.js';

const LEAD_IN = 2;

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let notes = [];
let hasAudio = false;
let elapsed = 0;
let startTime = 0;
const offsetMs = Number(localStorage.getItem('offsetMs')) || 0;
const songTime = (t = performance.now()) => (t - startTime) / 1000;

function judged(dir, name) {
  showJudge(dir, name);
  hit(name);
  addAccuracy(name);
}

onPress((dir, t) => {
  const result = judgePress(notes, dir, songTime(t) - offsetMs / 1000);
  if (result) judged(result.note.dir, result.judgement);
});

function loop(now) {
  elapsed = songTime(now);

  sweepMisses(notes, elapsed).forEach((n) => judged(n.dir, 'Miss'));
  notes = notes.filter((n) => !n.judged);

  drawNotes(ctx, canvas, notes, elapsed);

  if (notes.length > 0) requestAnimationFrame(loop);
  else if (!hasAudio) finishGame();
}

function startPattern(pattern, audioUrl) {
  notes = pattern.map((p) => ({ dir: p.dir, hitTime: p.time + LEAD_IN }));
  hasAudio = !!audioUrl;
  if (audioUrl) {
    const audio = new Audio(audioUrl);
    audio.addEventListener('ended', finishGame);
    setTimeout(() => audio.play().catch(finishGame), LEAD_IN * 1000);
  }
  startTime = performance.now();
  elapsed = 0;
  requestAnimationFrame(loop);
}

async function loadPattern(song) {
  const res = await fetch(`../public/Pattern/${encodeURIComponent(song)}.json`);
  const pattern = await res.json();
  startPattern(pattern, new URLSearchParams(location.search).get('audio'));
}

const song = new URLSearchParams(location.search).get('song');
if (song) loadPattern(song);
