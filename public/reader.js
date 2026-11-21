const reader = document.querySelector('.reader');
const cueToggle = document.querySelector('[data-cues]');
const sizeButtons = document.querySelectorAll('[data-size]');
let size = 1.25;
cueToggle.addEventListener('click', () => {
  const hidden = cueToggle.getAttribute('aria-pressed') === 'true';
  document.querySelectorAll('.cue').forEach((cue) => { cue.hidden = !hidden; });
  cueToggle.setAttribute('aria-pressed', String(!hidden));
  cueToggle.textContent = hidden ? 'Hide screen cues' : 'Show screen cues';
});
sizeButtons.forEach((button) => button.addEventListener('click', () => {
  size = Math.max(1, Math.min(2.5, size + Number(button.dataset.size)));
  reader.style.setProperty('--reading-size', size + 'rem');
}));
