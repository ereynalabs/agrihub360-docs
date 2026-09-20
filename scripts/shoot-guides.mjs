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
const tapLabel = async (label) => { const el = await page.$(`[aria-label="${label}"]`); if (el) { await el.click(); return 'ok'; } return 'no ' + label; };
const F = '33333333-3333-3333-3333-333333333301';

await login('sam@whitakerfarm.co.uk');
await page.evaluate(() => localStorage.setItem('agrihub:activeFarmId', '22222222-2222-2222-2222-222222222201'));
await go('/'); await shot('today');
await go('/fields', 3500); await shot('map-layers');
console.log(await scrollTo('North Pasture', 80)); await shot('map-rows');
await go('/fields/draw'); await shot('draw-field');
await go('/farms/map/import'); await shot('import-rpa');
await go('/farms/map/feature'); await shot('draw-feature');
await go('/devices/77777777-7777-7777-7777-777777777701?place=1', 3500); await shot('probe-place');
await go(`/fields/${F}/zones`, 3500); console.log(await scrollTo('Do the zones hold')); await shot('zones-test');
console.log(await scrollTo('rate plan')); await shot('rate-plan');
console.log(await tap('Export for the tractor')); await shot('rate-export');
await go(`/fields/${F}`, 3500); console.log(await scrollTo('modelled')); await shot('sensor-advisor');
await go('/records'); await shot('records-evidence');
console.log(await tapLabel('Add a record')); await shot('sheet-spray');
console.log(await tap('Fertiliser or other')); await shot('sheet-fertiliser');
console.log(await tap('Nitrogen (NVZ)')); await shot('sheet-nitrogen');
console.log(await tap('Harvest')); await shot('sheet-harvest');
console.log(await tap('Note')); await shot('sheet-note');
await go('/compliance', 3500); await shot('compliance-checklist');
await go('/farms/key-dates'); await shot('key-dates');
await go(`/fields/${F}/nvz`); await shot('nvz-record');
await go('/account/sfi'); await shot('sfi');
await go(`/fields/${F}/nutrient-plan`, 3500); console.log(await scrollTo('Soil samples')); await shot('soil-samples');
await go(`/fields/${F}/plantings`); await shot('plantings');
await go(`/fields/${F}/triggers`); await shot('triggers');
await go(`/fields/${F}/triggers/edit`); await shot('trigger-edit');
await go('/account/farm'); await shot('farm-setup');
console.log(await scrollTo('holding and business')); await shot('farm-holding');
console.log(await scrollTo('danger zone')); await shot('farm-danger');
await go('/billing', 3500); await shot('billing');
await go('/team'); await shot('team');
await go('/team/invite'); await shot('team-invite');
await go('/account/2fa'); await shot('2fa');
await go('/devices/new'); await shot('claim-sensor');
await go('/devices'); await shot('sensors');
await go('/devices/bridge'); await shot('connect-station');
await go('/help/chat', 3000);
try {
  await page.type('input, textarea', 'Log the spray I just did: Aviator Xpro at 1 l/ha on North Pasture for septoria', { delay: 5 });
  await page.keyboard.press('Enter'); await wait(20000);
} catch (e) { console.log('chat', e.message); }
await shot('assistant-draft');

await login('carys@cwmelanfarm.co.uk');
await page.evaluate(() => localStorage.setItem('agrihub:activeFarmId', '22222222-2222-2222-2222-222222222212'));
await go('/', 3500); console.log(await scrollTo('Hand to someone', 200)); await shot('today-people');
console.log(await tap('Hand to someone')); await shot('assign-sheet');
await go('/farms/livestock', 3000); await shot('livestock'); console.log(await scrollTo('grazing wedge')); await shot('wedge');
await go('/farms/manure-plan', 3500); await shot('manure-plan');

await login('priya@fieldwiseagronomy.co.uk');
await go('/advisor', 4000); await shot('advisor-today');
await go('/advisor/approvals', 3000); await shot('advisor-approvals');
await browser.close();
