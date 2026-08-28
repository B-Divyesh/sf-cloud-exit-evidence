import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const binary = join(process.cwd(), 'target', 'release', 'cloud-exit-evidence');
const sampleHash = '3a6eb0790f39ac87c94f3856b2dd2c5d110e6811602261a9a923d3bb23adc8b7';

function runCli(args: string[], options: { cwd?: string; env?: NodeJS.ProcessEnv } = {}) {
  const result = spawnSync(binary, args, { encoding: 'utf8', cwd: options.cwd, env: options.env ?? process.env });
  expect(result.error).toBeUndefined();
  return { status: result.status, stdout: String(result.stdout ?? ''), stderr: String(result.stderr ?? '') };
}

function expectStatus(result: ReturnType<typeof runCli>, expected: number) {
  expect(result.status, `stdout:\n${result.stdout}\nstderr:\n${result.stderr}`).toBe(expected);
}

const routeExpectations = [
  { path: '/', title: 'Cloud Exit Evidence — Check an offline copy', canonical: 'https://cloud-exit-evidence.sociobot.in/' },
  { path: '/demo/', title: 'Demo — Cloud Exit Evidence', canonical: 'https://cloud-exit-evidence.sociobot.in/demo/' },
  { path: '/privacy/', title: 'Privacy — Cloud Exit Evidence', canonical: 'https://cloud-exit-evidence.sociobot.in/privacy/' },
  { path: '/terms/', title: 'Terms — Cloud Exit Evidence', canonical: 'https://cloud-exit-evidence.sociobot.in/terms/' },
  { path: '/404.html', title: 'Not found — Cloud Exit Evidence', canonical: 'https://cloud-exit-evidence.sociobot.in/404' }
];

for (const route of routeExpectations) {
  test(`${route.path} has exact metadata, shared structure, and zero accessibility violations`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    await page.goto(route.path);
    await expect(page).toHaveTitle(route.title);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('body > header, body > footer')).toHaveCount(2);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', route.canonical);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /^.{1,155}$/);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', route.title);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', route.title);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://cloud-exit-evidence.sociobot.in/social-card.webp');
    await expect(page.locator('link[rel="icon"], link[rel="apple-touch-icon"]')).toHaveCount(2);
    await expect(page.locator('footer a[href="/privacy/"]')).toHaveCount(1);
    await expect(page.locator('footer a[href="/terms/"]')).toHaveCount(1);
    const ids = await page.locator('[id]').evaluateAll((elements) => elements.map((element) => element.id));
    expect(new Set(ids).size, `${route.path} has duplicate IDs`).toBe(ids.length);
    const headingLevels = await page.locator('h1, h2, h3, h4, h5, h6').evaluateAll((headings) => headings.map((heading) => Number(heading.tagName.slice(1))));
    expect(headingLevels[0]).toBe(1);
    for (let index = 1; index < headingLevels.length; index += 1) {
      expect(headingLevels[index] - headingLevels[index - 1], `${route.path} skips a heading level`).toBeLessThanOrEqual(1);
    }
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });
}

test('landing first screen states the job, audience, sample result, privacy, offline use, and price', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Check your offline cloud copy.');
  await expect(page.getByText('For people keeping a fallback drive, find missing and outdated cloud files before relying on it.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toHaveAttribute('href', '/demo/');
  await expect(page.getByText('Shows a sample gap report right away.')).toBeVisible();
  await expect(page.locator('.plain-facts li')).toHaveText(['No uploads', 'Demo works offline after first visit', 'Free under MIT']);
});

test('reduced-motion users receive the same content without animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Check your offline cloud copy.' })).toBeVisible();
  const motion = await page.locator('.proof-mark').evaluate((element) => {
    const style = getComputedStyle(element);
    return { animation: style.animationName, transition: style.transitionDuration, transform: style.transform };
  });
  expect(motion).toEqual({ animation: 'none', transition: '0s', transform: 'none' });
});

test('@claim:demo-sample-report direct demo loads an intentional-gap report', async ({ page }) => {
  await page.goto('/demo/');
  await expect(page.getByRole('heading', { name: 'Not ready' })).toBeVisible();
  await expect(page.getByText('Photos/2026/birthday.webp')).toBeVisible();
  await expect(page.getByText('Documents/tax-return.pdf')).toBeVisible();
  await expect(page.getByText('Phone/Documents/**')).toBeVisible();
  await expect(page.getByText('Demo — sample data, nothing is saved.')).toBeVisible();
});

