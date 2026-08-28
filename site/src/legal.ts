import './styles.css';

window.addEventListener('pageshow', () => {
  const heading = document.querySelector<HTMLElement>('h1');
  const announcement = document.querySelector<HTMLElement>('.route-announcement');
  if (!heading) return;
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  const arrivedFromThisSite = document.referrer.startsWith(window.location.origin) || navigation?.type === 'back_forward';
  if (!arrivedFromThisSite) return;
  heading.setAttribute('tabindex', '-1');
  heading.focus({ preventScroll: true });
  if (announcement) announcement.textContent = document.title;
});
