/* Replace each image path and memory below with your own. Put photos in images/. */
const memories = [
  { title: '第一次心动', text: '在这里写下你们第一次相遇的故事。那一天的天气、她的笑容，还有你想一直记住的小细节。', image: '', colors: ['#443b89', '#b95f91'] },
  { title: '一起走过的路', text: '在这里写下你们第一次一起散步、旅行，或去过的特别地点。', image: '', colors: ['#24445f', '#8f669c'] },
  { title: '那天的日落', text: '在这里写下某个一起看日落的傍晚，或另一段让你舍不得忘记的时光。', image: '', colors: ['#9a4c71', '#d28a75'] },
  { title: '平凡的小幸福', text: '在这里写下那些平凡却珍贵的日常。', image: '', colors: ['#334d78', '#796ea9'] },
  { title: '我们的纪念日', text: '在这里写下属于你们的纪念日与想对她说的话。', image: '', colors: ['#6e3c7e', '#c5799d'] },
  { title: '未完待续', text: '在这里写下你们对未来的约定，让故事继续发光。', image: '', colors: ['#435d8a', '#9b6aab'] }
];

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const grid = document.getElementById('photo-grid');
const dialog = document.getElementById('memory-dialog');
const dialogImage = document.getElementById('dialog-image');

memories.forEach((memory, index) => {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'photo-card';
  card.setAttribute('aria-label', `查看回忆：${memory.title}`);
  card.style.setProperty('--card-gradient', `linear-gradient(145deg, ${memory.colors[0]}, ${memory.colors[1]})`);
  if (memory.image) {
    const img = document.createElement('img');
    img.src = memory.image;
    img.alt = memory.title;
    img.loading = 'lazy';
    img.onerror = () => { img.remove(); card.classList.remove('has-photo'); };
    card.append(img);
    card.classList.add('has-photo');
  }
  const orbit = document.createElement('span');
  orbit.className = 'card-orbit';
  orbit.setAttribute('aria-hidden', 'true');
  orbit.textContent = '✦';
  const caption = document.createElement('span');
  caption.className = 'card-caption';
  const info = document.createElement('span');
  const number = document.createElement('small');
  number.textContent = `MEMORY ${String(index + 1).padStart(2, '0')}`;
  const title = document.createElement('strong');
  title.textContent = memory.title;
  info.append(number, title);
  const arrow = document.createElement('span');
  arrow.className = 'card-arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '↗';
  caption.append(info, arrow);
  card.append(orbit, caption);
  card.addEventListener('click', () => {
    dialogImage.replaceChildren();
    dialogImage.style.background = `linear-gradient(145deg, ${memory.colors[0]}, ${memory.colors[1]})`;
    if (memory.image) {
      const img = document.createElement('img');
      img.src = memory.image;
      img.alt = memory.title;
      img.onerror = () => { dialogImage.replaceChildren('✦'); };
      dialogImage.append(img);
    } else dialogImage.textContent = '✦';
    document.getElementById('dialog-number').textContent = `MEMORY ${String(index + 1).padStart(2, '0')}`;
    document.getElementById('dialog-title').textContent = memory.title;
    document.getElementById('dialog-text').textContent = memory.text;
    dialog.showModal();
  });
  grid.append(card);
});
document.getElementById('dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

const storageKey = 'our-little-universe-wishes-v1';
let wishes = [];
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (Array.isArray(saved)) wishes = saved.filter(item => item && typeof item.text === 'string').slice(-50);
} catch (_) { /* Private mode or disabled storage: wishes still work for this visit. */ }

const wishList = document.getElementById('wish-list');
const wishCount = document.getElementById('wish-count');
function renderWishes() {
  wishList.replaceChildren();
  wishCount.textContent = String(wishes.length).padStart(2, '0');
  if (!wishes.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-wishes';
    empty.textContent = '第一颗星星，等你来点亮。';
    wishList.append(empty);
    return;
  }
  [...wishes].reverse().forEach(wish => {
    const chip = document.createElement('button');
    chip.className = 'wish-chip';
    chip.type = 'button';
    chip.textContent = wish.text;
    chip.title = wish.text;
    chip.setAttribute('aria-label', `愿望：${wish.text}`);
    chip.addEventListener('click', () => { chip.classList.toggle('expanded'); });
    wishList.append(chip);
  });
}
renderWishes();

document.getElementById('wish-form').addEventListener('submit', event => {
  event.preventDefault();
  const input = document.getElementById('wish-input');
  const text = input.value.trim();
  if (!text) return;
  const wish = { text: text.slice(0, 80), x: .12 + Math.random() * .76, y: .08 + Math.random() * .62 };
  wishes = [...wishes, wish].slice(-50);
  try { localStorage.setItem(storageKey, JSON.stringify(wishes)); } catch (_) { /* Storage can be unavailable. */ }
  renderWishes();
  if (reduceMotion.matches) drawSky(0);
  input.value = '';
  document.getElementById('shooting-message').textContent = `愿望已飞入星空：${wish.text}`;
  if (!reduceMotion.matches) {
    const shooting = document.createElement('span');
    shooting.className = 'shooting-wish';
    shooting.textContent = wish.text;
    document.body.append(shooting);
    shooting.addEventListener('animationend', () => shooting.remove(), { once: true });
  }
});

function fitCanvas(canvas, width, height) {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const context = canvas.getContext('2d');
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  return context;
}

