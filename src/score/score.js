import { getRank } from './rank.js';
import { onEscape } from './input.js';

const saved = sessionStorage.getItem('accuracy');

if (saved === null) {
  location.replace('main.html');
} else {
  sessionStorage.removeItem('accuracy');
  const accuracy = parseFloat(saved);
  document.querySelector('.score-rank').src = `../public/img/Score_${getRank(accuracy)}.png`;
  document.querySelector('.score-accuracy').textContent = `${accuracy.toFixed(2)}%`;
  onEscape(() => {
    location.href = 'select.html';
  });
}
