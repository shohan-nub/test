export function observeMotionViewport(
  node: Element,
  onChange: (active: boolean) => void,
  compact: MediaQueryList,
) {
  let visible = false;
  let active = false;
  let resting = true;
  let timer = 0;
  let lastScroll = -Infinity;

  function sync() {
    const next = visible && !document.hidden && (!compact.matches || resting);
    if (next === active) return;
    active = next;
    onChange(next);
  }

  function onScroll() {
    if (!compact.matches) return;
    lastScroll = performance.now();
    if (!visible) return;
    resting = false;
    sync();
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      resting = true;
      sync();
    }, 140);
  }

  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && performance.now() - lastScroll < 140) onScroll();
    else sync();
  });
  intersection.observe(node);
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", sync);
  compact.addEventListener("change", sync);
  return () => {
    intersection.disconnect();
    window.clearTimeout(timer);
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("visibilitychange", sync);
    compact.removeEventListener("change", sync);
  };
}
