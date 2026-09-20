import { createRequire } from 'module'; const puppeteer = createRequire(import.meta.url)(process.env.PUPPETEER ?? 'puppeteer');
// The screens for the task pages, from the demo farms on a local stack (app on :3000, api on :3001).
// Needs puppeteer on the machine; point PUPPETEER at its folder.
const OUT = new URL('../images/screens', import.meta.url).pathname;
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 540 / 390, isMobile: true, hasTouch: true });
const wait = (ms) => new Promise(r => setTimeout(r, ms));
const login = async (email) => { await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' }); await page.evaluate(async (email, pw) => {
  const sha = async (s) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  const { nonce } = await fetch('http://localhost:3001/api/auth/login', { credentials: 'include' }).then(r => r.json());
  await fetch('http://localhost:3001/api/auth/login/callback', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: email, password: await sha(await sha(pw) + nonce) }) });
}, email, 'Demo123!'); };
const shot = async (name, ms = 1200) => { await wait(ms); await page.screenshot({ path: `${OUT}/${name}.jpg`, type: 'jpeg', quality: 82 }); console.log('shot', name); };
const go = async (path, ms = 2500) => { await page.goto('http://localhost:3000' + path, { waitUntil: 'networkidle0' }); await wait(ms); };
const scrollTo = async (text, off = 12) => page.evaluate((text, off) => {
  const el = [...document.querySelectorAll('div,span')].find(d => d.children.length === 0 && d.textContent?.trim().toLowerCase().includes(text.toLowerCase()));
  if (!el) return 'not found: ' + text;
  let sc = el.parentElement; while (sc && !['scroll', 'auto'].includes(getComputedStyle(sc).overflowY)) sc = sc.parentElement;
  if (!sc) { window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - off); return 'window'; }
  sc.scrollTop = el.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - off; return 'ok';
}, text, off);
const tap = async (text) => page.evaluate((text) => {
  const el = [...document.querySelectorAll('div,span,button')].find(d => d.children.length === 0 && d.textContent?.trim().toLowerCase() === text.toLowerCase());
  if (!el) return 'not found: ' + text; el.click(); return 'ok';
}, text);
const F = '33333333-3333-3333-3333-333333333301';
await login('sam@whitakerfarm.co.uk');
await page.evaluate(() => localStorage.setItem('agrihub:activeFarmId', '22222222-2222-2222-2222-222222222201'));
await go(`/fields/${F}`, 3500); console.log(await tap('History')); await wait(2500); console.log(await scrollTo('Measured against modelled', 60)); await shot('sensor-advisor');
await go('/help/chat', 3000);
await page.type('input, textarea', 'Log the spray I just did: Aviator Xpro at 1 l/ha on North Pasture for septoria', { delay: 5 });
const box = await page.evaluate(() => { const r = document.querySelector('input, textarea').getBoundingClientRect(); return { x: r.right + 24, y: r.top + r.height / 2 }; });
await page.touchscreen.tap(box.x, box.y); await wait(25000); await shot('assistant-draft');
await login('priya@fieldwiseagronomy.co.uk');
await go('/advisor', 4000); console.log(await scrollTo('Across your farms this week', 60)); await shot('advisor-today');
await browser.close();