test('@claim:demo-first-screen mobile demo shows the full sample result before scrolling', async ({ page }) => {
  test.skip(page.viewportSize()?.width !== 390, 'This claim measures the required 390 px phone viewport.');
  await page.goto('/demo/');
  const result = page.getByRole('heading', { name: 'Not ready' });
  const report = page.locator('.demo-report-first');
  const birthday = report.getByText('Photos/2026/birthday.webp', { exact: true });
  const taxReturn = report.getByText('Documents/tax-return.pdf', { exact: true });
  const exclusion = report.getByText('Phone/Documents/**', { exact: true });
  await expect(result).toBeVisible();
  for (const item of [result, birthday, taxReturn, exclusion]) {
    const box = await item.boundingBox();
    expect(box, 'sample result item has a rendered box').not.toBeNull();
    expect(box!.y + box!.height).toBeLessThanOrEqual(844);
  }
  await page.screenshot({ path: '.factory/evidence/demo-first-screen-390.png', fullPage: false });
});

test('the documented ?demo=1 shortcut enters the isolated demo route', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page).toHaveURL(/\/demo\/$/);
  await expect(page.getByText('Demo — sample data, nothing is saved.')).toBeVisible();
});

test('@claim:demo-isolation demo entry, reset, and every exit preserve real state and discard only demo state', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('real:cloud-exit-evidence', 'keep'));
  await page.goto('/demo/');
  expect(await page.evaluate(() => ({ demo: localStorage.getItem('demo:cloud-exit-evidence'), real: localStorage.getItem('real:cloud-exit-evidence') })))
    .toEqual({ demo: 'sample', real: 'keep' });
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('heading', { name: 'Not ready' })).toBeVisible();
  expect(await page.evaluate(() => ({ demo: localStorage.getItem('demo:cloud-exit-evidence'), real: localStorage.getItem('real:cloud-exit-evidence') })))
    .toEqual({ demo: 'sample', real: 'keep' });
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/#install$/);
  const installHeading = page.getByRole('heading', { name: 'Run the full check offline.' });
  await expect(installHeading).toBeVisible();
  await expect.poll(async () => (await installHeading.boundingBox())?.y ?? Number.POSITIVE_INFINITY).toBeLessThan(844);
  expect(await page.evaluate(() => ({ demo: localStorage.getItem('demo:cloud-exit-evidence'), real: localStorage.getItem('real:cloud-exit-evidence') })))
    .toEqual({ demo: null, real: 'keep' });

  for (const exit of [
    { name: 'wordmark', selector: '.wordmark', url: /\/$/ },
    { name: 'Home', selector: 'header nav a[href="/"]', url: /\/$/ },
    { name: 'Privacy', selector: 'header nav a[href="/privacy/"]', url: /\/privacy\/$/ },
    { name: 'Terms', selector: 'footer a[href="/terms/"]', url: /\/terms\/$/ }
  ]) {
    await page.goto('/demo/');
    await expect(page.getByRole('heading', { name: 'Not ready' })).toBeVisible();
    await page.locator(exit.selector).click();
    await expect(page, `${exit.name} reaches its destination`).toHaveURL(exit.url);
    expect(await page.evaluate(() => ({ demo: localStorage.getItem('demo:cloud-exit-evidence'), real: localStorage.getItem('real:cloud-exit-evidence') })), `${exit.name} clears only demo state`)
      .toEqual({ demo: null, real: 'keep' });
  }

  await page.goto('/');
  await page.getByRole('link', { name: 'Demo', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Not ready' })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  expect(await page.evaluate(() => ({ demo: localStorage.getItem('demo:cloud-exit-evidence'), real: localStorage.getItem('real:cloud-exit-evidence') })), 'Back clears only demo state')
    .toEqual({ demo: null, real: 'keep' });
  await page.goForward();
  await expect(page.getByRole('heading', { name: 'Not ready' })).toBeVisible();
  expect(await page.evaluate(() => ({ demo: localStorage.getItem('demo:cloud-exit-evidence'), real: localStorage.getItem('real:cloud-exit-evidence') })), 'Forward starts a fresh demo')
    .toEqual({ demo: 'sample', real: 'keep' });
});

