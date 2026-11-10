// 게임 화면의 모든 크기/위치/속도는 이 단위(u) 하나로 계산한다.
// 16:9 영역을 화면 안에 꽉 차게 맞췄을 때 가로 1%가 1u (1920x1080에서 19.2px)
let unit = 1;

function update() {
  unit = Math.min(window.innerWidth, (window.innerHeight * 16) / 9) / 100;
  document.documentElement.style.setProperty('--u', `${unit}px`);
}

update();
window.addEventListener('resize', update);

export const getUnit = () => unit;
