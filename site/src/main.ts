import './styles.css';
import { auditDemo, parseManifest, type LocalEntry } from './demo';

const form = document.querySelector<HTMLFormElement>('#audit-form');
const manifestInput = document.querySelector<HTMLTextAreaElement>('#manifest');
const directoryInput = document.querySelector<HTMLInputElement>('#directory');
const errorOutput = document.querySelector<HTMLElement>('#form-error');
const fileCount = document.querySelector<HTMLElement>('#file-count');
const results = document.querySelector<HTMLElement>('#report-results');
const empty = document.querySelector<HTMLElement>('#report-empty');
let sampleFiles: LocalEntry[] | null = null;

const sampleManifest = JSON.stringify(
  {
    provider: 'Example cloud export',
    files: [
      { path: 'Documents/lease.pdf', size: 12840, modified: '2026-08-18T09:00:00Z' },
      { path: 'Photos/2026/birthday.webp', size: 84620, modified: '2026-08-20T12:00:00Z' },
      { path: 'Documents/tax-return.pdf', size: 32100, modified: '2026-08-21T11:30:00Z' }
    ],
    exclusions: [{ path: 'Phone/Documents/**', reason: 'Android denied all-files access' }]
  },
  null,
  2
);

document.querySelector('#load-sample')?.addEventListener('click', () => {
  if (!manifestInput || !fileCount) return;
  manifestInput.value = sampleManifest;
  sampleFiles = [
    { path: 'Documents/lease.pdf', size: 12840, modified: Date.parse('2026-08-18T09:00:00Z') },
    { path: 'Photos/2026/birthday.webp', size: 84620, modified: Date.parse('2026-08-20T12:00:00Z') }
  ];
  fileCount.textContent = 'Demonstration copy loaded: 2 local files.';
  hideError();
  manifestInput.focus();
});

directoryInput?.addEventListener('change', () => {
  sampleFiles = null;
  if (fileCount) fileCount.textContent = `${directoryInput.files?.length ?? 0} local files selected.`;
});

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  hideError();
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (button) {
    button.disabled = true;
    button.textContent = 'Checking evidence…';
  }
  window.setTimeout(() => {
    try {
      const manifest = parseManifest(manifestInput?.value ?? '');
      const localEntries = sampleFiles ?? filesFromInput(directoryInput?.files);
      if (!localEntries.length) throw new Error('Select a destination folder or load the evidence fixture.');
      renderReport(auditDemo(manifest, localEntries));
    } catch (error) {
      showError(error instanceof Error ? error.message : 'The audit could not be completed.');
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = 'Run local audit';
      }
    }
  }, 120);
});

function filesFromInput(list?: FileList | null): LocalEntry[] {
  if (!list) return [];
  return [...list].map((file) => {
    const path = (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
    const relative = path.includes('/') ? path.slice(path.indexOf('/') + 1) : path;
    return { path: relative, size: file.size, modified: file.lastModified };
  });
}

function renderReport(report: ReturnType<typeof auditDemo>) {
  if (!results || !empty) return;
  const label = report.readiness === 'ready' ? 'Ready' : 'Not ready';
  const gapRows = report.findings
    .map((finding) => `<li class="finding finding--${escapeHtml(finding.state.replace(' ', '-'))}"><span>${escapeHtml(finding.state)}</span><strong>${escapeHtml(finding.path)}</strong><small>${escapeHtml(finding.detail)}</small></li>`)
    .join('');
  const exclusionRows = report.exclusions
    .map((item) => `<li class="finding finding--excluded"><span>open exclusion</span><strong>${escapeHtml(item.path)}</strong><small>${escapeHtml(item.reason)}</small></li>`)
    .join('');
  results.innerHTML = `
    <div class="report-header">
      <p class="report-label">Exit-readiness finding</p>
      <h3 id="report-title" class="status status--${report.readiness.replace(' ', '-')}">${label}</h3>
      <p>${report.gaps + report.exclusions.length} unresolved coverage ${report.gaps + report.exclusions.length === 1 ? 'claim' : 'claims'}.</p>
    </div>
    <dl class="report-totals">
      <div><dt>Expected</dt><dd>${report.expected}</dd></div>
      <div><dt>Present</dt><dd>${report.present}</dd></div>
      <div><dt>File gaps</dt><dd>${report.gaps}</dd></div>
      <div><dt>Exclusions</dt><dd>${report.exclusions.length}</dd></div>
    </dl>
    <h4>Evidence ledger</h4>
    <ul class="findings">${gapRows}${exclusionRows}</ul>
    <p class="report-caveat">This browser check is illustrative coverage evidence, not a backup or restore test.</p>`;
  empty.hidden = true;
  results.hidden = false;
  results.focus({ preventScroll: true });
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
}

function showError(message: string) {
  if (!errorOutput) return;
  errorOutput.textContent = message;
  errorOutput.hidden = false;
}

function hideError() {
  if (errorOutput) errorOutput.hidden = true;
}

document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const value = button.dataset.copy ?? '';
    try {
      await navigator.clipboard.writeText(value);
      button.textContent = 'Copied';
    } catch {
      button.textContent = 'Select command';
      button.previousElementSibling?.setAttribute('tabindex', '-1');
      const selection = window.getSelection();
      const range = document.createRange();
      if (button.previousElementSibling) range.selectNodeContents(button.previousElementSibling);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
    window.setTimeout(() => (button.textContent = 'Copy'), 1600);
  });
});

const offlineNotice = document.querySelector<HTMLElement>('#offline-notice');
const updateNetworkState = () => {
  if (offlineNotice) offlineNotice.hidden = navigator.onLine;
};
window.addEventListener('online', updateNetworkState);
window.addEventListener('offline', updateNetworkState);
updateNetworkState();

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
}