test('@claim:demo-sample-only demo exposes no real inputs, never reads injected file details, and changes only demo storage', async ({ page }) => {
  await page.addInitScript(() => {
    const target = window as Window & { __demoRealReads?: number };
    target.__demoRealReads = 0;
    const watch = (prototype: object, property: string) => {
      const descriptor = Object.getOwnPropertyDescriptor(prototype, property);
      if (!descriptor?.get) return;
      Object.defineProperty(prototype, property, {
        ...descriptor,
        get() {
          target.__demoRealReads = (target.__demoRealReads ?? 0) + 1;
          return descriptor.get!.call(this);
        }
      });
    };
    watch(HTMLInputElement.prototype, 'files');
    for (const property of ['name', 'size', 'lastModified', 'webkitRelativePath']) watch(File.prototype, property);
    localStorage.setItem('real:cloud-exit-evidence', 'private-state');
  });
  await page.goto('/demo/');
  await expect(page.locator('input, textarea, [contenteditable="true"]')).toHaveCount(0);
  await expect(page.getByText('This page uses only bundled sample details.')).toBeVisible();
  expect(readFileSync(join(process.cwd(), 'site', 'demo', 'index.html'), 'utf8')).not.toMatch(/<(?:input|textarea)\b|contenteditable/i);
  expect(readFileSync(join(process.cwd(), 'site', 'src', 'main.ts'), 'utf8')).not.toMatch(/FileList|filesFromInput|directoryInput|manifestInput/);

  await page.evaluate(() => {
    const legacyForm = document.createElement('form');
    legacyForm.id = 'audit-form';
    const legacyList = document.createElement('textarea');
    legacyList.id = 'manifest';
    legacyList.value = '{"files":[{"path":"private-tax.pdf","size":7}]}';
    const legacyFolder = document.createElement('input');
    legacyFolder.id = 'directory';
    legacyFolder.type = 'file';
    const transfer = new DataTransfer();
    transfer.items.add(new File(['private'], 'private-tax.pdf', { lastModified: 1 }));
    legacyFolder.files = transfer.files;
    legacyForm.append(legacyList, legacyFolder);
    document.body.append(legacyForm);
    legacyFolder.dispatchEvent(new Event('change', { bubbles: true }));
    legacyForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
  await page.waitForTimeout(150);
  expect(await page.evaluate(() => (window as Window & { __demoRealReads?: number }).__demoRealReads)).toBe(0);
  await expect(page.locator('#report')).not.toContainText('private-tax.pdf');
  expect(await page.evaluate(() => Object.fromEntries(Object.entries(localStorage)))).toEqual({
    'demo:cloud-exit-evidence': 'sample',
    'real:cloud-exit-evidence': 'private-state'
  });

  await page.getByRole('button', { name: 'Reset demo' }).click();
  expect(await page.evaluate(() => Object.fromEntries(Object.entries(localStorage)))).toEqual({
    'demo:cloud-exit-evidence': 'sample',
    'real:cloud-exit-evidence': 'private-state'
  });
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/#install$/);
  expect(await page.evaluate(() => Object.fromEntries(Object.entries(localStorage)))).toEqual({
    'real:cloud-exit-evidence': 'private-state'
  });
});

test('@claim:free-to-use the site and command-line tool are free under MIT without a purchase path', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Free under MIT')).toBeVisible();
  await page.goto('/terms/');
  await expect(page.getByText('The software and website are free under the MIT License.')).toBeVisible();
  expect(readFileSync(join(process.cwd(), 'LICENSE'), 'utf8')).toMatch(/Permission is hereby granted/);
  const source = ['site/index.html', 'site/demo/index.html', 'site/privacy/index.html', 'site/terms/index.html', 'site/404.html']
    .map((path) => readFileSync(join(process.cwd(), path), 'utf8')).join('\n');
  expect(source).not.toMatch(/(?:checkout|purchase|paywall|billing|subscribe)/i);
});

test('@claim:browser-local browser demo does not upload data or call third parties', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo/');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('heading', { name: 'Not ready' })).toBeVisible();
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
});

test('@claim:no-account the website offers the demo without an account or sign-in form', async ({ page }) => {
  await page.goto('/demo/');
  expect(await page.locator('input[type="password"], input[autocomplete="username"], form[action*="login" i]').count()).toBe(0);
  await expect(page.getByRole('heading', { name: 'Not ready' })).toBeVisible();
});

