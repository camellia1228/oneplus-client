import { onPress, onRelease } from '../input.js';

const BUTTON_IMG = '../public/img/Player_Button.png';
const BUTTON_IMG_PRESSED = '../public/img/Player_Button2.png';

function setButtonImage(dir, pressed) {
  const el = document.querySelector(`.player-${dir}`);
  if (el) el.src = pressed ? BUTTON_IMG_PRESSED : BUTTON_IMG;
}

onPress((dir) => setButtonImage(dir, true));
onRelease((dir) => setButtonImage(dir, false));
