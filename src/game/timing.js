export const WINDOWS = [
  { name: 'Perfect', ms: 40 },
  { name: 'Great', ms: 80 },
  { name: 'Good', ms: 120 },
  { name: 'Bad', ms: 160 },
];
export const MISS_MS = WINDOWS[WINDOWS.length - 1].ms;

export function judgeDiff(diffMs) {
  const w = WINDOWS.find((w) => diffMs <= w.ms);
  return w ? w.name : 'Miss';
}

export function judgePress(notes, dir, time) {
  let target = null;
  let best = Infinity;
  for (const n of notes) {
    if (n.dir !== dir || n.judged) continue;
    const diff = Math.abs(n.hitTime - time) * 1000;
    if (diff <= MISS_MS && diff < best) {
      best = diff;
      target = n;
    }
  }
  if (!target) return null;
  target.judged = true;
  return { note: target, judgement: judgeDiff(best), diffMs: (time - target.hitTime) * 1000 };
}

export function sweepMisses(notes, time) {
  const missed = [];
  for (const n of notes) {
    if (!n.judged && (time - n.hitTime) * 1000 > MISS_MS) {
      n.judged = true;
      missed.push(n);
    }
  }
  return missed;
}
