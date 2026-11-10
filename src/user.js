import { getMe, login, logout } from './api.js';

const userName = document.querySelector('.user-name');
const welcome = document.querySelector('.user-welcome');
const views = document.querySelectorAll('[data-view]');

const GUEST_NAME = 'USER';

function showView(name) {
  views.forEach((view) => {
    view.hidden = view.dataset.view !== name;
  });
}

function setUser(name) {
  userName.textContent = name || GUEST_NAME;
  welcome.textContent = name ? `${name} 님` : '';
}

document.querySelector('[data-action="login"]').addEventListener('click', login);

document.querySelector('[data-action="logout"]').addEventListener('click', async () => {
  await logout().catch(console.error);
  setUser('');
  showView('login');
});

getMe()
  .then((me) => {
    setUser(me.nickname ?? me.name);
    showView('logged-in');
  })
  .catch(() => {});