const sky = document.getElementById('sky');
let skyContext, skyStars = [], skyWidth = 0, skyHeight = 0;
function resizeSky() {
  skyWidth = window.innerWidth;
  skyHeight = window.innerHeight;
  skyContext = fitCanvas(sky, skyWidth, skyHeight);
  const count = Math.min(180, Math.max(65, Math.floor(skyWidth * skyHeight / 5400)));
  skyStars = Array.from({ length: count }, () => ({ x: Math.random() * skyWidth, y: Math.random() * skyHeight, radius: .35 + Math.random() * 1.3, phase: Math.random() * Math.PI * 2, speed: .2 + Math.random() * .8 }));
}

const heart = document.getElementById('heart');
const stage = document.querySelector('.heart-stage');
let heartContext, heartWidth = 0, heartHeight = 0, particles = [];
const pointer = { x: -1000, y: -1000, active: false };
function resizeHeart() {
  const box = stage.getBoundingClientRect();
  heartWidth = box.width;
  heartHeight = box.height;
  heartContext = fitCanvas(heart, heartWidth, heartHeight);
  const amount = heartWidth < 390 ? 260 : 390;
  const size = Math.min(heartWidth, heartHeight) * .015;
  particles = Array.from({ length: amount }, (_, i) => {
    const t = Math.random() * Math.PI * 2;
    const radius = .38 + Math.sqrt(Math.random()) * .62;
    const hx = 16 * Math.sin(t) ** 3;
    const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const targetX = heartWidth / 2 + hx * size * radius;
    const targetY = heartHeight / 2 - hy * size * radius - heartHeight * .015;
    return { x: targetX + (Math.random() - .5) * 30, y: targetY + (Math.random() - .5) * 30, tx: targetX, ty: targetY, vx: 0, vy: 0, r: i % 8 === 0 ? 2.1 : .8 + Math.random() * 1.1, phase: Math.random() * 6.28 };
  });
}

function trackPointer(event) {
  const box = heart.getBoundingClientRect();
  pointer.x = event.clientX - box.left;
  pointer.y = event.clientY - box.top;
  pointer.active = true;
}
stage.addEventListener('pointermove', trackPointer);
stage.addEventListener('pointerdown', event => {
  trackPointer(event);
  particles.forEach(p => {
    const dx = p.x - pointer.x, dy = p.y - pointer.y;
    const distance = Math.max(1, Math.hypot(dx, dy));
    const force = Math.max(0, 1 - distance / 145) * 16;
    p.vx += dx / distance * force;
    p.vy += dy / distance * force;
  });
});
stage.addEventListener('pointerleave', () => { pointer.active = false; });
stage.addEventListener('pointercancel', () => { pointer.active = false; });

function drawSky(time) {
  skyContext.clearRect(0, 0, skyWidth, skyHeight);
  skyStars.forEach(s => {
    const alpha = .25 + .5 * (.5 + .5 * Math.sin(time * .001 * s.speed + s.phase));
    skyContext.fillStyle = `rgba(235,226,255,${alpha})`;
    skyContext.beginPath();
    skyContext.arc(s.x, (s.y - time * .003 * s.speed + skyHeight) % skyHeight, s.radius, 0, Math.PI * 2);
    skyContext.fill();
  });
  wishes.forEach((wish, i) => {
    const x = wish.x * skyWidth, y = wish.y * skyHeight;
    const twinkle = .6 + .4 * Math.sin(time * .002 + i * 1.9);
    skyContext.save();
    skyContext.shadowColor = '#ff8cbd';
    skyContext.shadowBlur = 12 + 9 * twinkle;
    skyContext.fillStyle = `rgba(255,186,222,${twinkle})`;
    skyContext.beginPath();
    skyContext.arc(x, y, 2.2 + twinkle * 1.7, 0, Math.PI * 2);
    skyContext.fill();
    skyContext.restore();
  });
}

function drawHeart(time) {
  heartContext.clearRect(0, 0, heartWidth, heartHeight);
  const moving = !reduceMotion.matches;
  particles.forEach((p, i) => {
    if (moving) {
      if (pointer.active) {
        const dx = p.x - pointer.x, dy = p.y - pointer.y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        if (distance < 78) {
          const strength = (1 - distance / 78) * 2.4;
          p.vx += dx / distance * strength;
          p.vy += dy / distance * strength;
        }
      }
      p.vx = (p.vx + (p.tx - p.x) * .018) * .89;
      p.vy = (p.vy + (p.ty - p.y) * .018) * .89;
      p.x += p.vx;
      p.y += p.vy;
    } else { p.x = p.tx; p.y = p.ty; }
    const alpha = .55 + .38 * Math.sin(time * .002 + p.phase) ** 2;
    heartContext.fillStyle = i % 5 === 0 ? `rgba(255,237,250,${alpha})` : `rgba(255,143,194,${alpha})`;
    heartContext.shadowColor = '#ff80ba';
    heartContext.shadowBlur = p.r > 1.8 ? 16 : 7;
    heartContext.beginPath();
    heartContext.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    heartContext.fill();
  });
  heartContext.shadowBlur = 0;
}

let frame = 0;
function animate(time) {
  if (!document.hidden) {
    drawSky(time);
    drawHeart(time);
  }
  frame = requestAnimationFrame(animate);
}
function onResize() { resizeSky(); resizeHeart(); if (reduceMotion.matches) { drawSky(0); drawHeart(0); } }
window.addEventListener('resize', onResize, { passive: true });
if ('ResizeObserver' in window) new ResizeObserver(resizeHeart).observe(stage);
onResize();
if (!reduceMotion.matches) frame = requestAnimationFrame(animate);
reduceMotion.addEventListener('change', () => {
  cancelAnimationFrame(frame);
  if (reduceMotion.matches) { drawSky(0); drawHeart(0); }
  else frame = requestAnimationFrame(animate);
});
