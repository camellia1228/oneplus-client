import { getAccuracy } from './ui/accuracy.js';

const RESULT_DELAY = 2000;

let finished = false;

export function finishGame() {
  if (finished) return;
  finished = true;
  sessionStorage.setItem('accuracy', getAccuracy());
  setTimeout(() => {
    location.href = 'score.html';
  }, RESULT_DELAY);
}
