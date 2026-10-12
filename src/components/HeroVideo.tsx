"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";

type Props = { width: number; height: number };

/**
 * ambient — silent, seamless background loop (on load)
 * voice   — the full, uncut intro with sound, played once
 * stopped — paused by the visitor, or finished; stays still until clicked again
 */
type Mode = "ambient" | "voice" | "stopped";

const FULL_SRC = asset("/media/hero-full.mp4");

/**
 * Muted loop on load. The button (or a click on the video) plays the complete intro once with
 * sound, from the start; click again to pause. Pauses itself while less than 35% is on screen.
 */
export default function HeroVideo({ width, height }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mode, setModeState] = useState<Mode>("ambient");
  const [ended, setEnded] = useState(false);
  const modeRef = useRef<Mode>("ambient");
  const visibleRef = useRef(true);

  const setMode = (m: Mode) => {
    modeRef.current = m;
    setModeState(m);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) video.pause();

    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.intersectionRatio >= 0.35;
        if (!visibleRef.current) video.pause();
        else if (modeRef.current === "voice" || (modeRef.current === "ambient" && !reduce))
          video.play().catch(() => {});
      },
      { threshold: [0, 0.35, 0.6, 1] },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  const playVoice = (video: HTMLVideoElement) => {
    // Swap to the uncut clip the first time (the loop file trims the opening into a crossfade).
    if (!video.currentSrc.endsWith(FULL_SRC)) video.src = FULL_SRC;
    else if (ended) video.currentTime = 0;
    video.removeAttribute("muted");
    video.defaultMuted = false;
    video.muted = false;
    video.volume = 1;
    setEnded(false);
    setMode("voice");
    // play() must be called synchronously inside the click for browsers to allow sound
    video.play().catch(() => {
      video.muted = true;
      setMode("stopped");
    });
  };

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (modeRef.current === "voice") {
      video.pause();
      setMode("stopped");
    } else {
      playVoice(video);
    }
  };

  const onEnded = () => {
    if (modeRef.current !== "voice") return;
    setEnded(true);
    setMode("stopped");
  };

  const playing = mode === "voice";
  const label =
    mode === "ambient" ? "Tap for sound" : playing ? "Pause" : ended ? "Replay intro" : "Resume";

  return (
    <div className="hero-video-wrap">
      <video
        ref={videoRef}
        className="hero-video"
        width={width}
        height={height}
        poster={asset("/media/hero-poster.webp")}
        autoPlay
        muted
        loop={mode === "ambient"}
        playsInline
        preload="auto"
        onClick={toggle}
        onEnded={onEnded}
        aria-label="Intro video: Prasad Rao’s self-introduction"
      >
        {/* MP4 (H.264 + AAC) first: Safari plays VP9 WebM but often can't decode its Opus audio */}
        <source src={asset("/media/hero.mp4")} type="video/mp4" />
        <source src={asset("/media/hero.webm")} type="video/webm" />
      </video>

      <button
        type="button"
        className="sound-btn"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Pause intro" : ended ? "Replay intro with sound" : "Play intro with sound"}
      >
        <span className="sound-icon" data-state={playing ? "on" : "off"} data-idle={mode === "ambient"} aria-hidden="true">
          <svg viewBox="0 0 20 20" className="i-play">
            <path d="M6 4.2v11.6L15.6 10z" />
          </svg>
          <svg viewBox="0 0 20 20" className="i-pause">
            <rect x="5" y="4" width="3.4" height="12" rx="1" />
            <rect x="11.6" y="4" width="3.4" height="12" rx="1" />
          </svg>
        </span>
        <span className="sound-label">{label}</span>
      </button>
    </div>
  );
}