test('@claim:offline-reload a landing-page visit makes the demo work offline', async ({ page, context }) => {
  await page.goto('/');
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await page.waitForFunction(async () => {
    const cache = await caches.open('cee-shell-v2');
    const paths = (await cache.keys()).map((request) => new URL(request.url).pathname);
    return paths.includes('/demo/') && paths.some((path) => path.startsWith('/assets/main-'));
  });
  await context.setOffline(true);
  await page.goto('/demo/');
  await expect(page.getByText('Demo — sample data, nothing is saved.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Not ready' })).toBeVisible();
  if (page.viewportSize()?.width === 390) {
    await page.screenshot({ path: '.factory/evidence/offline-demo-from-landing-390.png', fullPage: false });
  }
  await context.setOffline(false);
});

test('sample-only demo exposes no editable file workflow or legacy error terms', async ({ page }) => {
  await page.goto('/demo/');
  await expect(page.locator('#audit-form, #manifest, #directory, #form-error')).toHaveCount(0);
  await expect(page.locator('main')).not.toContainText(/manifest|fixture|destination folder|run the audit/i);
  await expect(page.getByRole('link', { name: 'Start for real' })).toHaveAttribute('href', '/#install');
});

test('landing shows the sample product before method and limitations sections', async ({ page }) => {
  await page.goto('/');
  const sections = await page.locator('main > section').evaluateAll((nodes) => nodes.map((node) => node.className));
  expect(sections).toEqual(['masthead', 'demo-preview section-rule', 'method section-rule', 'limitations section-rule', 'install section-rule']);
  await expect(page.getByRole('heading', { name: 'What this check does not do.' })).toBeVisible();
  await expect(page.getByText('It does not copy or restore files.')).toBeVisible();
});

test('@claim:routing-focus forward and back route navigation focus and quietly announce the page heading', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Demo', exact: true }).click();
  await expect(page).toHaveURL(/\/demo\/$/);
  await expect(page.getByRole('heading', { name: 'Check a sample offline copy.' })).toBeFocused();
  const announcement = page.locator('.route-announcement');
  await expect(announcement).toHaveText('Demo — Cloud Exit Evidence');
  await expect(announcement).toHaveClass(/sr-only/);
  const announcementBox = await announcement.boundingBox();
  expect(announcementBox?.width).toBeLessThanOrEqual(1);
  expect(announcementBox?.height).toBeLessThanOrEqual(1);
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Check your offline cloud copy.' })).toBeFocused();
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo\/$/);
  await expect(page.getByRole('heading', { name: 'Check a sample offline copy.' })).toBeFocused();
});

test('keyboard reaches the skip link and every first-screen action at mobile width', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.getByRole('link', { name: 'Skip to main content' }).press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
});

test('mobile interactive targets are at least 44 by 44 pixels', async ({ page }) => {
  test.skip(page.viewportSize()?.width !== 390, 'This check measures the required 390 px phone viewport.');
  for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/404.html']) {
    await page.goto(path);
    const boxes = await page.locator('a:visible, button:visible').evaluateAll((elements) => elements.map((element) => {
      const box = element.getBoundingClientRect();
      return { name: element.getAttribute('aria-label') || element.textContent?.trim() || element.tagName, width: box.width, height: box.height };
    }));
    expect(boxes.length).toBeGreaterThan(0);
    for (const box of boxes) {
      expect(box.width, `${path}: ${box.name} is too narrow`).toBeGreaterThanOrEqual(44);
      expect(box.height, `${path}: ${box.name} is too short`).toBeGreaterThanOrEqual(44);
    }
  }
});

test('mobile header links fit without clipping or horizontal scrolling', async ({ page }) => {
  test.skip(page.viewportSize()?.width !== 390, 'This check measures the required 390 px phone viewport.');
  for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/404.html']) {
    await page.goto(path);
    const header = await page.locator('.site-header').evaluate((element) => {
      const links = [...element.querySelectorAll('a')].map((link) => {
        const box = link.getBoundingClientRect();
        return { name: link.textContent?.trim(), left: box.left, right: box.right };
      });
      return { links, viewportWidth: window.innerWidth };
    });
    for (const link of header.links) {
      expect(link.left, `${path}: ${link.name} starts outside the viewport`).toBeGreaterThanOrEqual(0);
      expect(link.right, `${path}: ${link.name} ends outside the viewport`).toBeLessThanOrEqual(header.viewportWidth);
    }
  }
});

