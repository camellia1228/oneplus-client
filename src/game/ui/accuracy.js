import { replay } from './replay.js';

const el = document.querySelector('.accuracy');

const WEIGHT = { Perfect: 1, Great: 0.8, Good: 0.5, Bad: 0.2, Miss: 0 };

let total = 0;
let count = 0;

export function addAccuracy(judgement) {
  total += WEIGHT[judgement];
  count++;
  el.textContent = `${getAccuracy().toFixed(2)}%`;
  replay(el, 'pop');
}

export const getAccuracy = () => (count ? (total / count) * 100 : 100);
