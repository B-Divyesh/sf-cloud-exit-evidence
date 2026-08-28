import { describe, expect, it } from 'vitest';
import { auditDemo, parseManifest } from './demo';

describe('manifest parser', () => {
  it('reads native JSON and declared exclusions', () => {
    const manifest = parseManifest('{"files":[{"path":"Docs/a.txt","size":3}],"exclusions":[{"path":"Phone/**","reason":"permission"}]}');
    expect(manifest.files[0].path).toBe('Docs/a.txt');
    expect(manifest.exclusions).toHaveLength(1);
  });

  it('rejects traversal and duplicates', () => {
    expect(() => parseManifest('{"files":[{"path":"../secret"}]}')).toThrow(/Unsafe/);
    expect(() => parseManifest('{"files":[{"path":"a"},{"path":"a"}]}')).toThrow(/Duplicate/);
  });

  it('reads CSV', () => {
    const manifest = parseManifest('path,size,modified\n"Docs/a.txt",3,2026-01-01T00:00:00Z');
    expect(manifest.files).toEqual([{ path: 'Docs/a.txt', size: 3, modified: '2026-01-01T00:00:00Z' }]);
  });
});

describe('browser audit', () => {
  it('identifies every intentional fixture gap', () => {
    const manifest = parseManifest('{"files":[{"path":"ok.txt","size":2},{"path":"missing.txt","size":3},{"path":"wrong.txt","size":5}],"exclusions":[{"path":"Phone/**","reason":"permission"}]}');
    const report = auditDemo(manifest, [
      { path: 'ok.txt', size: 2, modified: Date.now() },
      { path: 'wrong.txt', size: 4, modified: Date.now() }
    ]);
    expect(report.readiness).toBe('not ready');
    expect(report.gaps).toBe(2);
    expect(report.exclusions).toHaveLength(1);
  });
});
