import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const outputPath = resolve('dist/site/staticwebapp.config.json');
const policy = JSON.parse(await readFile(outputPath, 'utf8'));
const expectedGlobalHeaders = {
  'Content-Security-Policy': "default-src 'self'; img-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY'
};

for (const [header, value] of Object.entries(expectedGlobalHeaders)) {
  if (policy.globalHeaders?.[header] !== value) {
    throw new Error(`${outputPath} must set ${header} to ${value}`);
  }
}

const routeHeaders = new Map(policy.routes?.map((route) => [route.route, route.headers]));
for (const route of ['/assets/*', '/evidence-ledger.webp', '/evidence-ledger-mobile.webp']) {
  if (routeHeaders.get(route)?.['Cache-Control'] !== 'public, max-age=31536000, immutable') {
    throw new Error(`${outputPath} must set immutable caching for ${route}`);
  }
}
if (routeHeaders.get('/sw.js')?.['Cache-Control'] !== 'no-cache') {
  throw new Error(`${outputPath} must set no-cache for /sw.js`);
}
if (policy.responseOverrides?.['404']?.rewrite !== '/404.html' || policy.responseOverrides?.['404']?.statusCode !== 404) {
  throw new Error(`${outputPath} must serve the branded /404.html document for missing routes`);
}

console.log('Azure Static Web Apps response policy verified.');