test('@claim:cli-demo CLI demo seeds the bundled sample in a temporary folder and matches its landing recording', async ({ page }) => {
  const result = runCli(['demo']);
  expectStatus(result, 0);
  expect(result.stdout).toContain('NOT READY');
  expect(result.stdout).toContain('Photos/2026/birthday.webp');
  expect(result.stdout).toContain('Documents/tax-return.pdf');
  expect(result.stdout).toContain('Phone/Documents/**');
  const directory = result.stderr.match(/Demo files written to (.+)/)?.[1].trim();
  expect(directory).toBeTruthy();
  try {
    expect(existsSync(directory!)).toBe(true);
    expect(readdirSync(directory!).sort()).toEqual(['offline-copy', 'sample-manifest.json']);
    expect(readFileSync(join(directory!, 'sample-manifest.json'), 'utf8')).toContain('Photos/2026/birthday.webp');
    expect(readFileSync(join(directory!, 'offline-copy', 'Documents', 'lease.pdf'), 'utf8')).toBe('sample lease evidence\n');
  } finally {
    if (directory) rmSync(directory, { recursive: true, force: true });
  }
  expect(readFileSync(join(process.cwd(), 'examples', 'intentional-gaps', 'README.md'), 'utf8')).toContain('missing photo and tax return');
  await page.goto('/');
  await expect(page.locator('.terminal-recording')).toContainText('Photos/2026/birthday.webp');
  await expect(page.locator('.terminal-recording')).toContainText('Documents/tax-return.pdf');
  await expect(page.locator('.terminal-recording')).toContainText('Phone/Documents/**');
});

