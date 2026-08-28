export interface ManifestFile {
  path: string;
  size?: number;
  modified?: string;
}

export interface ManifestExclusion {
  path: string;
  reason: string;
}

export interface LocalEntry {
  path: string;
  size: number;
  modified: number;
}

export interface DemoFinding {
  path: string;
  state: 'present' | 'missing' | 'stale' | 'size mismatch';
  detail: string;
}

export interface DemoReport {
  readiness: 'not ready' | 'ready';
  expected: number;
  present: number;
  gaps: number;
  findings: DemoFinding[];
  exclusions: ManifestExclusion[];
}

export interface ParsedManifest {
  files: ManifestFile[];
  exclusions: ManifestExclusion[];
}

function cleanPath(path: string): string {
  const normalized = path.replaceAll('\\', '/').replace(/^\.\//, '');
  if (!normalized || normalized.startsWith('/') || normalized.split('/').includes('..')) {
    throw new Error(`Unsafe file-list path: ${path || '(empty)'}`);
  }
  return normalized;
}

export function parseManifest(source: string): ParsedManifest {
  const trimmed = source.trim();
  if (!trimmed) throw new Error('Add a file list before checking.');
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    let value: unknown;
    try {
      value = JSON.parse(trimmed);
    } catch {
      throw new Error('This file list is not valid JSON. Check its commas and quotation marks.');
    }
    const root = value as Record<string, unknown>;
    const rawFiles = Array.isArray(value) ? value : root.files;
    if (!Array.isArray(rawFiles)) throw new Error('JSON must contain a file list.');
    const files = rawFiles
      .filter((row) => !(row as Record<string, unknown>).IsDir)
      .map((row) => {
        const item = row as Record<string, unknown>;
        const path = item.path ?? item.Path;
        if (typeof path !== 'string') throw new Error('Every file needs a path.');
        const size = item.size ?? item.Size;
        const modified = item.modified ?? item.ModTime;
        return {
          path: cleanPath(path),
          size: typeof size === 'number' ? size : undefined,
          modified: typeof modified === 'string' ? modified : undefined
        };
      });
    const exclusions = Array.isArray(root.exclusions)
      ? root.exclusions.map((row) => {
          const item = row as Record<string, unknown>;
          if (typeof item.path !== 'string' || typeof item.reason !== 'string') {
            throw new Error('Every exclusion needs a path and reason.');
          }
          return { path: cleanPath(item.path.replace('/**', '/placeholder')).replace('/placeholder', '/**'), reason: item.reason };
        })
      : [];
    return validateUnique({ files, exclusions });
  }
  const rows = trimmed.split(/\r?\n/).map(parseCsvRow);
  const headers = rows.shift()?.map((value) => value.toLowerCase()) ?? [];
  const pathIndex = headers.indexOf('path');
  if (pathIndex < 0) throw new Error('The CSV file list needs a path header.');
  const sizeIndex = headers.indexOf('size');
  const modifiedIndex = headers.indexOf('modified');
  const excludedIndex = headers.indexOf('excluded');
  const reasonIndex = headers.indexOf('exclusion_reason');
  const files: ManifestFile[] = [];
  const exclusions: ManifestExclusion[] = [];
  rows.forEach((row) => {
    const path = cleanPath(row[pathIndex] ?? '');
    if (excludedIndex >= 0 && row[excludedIndex]?.toLowerCase() === 'true') {
      exclusions.push({ path, reason: row[reasonIndex] || 'listed in the file list' });
    } else {
      const rawSize = row[sizeIndex];
      files.push({ path, size: rawSize ? Number(rawSize) : undefined, modified: row[modifiedIndex] || undefined });
    }
  });
  return validateUnique({ files, exclusions });
}

function validateUnique(manifest: ParsedManifest): ParsedManifest {
  if (!manifest.files.length && !manifest.exclusions.length) throw new Error('The file list contains no files or exclusions.');
  const paths = new Set<string>();
  for (const file of manifest.files) {
    if (paths.has(file.path)) throw new Error(`Duplicate file-list path: ${file.path}`);
    paths.add(file.path);
  }
  return manifest;
}

function parseCsvRow(line: string): string[] {
  const values: string[] = [];
  let value = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"' && line[index + 1] === '"' && quoted) {
      value += '"';
      index += 1;
    } else if (character === '"') quoted = !quoted;
    else if (character === ',' && !quoted) {
      values.push(value.trim());
      value = '';
    } else value += character;
  }
  values.push(value.trim());
  return values;
}

export function auditDemo(manifest: ParsedManifest, localEntries: LocalEntry[]): DemoReport {
  const local = new Map(localEntries.map((entry) => [cleanPath(entry.path), entry]));
  const findings = manifest.files.map<DemoFinding>((expected) => {
    const actual = local.get(expected.path);
    if (!actual) return { path: expected.path, state: 'missing', detail: 'Not found in the selected copy' };
    if (expected.size !== undefined && expected.size !== actual.size) {
      return { path: expected.path, state: 'size mismatch', detail: `Expected ${expected.size} B; found ${actual.size} B` };
    }
    const expectedTime = expected.modified ? Date.parse(expected.modified) : Number.NaN;
    if (!Number.isNaN(expectedTime) && expectedTime - actual.modified > 2000) {
      return { path: expected.path, state: 'stale', detail: 'The local modified time predates the listed date' };
    }
    return { path: expected.path, state: 'present', detail: 'Name, size, and available date evidence match' };
  });
  const gaps = findings.filter((finding) => finding.state !== 'present').length;
  return {
    readiness: gaps > 0 || manifest.exclusions.length > 0 ? 'not ready' : 'ready',
    expected: findings.length,
    present: findings.length - gaps,
    gaps,
    findings,
    exclusions: manifest.exclusions
  };
}
