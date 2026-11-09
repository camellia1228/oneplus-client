import { replay } from './replay.js';

const el = document.querySelector('.combo');

let combo = 0;
let maxCombo = 0;

export function hit(judgement) {
  if (judgement === 'Bad' || judgement === 'Miss') {
    if (combo > 0) {
      el.classList.remove('show');
      replay(el, 'break');
    }
    combo = 0;
    return;
  }
  combo++;
  if (combo > maxCombo) maxCombo = combo;
  el.textContent = `x${combo}`;
  el.classList.remove('break');
  replay(el, 'show');
}

export const getMaxCombo = () => maxCombo;
