import './styles.css';
import { auditDemo, type LocalEntry, type ParsedManifest } from './demo';
import { focusHeadingAfterNavigation, markInternalNavigations } from './navigation';

const results = document.querySelector<HTMLElement>('#report-results');
const empty = document.querySelector<HTMLElement>('#report-empty');
const isDemo = document.body.dataset.demo === 'true';
const demoStorageKey = 'demo:cloud-exit-evidence';

if (!isDemo && new URLSearchParams(window.location.search).get('demo') === '1') {
  window.location.replace('/demo/');
}

const sampleManifest: ParsedManifest = {
  files: [
    { path: 'Documents/lease.pdf', size: 22, modified: '2026-08-18T09:00:00Z' },
    { path: 'Photos/2026/birthday.webp', size: 84620, modified: '2026-08-20T12:00:00Z' },
    { path: 'Documents/tax-return.pdf', size: 32100, modified: '2026-08-21T11:30:00Z' }
  ],
  exclusions: [{ path: 'Phone/Documents/**', reason: 'Android denied all-files access' }]
};

const sampleFiles: LocalEntry[] = [
  { path: 'Documents/lease.pdf', size: 22, modified: Date.parse('2026-08-18T09:00:00Z') }
];

function resetSample() {
  localStorage.setItem(demoStorageKey, 'sample');
  renderReport(auditDemo(sampleManifest, sampleFiles));
}

function discardDemoState() {
  localStorage.removeItem(demoStorageKey);
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
      <p class="report-label">Sample file-copy result</p>
      <h3 id="report-title" class="status status--${report.readiness.replace(' ', '-')}">${label}</h3>
      <p>${report.gaps + report.exclusions.length} items need attention.</p>
    </div>
    <dl class="report-totals">
      <div><dt>In file list</dt><dd>${report.expected}</dd></div>
      <div><dt>On the drive</dt><dd>${report.present}</dd></div>
      <div><dt>Missing or changed</dt><dd>${report.gaps}</dd></div>
      <div><dt>Open exclusions</dt><dd>${report.exclusions.length}</dd></div>
    </dl>
    <h4>Files needing attention</h4>
    <ul class="findings">${gapRows}${exclusionRows}</ul>
    <p class="report-caveat">This browser check compares a bundled file list. It does not create or test a backup.</p>`;
  empty.hidden = true;
  results.hidden = false;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
}

document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const value = button.dataset.copy ?? '';
    const commandName = button.dataset.copyLabel?.replace(/^Copy /, '') ?? 'command';
    try {
      await navigator.clipboard.writeText(value);
      button.textContent = `Copied ${commandName}`;
    } catch {
      button.textContent = `Select ${commandName}`;
      button.previousElementSibling?.setAttribute('tabindex', '-1');
      const selection = window.getSelection();
      const range = document.createRange();
      if (button.previousElementSibling) range.selectNodeContents(button.previousElementSibling);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
    window.setTimeout(() => (button.textContent = button.dataset.copyLabel ?? 'Copy command'), 1600);
  });
});

const offlineNotice = document.querySelector<HTMLElement>('#offline-notice');
const updateNetworkState = () => {
  if (offlineNotice) offlineNotice.hidden = navigator.onLine;
};
window.addEventListener('online', updateNetworkState);
window.addEventListener('offline', updateNetworkState);
updateNetworkState();

if (isDemo) {
  resetSample();
  document.querySelector<HTMLButtonElement>('#reset-demo')?.addEventListener('click', resetSample);
  window.addEventListener('pagehide', discardDemoState);
  window.addEventListener('pageshow', () => {
    if (localStorage.getItem(demoStorageKey) === null) resetSample();
  });
}

markInternalNavigations();
window.addEventListener('pageshow', focusHeadingAfterNavigation);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
}
