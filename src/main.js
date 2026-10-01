// add service
import './routes/route.service.js'
import './common/util/resize.util.js'

// game
// export const canvas = document.getElementById('game')
// export const ctx = canvas.getContext('2d')

// app ui
export const app = document.getElementById('app')


const musicList = [
  { id: 1,  name: 'Turkey March',     artist: 'Wolfgang Amadeus Mozart',bpm: 100, image: '../public/Profile/Turkey March.png',      audio: '../public/Music/Turkey March.mp3'      },
  { id: 2,  name: 'Midnight Triplet', artist: 'Suno',                   bpm: 130, image: '../public/Profile/Midnight Triplet.jpeg', audio: '../public/Music/Midnight Triplet.m4a'  },
  { id: 3,  name: 'Cat Foot',         artist: 'Suno',                   bpm: 71,  image: '../public/Profile/Cat Foot.jpeg',         audio: '../public/Music/Cat Foot.m4a'          },
  { id: 4,  name: 'The Big Black',              artist: 'Nishikaze feat. Kotoha',     bpm: 233, level: 11 },
  { id: 5,  name: 'Red Rotus',        artist: 'Suno',                   bpm: 222, image: '../public/Profile/Red Rotus.jpeg',        audio: '../public/Music/Red Rotus.m4a'         },
  { id: 6,  name: 'PARANOiA',                   artist: '180',                        bpm: 180, level: 8 },
  { id: 7,  name: 'MAX 300',                    artist: 'DM Ashura',                  bpm: 300, level: 12 },
  { id: 8,  name: 'Conflict',                   artist: 'Sota Fujimori',              bpm: 175, level: 9 },
  { id: 9,  name: 'Sandstorm',                  artist: 'Darude',                     bpm: 136, level: 6 },
  { id: 10, name: "World's End Dancehall",      artist: 'wowaka',                     bpm: 185, level: 8 },
  { id: 11, name: 'Senbonzakura',               artist: 'Kurousa-P',                  bpm: 154, level: 7 },
  { id: 12, name: 'Rainbow',                    artist: 'Sennzai',                    bpm: 175, level: 9 },
  { id: 13, name: 'GOODTEK',                    artist: 'Camellia',                   bpm: 175, level: 10 },
  { id: 14, name: 'Bad Apple!!',                artist: 'ZUN (Team Shanghai Alice)',  bpm: 138, level: 7 },
];

const container = document.querySelector('.scroll-container');
const photoBox = document.querySelector('.photo-box');

const audioCache = new Map();
musicList.forEach((music) => {
  if (!music.audio) return;
  const audio = new Audio(music.audio);
  audio.preload = 'auto';
  audio.loop = true;
  audio.load();
  audioCache.set(music.id, audio);
});
let currentAudio = null;





container.innerHTML = musicList.map((music) => `
  <div class="Music-Box" data-id="${music.id}">
    <div class="Music-Profile"${music.image ? ` style="background-image: url('${music.image}')"` : ''}></div>
    <div class="Music-Info">
      <p class="Music-Name">${music.name}</p>
      <p class="Artist">${music.artist}</p>
      
    </div>
  </div>
`).join('');





function update(event) {
  const box = event.target.closest('.Music-Box');
  if (!box) return;
  selectMusic(Number(box.dataset.id));
}

container.addEventListener('click', update);

const X_PER_DISTANCE = 0.3; // 중앙에서 1px 멀어질 때마다 x로 이동할 픽셀 비율

function updateMusicBoxOffsets() {
  const centerY = container.getBoundingClientRect().top + container.clientHeight / 2;

  container.querySelectorAll('.Music-Box').forEach((box) => {
    const boxCenterY = box.getBoundingClientRect().top + box.clientHeight / 2;
    const distance = Math.abs(boxCenterY - centerY);
    box.style.transform = `translateX(${distance * X_PER_DISTANCE}px)`;
  });
}

let ticking = false;
container.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateMusicBoxOffsets();
    ticking = false;
  });
});

updateMusicBoxOffsets();





let selectedMusic = null;

document.querySelector('.Play-Button').addEventListener('click', () => {
  if (!selectedMusic) return;
  location.href = `game.html?song=${encodeURIComponent(selectedMusic.name)}`;
});

function selectMusic(id) {
  const music = musicList.find((item) => item.id === id);
  if (!music) return;
  selectedMusic = music;
  container.querySelectorAll('.Music-Box').forEach((box) => {
    box.classList.toggle('selected', Number(box.dataset.id) === id);
  });

  document.querySelector('.play-title').textContent = music.name;
  document.querySelector('.play-artist').textContent = music.artist;
  document.querySelector('.play-bpm').textContent = `BPM ${music.bpm}`;

  if (photoBox) {
    photoBox.style.backgroundImage = music.image
      ? `linear-gradient(to right, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 1) 100%), url('${music.image}')`
      : '';
  }

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  const audio = audioCache.get(id);
  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
  currentAudio = audio ?? null;
}