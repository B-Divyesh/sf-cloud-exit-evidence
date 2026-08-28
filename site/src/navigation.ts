const focusMarker = 'cee:route-focus';

function routeKey(url: URL): string {
  return `${url.pathname}${url.search}`;
}

/**
 * Native multi-page navigation normally carries a referrer. The production
 * site deliberately sends no-referrer, so mark a deliberate same-origin link
 * before the browser leaves this document instead.
 */
export function markInternalNavigations(): void {
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
    if (!link || link.target || link.hasAttribute('download')) return;
    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin || routeKey(destination) === routeKey(new URL(window.location.href))) return;
    sessionStorage.setItem(focusMarker, routeKey(destination));
  });
}

export function focusHeadingAfterNavigation(): void {
  const heading = document.querySelector<HTMLElement>('h1');
  const announcement = document.querySelector<HTMLElement>('.route-announcement');
  if (!heading) return;
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  const key = routeKey(new URL(window.location.href));
  const marked = sessionStorage.getItem(focusMarker) === key;
  if (marked) sessionStorage.removeItem(focusMarker);
  if (!marked && navigation?.type !== 'back_forward') return;
  heading.setAttribute('tabindex', '-1');
  heading.focus({ preventScroll: true });
  if (announcement) announcement.textContent = document.title;
}
