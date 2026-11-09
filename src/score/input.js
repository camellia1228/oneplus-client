export function onEscape(callback) {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') callback();
  });
}
