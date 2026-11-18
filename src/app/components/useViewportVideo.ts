import { type RefObject, useEffect, useRef } from "react";

const minimumVisibleRatio = .2;

export function useViewportVideo(
  video: RefObject<HTMLVideoElement | null>,
  source: string,
  respectReducedMotion = false,
) {
  const playIfVisible = useRef<() => Promise<void>>(async () => {});

  useEffect(() => {
    const media = video.current;
    if (!media) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    let manuallyPaused = false;
    let observerPausePending = false;

    const isVisible = () => inView && !document.hidden;
    const canPlay = () => isVisible() && !(respectReducedMotion && motion.matches);

    const pauseForVisibility = () => {
      if (media.paused) return;
      observerPausePending = true;
      media.pause();
    };

    const requestPlay = async () => {
      if (canPlay() && !manuallyPaused) await media.play();
    };
    playIfVisible.current = requestPlay;

    const syncPlayback = () => {
      // Attach the source on first entry. Keep it attached afterward so the
      // browser can resume from the same position without reloading it.
      if (isVisible() && !media.hasAttribute("src")) media.src = source;
      if (!canPlay()) {
        pauseForVisibility();
      } else if (media.paused) {
        void requestPlay().catch(() => { /* Browser autoplay policy can block playback. */ });
      }
    };

    const onPause = () => {
      if (!observerPausePending && canPlay()) manuallyPaused = true;
      observerPausePending = false;
    };
    const onPlay = () => {
      // Also gate playback requested by the browser's media controls.
      if (canPlay()) manuallyPaused = false;
      else pauseForVisibility();
    };

    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= minimumVisibleRatio;
      syncPlayback();
    }, { threshold: minimumVisibleRatio });

    media.addEventListener("pause", onPause);
    media.addEventListener("play", onPlay);
    document.addEventListener("visibilitychange", syncPlayback);
    if (respectReducedMotion) motion.addEventListener("change", syncPlayback);
    visibility.observe(media);

    return () => {
      visibility.disconnect();
      media.removeEventListener("pause", onPause);
      media.removeEventListener("play", onPlay);
      document.removeEventListener("visibilitychange", syncPlayback);
      if (respectReducedMotion) motion.removeEventListener("change", syncPlayback);
      playIfVisible.current = async () => {};
      media.pause();
    };
  }, [video, source, respectReducedMotion]);

  return playIfVisible;
}
