// add service
import './routes/route.service.js'
import './common/util/resize.util.js'
import { getTracks, imageUrl, audioUrl } from './api.js'

// game
// export const canvas = document.getElementById('game')
// export const ctx = canvas.getContext('2d')

// app ui
export const app = document.getElementById('app')


const PAGE_SIZE = 20

async function loadAllTracks() {
  const list = []
  let cursor
  while (true) {
    const data = await getTracks(cursor)
    const rows = Array.isArray(data) ? data : data?.tracks ?? []
    list.push(...rows)
    if (rows.length < PAGE_SIZE) break
    cursor = rows[rows.length - 1].id
  }
  return list
}

let musicList = []
try {
  musicList = (await loadAllTracks()).map((t) => ({
    id: t.id,
    name: t.title,
    artist: t.artist,
    image: imageUrl(t.image),
    audio: audioUrl(t.audio),
  }))
} catch (e) {
  console.error(e)
}

const container =document.querySelector('.scroll-container');
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
  location.href = `game.html?song=${encodeURIComponent(selectedMusic.name)}&audio=${encodeURIComponent(selectedMusic.audio)}`;
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