import { replay } from './replay.js';

const IMAGES = ['Perfect', 'Great', 'Good', 'Bad', 'Miss'];
for (const name of IMAGES) new Image().src = `../public/img/${name}.png`;

export function showJudge(dir, name) {
  const el = document.querySelector(`.judge-${dir}`);
  if (!el) return;
  el.src = `../public/img/${name}.png`;
  replay(el, 'show');
}