test('@claim:cli-no-network command-line runs use no network client and leave no usage data in an empty working directory', () => {
  const source = readdirSync(join(process.cwd(), 'crates', 'cloud-exit-evidence', 'src'))
    .map((name) => readFileSync(join(process.cwd(), 'crates', 'cloud-exit-evidence', 'src', name), 'utf8')).join('\n');
  const dependencies = readFileSync(join(process.cwd(), 'crates', 'cloud-exit-evidence', 'Cargo.toml'), 'utf8');
  expect(source).not.toMatch(/std::net|TcpStream|UdpSocket|reqwest|ureq|https?:\/\//i);
  expect(dependencies).not.toMatch(/reqwest|ureq|hyper|curl|tokio/i);
  const directory = mkdtempSync(join(tmpdir(), 'cee-no-network-'));
  try {
    const workspace = join(directory, 'empty-working-directory');
    const destination = join(directory, 'offline');
    const manifest = join(directory, 'manifest.json');
    mkdirSync(workspace); mkdirSync(destination);
    writeFileSync(join(destination, 'present.txt'), 'data');
    writeFileSync(manifest, '{"files":[{"path":"present.txt","size":4}]}');
    expectStatus(runCli(['audit', '--manifest', manifest, '--destination', destination, '--format', 'json'], { cwd: workspace }), 0);
    expect(readdirSync(workspace)).toEqual([]);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test('@claim:cli-no-account command-line help, demo, and checks run with no account or sign-in', () => {
  const directory = mkdtempSync(join(tmpdir(), 'cee-noauth-'));
  try {
    const destination = join(directory, 'offline');
    const fileList = join(directory, 'files.json');
    mkdirSync(destination);
    writeFileSync(join(destination, 'present.txt'), 'data');
    writeFileSync(fileList, '{"files":[{"path":"present.txt","size":4}]}');
    const environment = { PATH: process.env.PATH, LANG: 'C' };
    const help = runCli(['--help'], { cwd: directory, env: environment });
    const demo = runCli(['demo'], { cwd: directory, env: environment });
    const check = runCli(['audit', '--manifest', fileList, '--destination', destination], { cwd: directory, env: environment });
    expectStatus(help, 0);
    expectStatus(demo, 0);
    expectStatus(check, 0);
    const output = `${help.stdout}${help.stderr}${demo.stdout}${demo.stderr}${check.stdout}${check.stderr}`;
    expect(output).not.toMatch(/sign[ -]?in|login|authentication required|enter (?:an )?account|password prompt/i);
    const sampleDirectory = demo.stderr.match(/Demo files written to (.+)/)?.[1].trim();
    if (sampleDirectory) rmSync(sampleDirectory, { recursive: true, force: true });
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test('@claim:cli-read-only normal CLI checks leave the manifest and selected folder unchanged', () => {
  const directory = mkdtempSync(join(tmpdir(), 'cee-read-only-'));
  try {
    const manifest = join(directory, 'manifest.json');
    const destination = join(directory, 'offline');
    mkdirSync(destination);
    writeFileSync(join(destination, 'present.txt'), 'data');
    writeFileSync(manifest, '{"files":[{"path":"present.txt","size":4}]}');
    const before = createHash('sha256').update(readFileSync(manifest)).update(readFileSync(join(destination, 'present.txt'))).digest('hex');
    expectStatus(runCli(['audit', '--manifest', manifest, '--destination', destination, '--format', 'json']), 0);
    const after = createHash('sha256').update(readFileSync(manifest)).update(readFileSync(join(destination, 'present.txt'))).digest('hex');
    expect(after).toBe(before);
    expect(readdirSync(directory).sort()).toEqual(['manifest.json', 'offline']);
    expect(readdirSync(destination)).toEqual(['present.txt']);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test('@claim:cli-formats-readiness command-line checks read full JSON, CSV, and rclone file lists and report every documented gap', () => {
  const directory = mkdtempSync(join(tmpdir(), 'cee-formats-'));
  try {
    const destination = join(directory, 'offline');
    mkdirSync(destination);
    writeFileSync(join(destination, 'present.txt'), 'data');
    const native = join(directory, 'native.json');
    const csv = join(directory, 'files.csv');
    const rclone = join(directory, 'rclone.json');
    writeFileSync(native, `{"files":[{"path":"present.txt","size":4,"modified":"2020-01-01T00:00:00Z","sha256":"${sampleHash}"}]}`);
    writeFileSync(csv, `path,size,modified,sha256,excluded,exclusion_reason\npresent.txt,4,2020-01-01T00:00:00Z,${sampleHash},false,\nPhone/Documents/**,,,,true,permission denied\n`);
    writeFileSync(rclone, `[{"Path":"present.txt","Size":4,"ModTime":"2020-01-01T00:00:00Z","Hashes":{"SHA-256":"${sampleHash}"},"IsDir":false},{"Path":"ignored","IsDir":true}]`);
    const nativeReport = runCli(['audit', '--manifest', native, '--destination', destination, '--format', 'json']);
    expectStatus(nativeReport, 0);
    expect(JSON.parse(nativeReport.stdout).files[0].state).toBe('verified');
    const csvReport = runCli(['audit', '--manifest', csv, '--destination', destination, '--format', 'json']);
    expectStatus(csvReport, 2);
    const parsedCsv = JSON.parse(csvReport.stdout);
    expect(parsedCsv.files[0].state).toBe('verified');
    expect(parsedCsv.exclusions).toMatchObject([{ path: 'Phone/Documents/**', reason: 'permission denied', acknowledged: false }]);
    const rcloneReport = runCli(['audit', '--manifest', rclone, '--destination', destination, '--format', 'json']);
    expectStatus(rcloneReport, 0);
    expect(JSON.parse(rcloneReport.stdout).files).toHaveLength(1);
    expect(JSON.parse(rcloneReport.stdout).files[0].state).toBe('verified');
    for (const [name, contents, summary] of [
      ['missing.json', '{"files":[{"path":"missing.txt","size":1}]}', 'missing'],
      ['stale.json', '{"files":[{"path":"present.txt","size":4,"modified":"2099-01-01T00:00:00Z"}]}', 'stale'],
      ['size.json', '{"files":[{"path":"present.txt","size":5}]}', 'size_mismatch'],
      ['hash.json', '{"files":[{"path":"present.txt","size":4,"sha256":"0000000000000000000000000000000000000000000000000000000000000000"}]}', 'hash_mismatch']
    ]) {
      const manifest = join(directory, name);
      writeFileSync(manifest, contents);
      const result = runCli(['audit', '--manifest', manifest, '--destination', destination, '--format', 'json']);
      expectStatus(result, 2);
      expect(JSON.parse(result.stdout).summary[summary]).toBe(1);
    }
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test('@claim:duplicate-paths command-line checks reject duplicate JSON, CSV, and rclone file-list paths', () => {
  const directory = mkdtempSync(join(tmpdir(), 'cee-duplicates-'));
  try {
    const destination = join(directory, 'offline'); mkdirSync(destination);
    const cases = [
      ['native.json', '{"files":[{"path":"same.txt"},{"path":"same.txt"}]}'],
      ['files.csv', 'path,size\nsame.txt,1\nsame.txt,1\n'],
      ['rclone.json', '[{"Path":"same.txt","Size":1},{"Path":"same.txt","Size":1}]']
    ];
    for (const [name, contents] of cases) {
      const manifest = join(directory, name);
      writeFileSync(manifest, contents);
      const result = runCli(['audit', '--manifest', manifest, '--destination', destination]);
      expectStatus(result, 3);
      expect(result.stderr).toContain('duplicate path: same.txt');
    }
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test('@claim:cli-acknowledgement acknowledged checked exclusions produce a recorded ready-with-exceptions report', () => {
  const directory = mkdtempSync(join(tmpdir(), 'cee-acknowledgement-'));
  try {
    const manifest = join(directory, 'manifest.json'); const destination = join(directory, 'offline');
    mkdirSync(destination); writeFileSync(join(destination, 'present.txt'), 'data');
    writeFileSync(manifest, '{"files":[{"path":"present.txt","size":4}],"exclusions":[{"path":"Phone/Documents/**","reason":"permission denied"}]}');
    const result = runCli(['audit', '--manifest', manifest, '--destination', destination, '--format', 'json', '--acknowledge', 'Phone/Documents/**', '--acknowledgement-note', 'checked separate export']);
    expectStatus(result, 0);
    expect(JSON.parse(result.stdout)).toMatchObject({ readiness: 'ready_with_exceptions', exclusions: [{ path: 'Phone/Documents/**', reason: 'permission denied', acknowledged: true, acknowledgement_note: 'checked separate export' }] });
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test('@claim:cli-exit-codes passing, gap, and invalid checks exit with 0, 2, and 3', () => {
  const directory = mkdtempSync(join(tmpdir(), 'cee-exit-codes-'));
  try {
    const destination = join(directory, 'offline'); mkdirSync(destination); writeFileSync(join(destination, 'present.txt'), 'data');
    const ready = join(directory, 'ready.json'); const gap = join(directory, 'gap.json'); const invalid = join(directory, 'invalid.json');
    writeFileSync(ready, '{"files":[{"path":"present.txt","size":4}]}');
    writeFileSync(gap, '{"files":[{"path":"missing.txt","size":1}]}');
    writeFileSync(invalid, '{not valid json');
    expectStatus(runCli(['audit', '--manifest', ready, '--destination', destination]), 0);
    expectStatus(runCli(['audit', '--manifest', gap, '--destination', destination]), 2);
    expectStatus(runCli(['audit', '--manifest', invalid, '--destination', destination]), 3);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test('@claim:cli-redaction command-line checks redact two distinct file paths with stable labels', () => {
  const directory = mkdtempSync(join(tmpdir(), 'cee-redaction-'));
  try {
    const manifest = join(directory, 'manifest.json');
    const destination = join(directory, 'offline');
    mkdirSync(destination);
    writeFileSync(manifest, '{"files":[{"path":"private/tax-return.pdf","size":1},{"path":"private/medical-note.pdf","size":1}]}');
    const first = runCli(['audit', '--manifest', manifest, '--destination', destination, '--redact-paths']);
    const second = runCli(['audit', '--manifest', manifest, '--destination', destination, '--redact-paths']);
    expectStatus(first, 2); expectStatus(second, 2);
    for (const output of [first.stdout, second.stdout]) {
      expect(output).not.toContain('private/tax-return.pdf');
      expect(output).not.toContain('private/medical-note.pdf');
    }
    const labels = (output: string) => [...new Set(output.match(/path:[0-9a-f]{12}/g) ?? [])].sort();
    expect(labels(first.stdout)).toHaveLength(2);
    expect(labels(second.stdout)).toEqual(labels(first.stdout));
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test('@claim:cli-fail-on documented exceptions and never modes return their documented exit codes', () => {
  const directory = mkdtempSync(join(tmpdir(), 'cee-fail-on-'));
  try {
    const destination = join(directory, 'offline'); mkdirSync(destination); writeFileSync(join(destination, 'present.txt'), 'data');
    const exclusions = join(directory, 'exclusions.json'); const gap = join(directory, 'gap.json');
    writeFileSync(exclusions, '{"files":[{"path":"present.txt","size":4}],"exclusions":[{"path":"Phone/Documents/**","reason":"permission denied"}]}');
    writeFileSync(gap, '{"files":[{"path":"missing.txt","size":1}]}');
    const exceptions = runCli(['audit', '--manifest', exclusions, '--destination', destination, '--acknowledge', 'Phone/Documents/**', '--fail-on', 'exceptions']);
    expectStatus(exceptions, 2);
    expect(exceptions.stdout).toContain('READY WITH EXCEPTIONS');
    const never = runCli(['audit', '--manifest', gap, '--destination', destination, '--fail-on', 'never']);
    expectStatus(never, 0);
    expect(never.stdout).toContain('NOT READY');
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test('@claim:cli-validation-and-links command-line checks reject escaping paths and report links as unsafe without following them', () => {
  const directory = mkdtempSync(join(tmpdir(), 'cee-validation-'));
  try {
    const destination = join(directory, 'offline'); mkdirSync(destination);
    const unsafeManifest = join(directory, 'unsafe.json');
    writeFileSync(unsafeManifest, '{"files":[{"path":"../outside.txt"}]}');
    const unsafe = runCli(['audit', '--manifest', unsafeManifest, '--destination', destination]);
    expectStatus(unsafe, 3);
    expect(unsafe.stderr).toContain('path escapes the destination');
    writeFileSync(join(directory, 'outside.txt'), 'data');
    symlinkSync(join(directory, 'outside.txt'), join(destination, 'linked.txt'));
    const linkManifest = join(directory, 'link.json');
    writeFileSync(linkManifest, '{"files":[{"path":"linked.txt","size":4}]}');
    const link = runCli(['audit', '--manifest', linkManifest, '--destination', destination, '--format', 'json']);
    expectStatus(link, 2);
    const report = JSON.parse(link.stdout);
    expect(report.files).toMatchObject([{ path: 'linked.txt', state: 'unsafe', detail: 'path crosses a symlink' }]);
    expect(report.unsafe_links).toContain('linked.txt');
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test('@claim:encrypted-report saved reports are encrypted, terminal output is plain, and only the supplied passphrase decrypts', () => {
  const directory = mkdtempSync(join(tmpdir(), 'cee-encryption-'));
  try {
    const manifest = join(directory, 'manifest.json'); const destination = join(directory, 'offline'); const report = join(directory, 'report.cee');
    mkdirSync(destination); writeFileSync(join(destination, 'present.txt'), 'data'); writeFileSync(manifest, '{"files":[{"path":"present.txt","size":4}]}');
    const environment = { ...process.env, CEE_PASSPHRASE: 'integration-secret' };
    const saved = runCli(['audit', '--manifest', manifest, '--destination', destination, '--format', 'json', '--output', report], { env: environment });
    expectStatus(saved, 0);
    expect(readFileSync(report).subarray(0, 4).toString()).toBe('CEE1');
    expect(readFileSync(report).toString()).not.toContain('present.txt');
    const decrypted = runCli(['decrypt', '--input', report], { env: environment });
    expectStatus(decrypted, 0);
    expect(decrypted.stdout).toContain('present.txt');
    expectStatus(runCli(['decrypt', '--input', report], { env: { ...process.env, CEE_PASSPHRASE: 'wrong-passphrase' } }), 3);
    const plainManifest = join(directory, 'plain-terminal.json');
    writeFileSync(plainManifest, '{"files":[{"path":"private/present.txt","size":4}]}');
    const terminal = runCli(['audit', '--manifest', plainManifest, '--destination', destination]);
    expectStatus(terminal, 2);
    expect(terminal.stdout).toContain('private/present.txt');
    expect(terminal.stdout).not.toContain('CEE1');
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test('@claim:site-no-third-party-runtime every site route requests only its own origin', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/404.html']) {
    await page.goto(path);
    await expect(page.locator('main')).toBeVisible();
  }
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
  const source = ['site/index.html', 'site/demo/index.html', 'site/privacy/index.html', 'site/terms/index.html', 'site/404.html']
    .map((path) => readFileSync(join(process.cwd(), path), 'utf8')).join('\n');
  expect(source).not.toMatch(/<script[^>]+https?:\/\//i);
  expect(source).not.toMatch(/<(?:link|script)[^>]+(?:google-analytics|googletagmanager|doubleclick|fonts\.googleapis|use\.typekit)/i);
});

test('@claim:terms-effective-date terms show the tested effective date', async ({ page }) => {
  await page.goto('/terms/');
  await expect(page.locator('[data-effective-date="2026-08-28"]')).toHaveText('These terms were last updated on 28 August 2026.');
  expect(readFileSync(join(process.cwd(), 'site', 'terms', 'index.html'), 'utf8')).toContain('data-effective-date="2026-08-28"');
});

test('@claim:mit-license repository ships the MIT license text', () => {
  expect(readFileSync(join(process.cwd(), 'LICENSE'), 'utf8')).toMatch(/Permission is hereby granted/);
});
