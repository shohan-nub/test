"use client";

import { type TransitionEvent, useEffect, useRef, useState } from "react";
import soundStyles from "./ShowreelSound.module.css";
import { useViewportVideo } from "./useViewportVideo";

export function ProjectShowreel() {
  const video = useRef<HTMLVideoElement>(null);
  const playIfVisible = useViewportVideo(video, "/card5.mp4");
  const [muted, setMuted] = useState(true);
  const [feedback, setFeedback] = useState("");
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const soundRequest = useRef(0);

  const announce = (message: string) => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    setFeedback(message);
    feedbackTimer.current = setTimeout(() => setFeedback(""), 2800);
  };

  const toggleSound = async () => {
    const media = video.current;
    if (!media) return;
    const request = ++soundRequest.current;
    const enable = media.muted || media.volume === 0;
    try {
      if (enable) media.volume = .65;
      media.muted = !enable;
      setMuted(media.muted || media.volume === 0);
      announce(enable ? "Sound On" : "Sound Off");
      // play() preserves currentTime and also recovers a policy-paused video.
      if (enable || media.paused) await playIfVisible.current();
    } catch (error) {
      if (request !== soundRequest.current) return;
      // A viewport pause can interrupt a pending play() request.
      if (error instanceof DOMException && error.name === "AbortError") return;
      media.muted = true;
      setMuted(true);
      announce("Sound unavailable. Try again.");
      void playIfVisible.current().catch(() => { /* Leave the control available for another user gesture. */ });
    }
  };

  useEffect(() => {
    const media = video.current;
    if (!media) return;
    const reveal = () => { media.dataset.ready = "true"; };
    const hide = () => { delete media.dataset.ready; };
    const syncSound = () => {
      const silent = media.muted || media.volume === 0;
      setMuted(silent);
      if (silent) setFeedback(message => message === "Sound On" ? "" : message);
    };
    media.muted = true;
    media.defaultMuted = true;
    media.addEventListener("loadeddata", reveal);
    media.addEventListener("error", hide);
    media.addEventListener("volumechange", syncSound);
    if (media.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) reveal();
    return () => {
      media.removeEventListener("loadeddata", reveal);
      media.removeEventListener("error", hide);
      media.removeEventListener("volumechange", syncSound);
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
      soundRequest.current += 1;
    };
  }, []);

  return <div className={soundStyles.root} onDoubleClick={event => {
    if ((event.target as HTMLElement).closest("button")) return;
    event.preventDefault();
    void toggleSound();
  }}>
    <video ref={video} className="project-showreel" muted={muted} loop playsInline preload="metadata" aria-label="SparkLab creative showreel" />
    <button className={soundStyles.control} type="button" aria-label={muted ? "Enable showreel sound" : "Mute showreel sound"} aria-pressed={!muted} onClick={event => {
      event.stopPropagation();
      const touch = window.matchMedia("(pointer: coarse)").matches || ("pointerType" in event.nativeEvent && event.nativeEvent.pointerType === "touch");
      // Every touch tap is intentional; a desktop button double-click toggles once.
      if (touch || event.detail < 2) void toggleSound();
    }}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 4 6 8H3v8h3l5 4V4Z" />{muted ? <path d="m16 9 6 6m0-6-6 6" /> : <><path d="M15 8a6 6 0 0 1 0 8" /><path d="M18 5a10 10 0 0 1 0 14" /></>}</svg>
      <span className={soundStyles.label} data-visible={muted || !!feedback} aria-hidden="true">{feedback || (muted ? <><span className={soundStyles.desktopHint}>Double-click for sound</span><span className={soundStyles.touchHint}>Tap for sound</span></> : "Sound On")}</span>
    </button>
    <span className={soundStyles.status} role="status">{feedback}</span>
  </div>;
}

export function OverviewVideo() {
  const video = useRef<HTMLVideoElement>(null);
  useViewportVideo(video, "/creative-loop.mp4", true);

  return <video ref={video} muted loop playsInline preload="metadata" aria-hidden="true" />;
}

const consultationPhrases = ["Automate Customer Replies", "Generate Reports Automatically", "Handle Follow-up Calls", "Capture & Qualify Leads", "Schedule Appointments", "Manage Customer Inquiries", "Send Order Notifications", "Sync Business Data"];

export function ConsultationPhrases() {
  const viewport = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(consultationPhrases.length);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const node = viewport.current;
    if (!node) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    let visible = false;
    const syncMotion = () => {
      if (timer) clearInterval(timer);
      if (visible && !document.hidden && !media.matches) timer = setInterval(() => setActive((value) => value + 1), 2700);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncMotion();
    });
    observer.observe(node);
    media.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncMotion);
    return () => {
      observer.disconnect();
      if (timer) clearInterval(timer);
      media.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncMotion);
    };
  }, []);

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || event.propertyName !== "transform" || active < consultationPhrases.length * 2) return;
    setAnimate(false);
    setActive(consultationPhrases.length);
    requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
  };

  return <div ref={viewport} className="consultation-phrases" aria-label={consultationPhrases.join(", ")}>
    <div className="consultation-phrases-track" aria-hidden="true" onTransitionEnd={handleTransitionEnd} style={{ transform: `translateY(${(2 - active) / (consultationPhrases.length * 3) * 100}%)`, transition: animate ? undefined : "none" }}>
      {[0, 1, 2].flatMap((copy) => consultationPhrases.map((phrase, index) => <div key={`${copy}-${phrase}`} className={`consultation-phrase${copy * consultationPhrases.length + index === active ? " is-active" : ""}`}>{phrase}</div>))}
    </div>
  </div>;
}
