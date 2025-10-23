// === Тема при загрузке (без мигания) ===
(function () {
  const saved = localStorage.getItem('theme');
  const initial = saved || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', initial);
})();

// === Год в футере ===
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// === Навигация и бургер ===
const nav = document.querySelector('.nav');
const burger = document.getElementById('burger');
const menu = document.getElementById('nav-menu');
const brand = document.querySelector('.brand');

function setOpen(open){
  if (!nav || !burger) return;
  nav.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
}
if (burger) burger.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
if (menu) menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
document.addEventListener('click', e => {
  if (!nav || !nav.classList.contains('open')) return;
  if (!nav.contains(e.target)) setOpen(false);
});
if (brand) brand.addEventListener('click', e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); setOpen(false); });

// === Переключатель темы ===
const root = document.documentElement;
const toggleBtn = document.getElementById('theme-toggle');

function syncThemeBtn(theme){
  if (!toggleBtn) return;
  toggleBtn.textContent = theme === 'light' ? '🌙' : '☀️';
  toggleBtn.setAttribute('aria-label', theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему');
  toggleBtn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
}
function setTheme(theme){
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  syncThemeBtn(theme);
}
syncThemeBtn(root.getAttribute('data-theme') || 'dark');
if (toggleBtn) toggleBtn.addEventListener('click', () => {
  const cur = root.getAttribute('data-theme') || 'dark';
  setTheme(cur === 'dark' ? 'light' : 'dark');
});

// === Приветствие через текстовое поле (сохранение/сброс) ===
const greetingText = document.getElementById('greeting-text');
const nameInput    = document.getElementById('name-input');
const saveBtn      = document.getElementById('save-name');
const clearBtn     = document.getElementById('clear-name');
const USERNAME_KEY = 'username';

function normalizeName(v){ v = (v || '').trim(); return v ? v[0].toUpperCase() + v.slice(1) : ''; }
function renderGreeting(name){ if (greetingText) greetingText.textContent = name ? `Здравствуйте, ${name}! 👋` : 'Добро пожаловать!'; }

(function initGreeting(){
  if (!nameInput) return;
  const saved = localStorage.getItem(USERNAME_KEY) || '';
  nameInput.value = saved;
  renderGreeting(saved);
})();
function persistName(){
  if (!nameInput) return;
  const v = normalizeName(nameInput.value);
  if (v) localStorage.setItem(USERNAME_KEY, v); else localStorage.removeItem(USERNAME_KEY);
  renderGreeting(v);
}
if (nameInput) {
  nameInput.addEventListener('input', () => renderGreeting(normalizeName(nameInput.value)));
  nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); persistName(); } });
  nameInput.addEventListener('blur', persistName);
}
if (saveBtn)  saveBtn.addEventListener('click', persistName);
if (clearBtn) clearBtn.addEventListener('click', () => {
  if (!nameInput) return;
  nameInput.value = '';
  localStorage.removeItem(USERNAME_KEY);
  renderGreeting('');
  nameInput.focus();
});

// === Цитаты (кнопка + вывод текста без alert) ===
(function initQuotes(){
  const containerAfter = document.querySelector('.greet') || document.getElementById('main') || document.body;
  if (!containerAfter) return;

  const quotes = [
    'Код — это поэзия.',
    'Ошибки — путь к совершенству.',
    'Сначала сделай, чтобы работало. Потом — красиво. Потом — быстро.',
    'Если повторяешься — вынеси в функцию.',
    'Нейминг — половина программирования.',
  ];

  const box = document.createElement('section');
  box.className = 'card';
  box.style.maxWidth = '980px';
  box.style.margin = '16px auto 0';
  box.style.padding = '20px';

  const text = document.createElement('p');
  text.style.margin = '0 0 12px';
  text.style.textAlign = 'center';
  text.style.fontWeight = '600';
  text.style.minHeight = '1.5em';
  text.style.transition = 'opacity .25s';
  text.textContent = 'Нажми, чтобы увидеть цитату.';

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = '✨ Показать цитату';
  btn.style.display = 'block';
  btn.style.margin = '8px auto 0';
  btn.style.padding = '10px 16px';
  btn.style.borderRadius = '10px';
  btn.style.border = 'none';
  btn.style.cursor = 'pointer';
  btn.style.fontWeight = '600';
  btn.style.background = 'var(--accent)';
  btn.style.color = '#fff';

  let last = -1;
  function showQuote(){
    text.style.opacity = '0';
    let i; do { i = Math.floor(Math.random() * quotes.length); } while (quotes.length > 1 && i === last);
    last = i;
    setTimeout(() => { text.textContent = quotes[i]; text.style.opacity = '1'; }, 160);
  }

  btn.addEventListener('click', showQuote);
  btn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showQuote(); } });

  box.append(text, btn);
  containerAfter.parentNode
    ? containerAfter.parentNode.insertBefore(box, containerAfter.nextSibling)
    : document.body.appendChild(box);
})();
