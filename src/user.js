import { getMe, login, logout } from './api.js';

const userName =document.querySelector('.user-name');
const welcome = document.querySelector('.user-welcome');
const message = document.querySelector('.user-message');
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

document.querySelectorAll('[data-go]').forEach((button) => {
  button.addEventListener('click', () => {
    message.textContent = '';
    showView(button.dataset.go);
  });
});

document.querySelector('[data-view="login"]').addEventListener('submit', (e) => {
  e.preventDefault();
  login();
});

document.querySelector('[data-view="signup"]').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  if (form.elements.password.value !== form.elements.confirm.value) {
    message.textContent = '비밀번호가 일치하지 않습니다.';
    return;
  }
  message.textContent = '';
  form.reset();
  showView('login');
});

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
