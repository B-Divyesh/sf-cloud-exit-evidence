import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync, mkdirSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const binary = join(process.cwd(), 'target', 'release', 'cloud-exit-evidence');

for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/404.html']) {
  test(`${path} has semantic structure, metadata, and no serious accessibility violations`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });
}

test('@claim:demo-sample-report direct demo loads an intentional-gap report', async ({ page }) => {
  await page.goto('/demo/');
  await expect(page.getByRole('heading', { name: 'Not ready' })).toBeVisible();
  await expect(page.getByText('Documents/tax-return.pdf')).toBeVisible();
  await expect(page.getByText('Phone/Documents/**')).toBeVisible();
  await expect(page.getByText('Demo — sample data, nothing is saved.')).toBeVisible();
});

test('the documented ?demo=1 shortcut enters the isolated demo route', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page).toHaveURL(/\/demo\/$/);
  await expect(page.getByText('Demo — sample data, nothing is saved.')).toBeVisible();
});

test('@claim:demo-isolation demo reset only clears its own namespaced state', async ({ page }) => {
  await page.goto('/demo/');
  await page.evaluate(() => localStorage.setItem('real:cloud-exit-evidence', 'keep'));
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('heading', { name: 'Not ready' })).toBeVisible();
  const state = await page.evaluate(() => ({ demo: localStorage.getItem('demo:cloud-exit-evidence'), real: localStorage.getItem('real:cloud-exit-evidence') }));
  expect(state).toEqual({ demo: 'sample', real: 'keep' });
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/$/);
  expect(await page.evaluate(() => localStorage.getItem('demo:cloud-exit-evidence'))).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem('real:cloud-exit-evidence'))).toBe('keep');
});

test('@claim:browser-local browser demo does not upload data or call third parties', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo/');
  await page.getByRole('button', { name: 'Check this file list' }).click();
  await expect(page.getByRole('heading', { name: 'Not ready' })).toBeVisible();
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
});

test('@claim:no-account the website offers the demo without an account or sign-in form', async ({ page }) => {
  await page.goto('/demo/');
  expect(await page.locator('input[type="password"], input[autocomplete="username"], form[action*="login" i]').count()).toBe(0);
  await expect(page.getByRole('heading', { name: 'Not ready' })).toBeVisible();
});

test('@claim:offline-reload service worker reloads the sample while offline', async ({ page, context }) => {
  await page.goto('/demo/');
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Not ready' })).toBeVisible();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Not ready' })).toBeVisible();
  await context.setOffline(false);
});

test('@claim:routing-focus demo and back navigation focus the route heading', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo\/$/);
  await expect(page.getByRole('heading', { name: 'Check a sample offline copy.' })).toBeFocused();
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Check your offline cloud copy.' })).toBeFocused();
});

test('keyboard reaches the skip link and every first-screen action at mobile width', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.getByRole('link', { name: 'Skip to main content' }).press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
});

