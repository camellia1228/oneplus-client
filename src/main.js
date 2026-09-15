// add service
import './routes/route.service.js'
import './common/util/resize.util.js'

// game
// export const canvas = document.getElementById('game')
// export const ctx = canvas.getContext('2d')

// app ui
export const app = document.getElementById('app')


const musicList = [
  { id: 1, name: 'Freedom Dive',  artist: 'xi',      bpm: 222, level: 12 },
  { id: 2, name: 'Blue Zenith',   artist: 'xi',      bpm: 200, level: 10 },
  { id: 3, name: 'Night of Nights', artist: 'Beatmario', bpm: 180, level: 9 },
  // ... 필요한 만큼 추가
];

const container = document.querySelector('.scroll-container');





container.innerHTML = musicList.map((music) => `
  <div class="Music-Box" data-id="${music.id}">
    <div class="Music-Profile"></div>
    <div class="Music-Info">
      <p class="Music-Name">${music.name}</p>
      <p class="Artist">${music.artist}</p>
    </div>
  </div>
`).join('');





container.addEventListener('click', (event) => {
  const box = event.target.closest('.Music-Box');
  if (!box) return;
  selectMusic(Number(box.dataset.id));
});





function selectMusic(id) {
  const music = musicList.find((item) => item.id === id);
  if (!music) return;
  container.querySelectorAll('.Music-Box').forEach((box) => {
    box.classList.toggle('selected', Number(box.dataset.id) === id);
  });

  document.querySelector('.play-title').textContent = music.name;
  document.querySelector('.play-artist').textContent = music.artist;
  document.querySelector('.play-bpm').textContent = `BPM ${music.bpm} / LV ${music.level}`;
}