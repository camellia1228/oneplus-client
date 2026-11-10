const offsetInput = document.querySelector('.setting-input');
offsetInput.value = localStorage.getItem('offsetMs') ?? 0;
offsetInput.addEventListener('input', () => {
  localStorage.setItem('offsetMs', Number(offsetInput.value) || 0);
});
