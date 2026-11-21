export function observeMotionViewport(
  node: Element,
  onChange: (active: boolean) => void,
  compact: MediaQueryList,
) {
  let visible = false;
  let active = false;
  let resting = true;
  let timer = 0;

  function sync() {
    const next = visible && !document.hidden && (!compact.matches || resting);
    if (next === active) return;
    active = next;
    onChange(next);
  }

  function onScroll() {
    resting = false;
    sync();
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      resting = true;
      sync();
    }, 140);
  }

  function syncScrollListener() {
    window.removeEventListener("scroll", onScroll);
    if (visible && compact.matches) {
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    } else {
      window.clearTimeout(timer);
      resting = true;
      sync();
    }
  }

  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncScrollListener();
  });
  intersection.observe(node);
  document.addEventListener("visibilitychange", sync);
  compact.addEventListener("change", syncScrollListener);
  return () => {
    intersection.disconnect();
    window.clearTimeout(timer);
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("visibilitychange", sync);
    compact.removeEventListener("change", syncScrollListener);
  };
}
