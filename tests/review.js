const frame = document.querySelector('#preview');
const width = document.querySelector('#width');
const page = document.querySelector('#page');
const motion = document.querySelector('#motion');
const dimensions = document.querySelector('#dimensions');
function report() {
  dimensions.textContent = frame.contentWindow.innerWidth + ' × ' + frame.contentWindow.innerHeight;
  frame.contentDocument.documentElement.dataset.motion = motion.value;
}
width.addEventListener('change', () => {frame.width = width.value; requestAnimationFrame(report);});
page.addEventListener('change', () => {frame.src = page.value;});
motion.addEventListener('change',report);
frame.addEventListener('load',report);
