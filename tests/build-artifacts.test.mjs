import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, rmSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

test('@claim:build-artifacts production build writes the release binary and static site from no dist directory', () => {
  const root = resolve('.');
  const dist = resolve(root, 'dist');
  rmSync(dist, { recursive: true, force: true });
  assert.equal(existsSync(dist), false);
  const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const result = spawnSync(command, ['run', 'build'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  const binary = resolve(root, 'target', 'release', process.platform === 'win32' ? 'cloud-exit-evidence.exe' : 'cloud-exit-evidence');
  const siteIndex = resolve(dist, 'site', 'index.html');
  assert.equal(existsSync(binary), true, 'release executable is present');
  assert.equal(statSync(binary).isFile(), true, 'release executable is a file');
  assert.equal(existsSync(siteIndex), true, 'dist/site/index.html is present');
  assert.equal(statSync(siteIndex).isFile(), true, 'dist/site/index.html is a file');
});