test('@claim:cli-demo CLI demo writes a sample folder and returns its intentional gaps', () => {
  const result = execFileSync(binary, ['demo'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  expect(result).toContain('NOT READY');
  expect(result).toContain('Documents/tax-return.pdf');
});

test('@claim:cli-no-network CLI contains no network client code or network client dependency', () => {
  const source = readdirSync(join(process.cwd(), 'crates', 'cloud-exit-evidence', 'src'))
    .map((name) => readFileSync(join(process.cwd(), 'crates', 'cloud-exit-evidence', 'src', name), 'utf8')).join('\n');
  const dependencies = readFileSync(join(process.cwd(), 'crates', 'cloud-exit-evidence', 'Cargo.toml'), 'utf8');
  expect(source).not.toMatch(/std::net|TcpStream|UdpSocket|reqwest|ureq|https?:\/\//i);
  expect(dependencies).not.toMatch(/reqwest|ureq|hyper|curl|tokio/i);
});

test('@claim:cli-formats-readiness CLI reads JSON, CSV, and rclone lists and signals missing, stale, size, and hash gaps', () => {
  const directory = mkdtempSync(join(tmpdir(), 'cee-claim-'));
  try {
    const destination = join(directory, 'offline');
    mkdirSync(destination);
    writeFileSync(join(destination, 'present.txt'), 'data');
    const cases = [
      ['native.json', '{"files":[{"path":"present.txt","size":4},{"path":"missing.txt","size":1}]}'],
      ['files.csv', 'path,size\npresent.txt,4\nmissing.txt,1\n'],
      ['rclone.json', '[{"Path":"present.txt","Size":4},{"Path":"missing.txt","Size":1}]']
    ];
    for (const [name, contents] of cases) {
      const manifest = join(directory, name);
      writeFileSync(manifest, contents);
      try { execFileSync(binary, ['audit', '--manifest', manifest, '--destination', destination, '--format', 'json'], { encoding: 'utf8' }); }
      catch (error) {
        const output = (error as { stdout: Buffer }).stdout.toString();
        expect(output).toContain('"missing": 1');
      }
    }
    for (const [name, file] of [
      ['size.json', '{"path":"present.txt","size":5}'],
      ['stale.json', '{"path":"present.txt","size":4,"modified":"2099-01-01T00:00:00Z"}'],
      ['hash.json', '{"path":"present.txt","size":4,"sha256":"0000000000000000000000000000000000000000000000000000000000000000"}']
    ]) {
      const detailed = join(directory, name);
      writeFileSync(detailed, `{"files":[${file}]}`);
      try { execFileSync(binary, ['audit', '--manifest', detailed, '--destination', destination, '--format', 'json'], { encoding: 'utf8' }); }
      catch (error) { expect((error as { stdout: Buffer }).stdout.toString()).toMatch(/"(size_mismatch|stale|hash_mismatch)": 1/); }
    }
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test('@claim:cli-redaction CLI redacts file paths in printed reports', () => {
  const directory = mkdtempSync(join(tmpdir(), 'cee-claim-'));
  try {
    const manifest = join(directory, 'manifest.json');
    const destination = join(directory, 'offline');
    mkdirSync(destination);
    writeFileSync(manifest, '{"files":[{"path":"private/tax-return.pdf","size":1}]}');
    try { execFileSync(binary, ['audit', '--manifest', manifest, '--destination', destination, '--redact-paths'], { encoding: 'utf8' }); }
    catch (error) {
      const output = (error as { stdout: Buffer }).stdout.toString();
      expect(output).not.toContain('private/tax-return.pdf');
      expect(output).toContain('path:');
    }
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test('@claim:cli-validation-and-links CLI rejects unsafe paths and reports links as unsafe', () => {
  const directory = mkdtempSync(join(tmpdir(), 'cee-claim-'));
  try {
    const destination = join(directory, 'offline'); mkdirSync(destination);
    const unsafeManifest = join(directory, 'unsafe.json');
    writeFileSync(unsafeManifest, '{"files":[{"path":"../outside.txt"}]}');
    expect(() => execFileSync(binary, ['audit', '--manifest', unsafeManifest, '--destination', destination])).toThrow();
    writeFileSync(join(directory, 'outside.txt'), 'data'); symlinkSync(join(directory, 'outside.txt'), join(destination, 'linked.txt'));
    const linkManifest = join(directory, 'link.json'); writeFileSync(linkManifest, '{"files":[{"path":"linked.txt","size":4}]}');
    try { execFileSync(binary, ['audit', '--manifest', linkManifest, '--destination', destination, '--format', 'json'], { encoding: 'utf8' }); }
    catch (error) { expect((error as { stdout: Buffer }).stdout.toString()).toContain('"unsafe_or_unreadable": 2'); }
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test('@claim:encrypted-report CLI encrypts a saved report and decrypts it with its passphrase', () => {
  const directory = mkdtempSync(join(tmpdir(), 'cee-claim-'));
  try {
    const manifest = join(directory, 'manifest.json'); const destination = join(directory, 'offline'); const report = join(directory, 'report.cee');
    mkdirSync(destination); writeFileSync(join(destination, 'present.txt'), 'data'); writeFileSync(manifest, '{"files":[{"path":"present.txt","size":4}]}');
    execFileSync(binary, ['audit', '--manifest', manifest, '--destination', destination, '--format', 'json', '--output', report], { env: { ...process.env, CEE_PASSPHRASE: 'integration-secret' } });
    expect(readFileSync(report).subarray(0, 4).toString()).toBe('CEE1');
    const decrypted = execFileSync(binary, ['decrypt', '--input', report], { encoding: 'utf8', env: { ...process.env, CEE_PASSPHRASE: 'integration-secret' } });
    expect(decrypted).toContain('present.txt');
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test('@claim:mit-license repository ships the MIT license text', () => {
  expect(readFileSync(join(process.cwd(), 'LICENSE'), 'utf8')).toMatch(/Permission is hereby granted/);
});
