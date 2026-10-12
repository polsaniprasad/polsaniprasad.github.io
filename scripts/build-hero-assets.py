#!/usr/bin/env python3
"""
Build the hero media from intro.mp4.

  1. Samples frames with ffmpeg and uses numpy to find the subject's bounding box
     (anything noticeably darker than the plain white background).
  2. Crops tightly around the subject and scales to 768px wide.
  3. Pushes the off-white background to pure white with `colorlevels`, so the
     video disappears into the page under `mix-blend-mode: multiply`.
  4. Crossfades the tail into the head so the clip loops without a visible cut.
  5. Exports public/media/hero.mp4, hero.webm, hero-sm.mp4 (silent loops), hero-full.mp4 (the complete,
     uncut intro with sound, played once when the visitor asks for sound), hero-poster.webp and
     portrait-bust.webp.

Usage:  python3 scripts/build-hero-assets.py [path/to/intro.mp4]
Needs:  ffmpeg + ffprobe on PATH, numpy (pip install numpy); cwebp if ffmpeg lacks libwebp
"""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "intro.mp4"
OUT = ROOT / "public" / "media"

OUT_WIDTH = 768        # final video width
SMALL_WIDTH = 480      # phone-sized loop
FADE = 0.8             # seconds of crossfade for the seamless loop
SAMPLES = 24           # frames sampled for the bounding-box analysis
ANALYSIS_W = 480       # analysis resolution (keeps numpy work tiny)
DARK_DELTA = 40        # how much darker than the background counts as "subject"
PAD_X, PAD_TOP, PAD_BOTTOM = 0.035, 0.03, 0.02  # padding as a fraction of the frame


def run(cmd: list[str], **kw) -> subprocess.CompletedProcess:
    print("  $", " ".join(cmd[:6]), "…" if len(cmd) > 6 else "")
    return subprocess.run(cmd, check=True, **kw)


def probe(path: Path) -> tuple[int, int, float, bool]:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,width,height:format=duration",
         "-of", "json", str(path)],
        check=True, capture_output=True, text=True,
    ).stdout
    data = json.loads(out)
    video = next(s for s in data["streams"] if s["codec_type"] == "video")
    has_audio = any(s["codec_type"] == "audio" for s in data["streams"])
    return int(video["width"]), int(video["height"]), float(data["format"]["duration"]), has_audio


def sample_frames(path: Path, w: int, h: int, duration: float) -> np.ndarray:
    """Return SAMPLES grayscale frames at ANALYSIS_W resolution, shape (n, ah, aw)."""
    ah = round(h * ANALYSIS_W / w)
    fps = SAMPLES / duration
    raw = run(
        ["ffmpeg", "-v", "error", "-i", str(path), "-vf", f"fps={fps:.5f},scale={ANALYSIS_W}:{ah},format=gray",
         "-f", "rawvideo", "-"],
        capture_output=True,
    ).stdout
    frames = np.frombuffer(raw, dtype=np.uint8)
    n = frames.size // (ANALYSIS_W * ah)
    return frames[: n * ANALYSIS_W * ah].reshape(n, ah, ANALYSIS_W)


def analyse(frames: np.ndarray) -> tuple[float, tuple[float, float, float, float]]:
    """Background level (0-255) and subject bbox as fractions (x0, y0, x1, y1)."""
    n, ah, aw = frames.shape
    edge = max(4, aw // 7)
    # Studio backdrops vignette, so model the background per row from the outer columns.
    row_bg = np.median(np.concatenate([frames[:, :, :edge], frames[:, :, -edge:]], axis=2), axis=2)
    bg = float(np.median(row_bg))

    mask = (frames < row_bg[:, :, None] - DARK_DELTA).any(axis=0)
    # ignore soft shadows and noise: a column/row counts only with a run of subject pixels
    cols = np.where(mask.sum(axis=0) > ah * 0.02)[0]
    rows = np.where(mask.sum(axis=1) > 2)[0]
    if cols.size == 0 or rows.size == 0:
        raise SystemExit("Could not find a subject - is the background plain and light?")
    return bg, (cols[0] / aw, rows[0] / ah, (cols[-1] + 1) / aw, (rows[-1] + 1) / ah)


def has_encoder(name: str) -> bool:
    out = subprocess.run(["ffmpeg", "-hide_banner", "-encoders"], capture_output=True, text=True).stdout
    return f" {name} " in out


def still(at: float, vf: str, dest: Path, quality: int) -> None:
    """Export one frame as WebP (ffmpeg libwebp, or PNG + cwebp as a fallback)."""
    if has_encoder("libwebp"):
        run(["ffmpeg", "-v", "error", "-y", "-ss", f"{at:.3f}", "-i", str(SRC), "-frames:v", "1",
             "-vf", vf, "-c:v", "libwebp", "-quality", str(quality), str(dest)])
        return
    png = dest.with_suffix(".tmp.png")
    run(["ffmpeg", "-v", "error", "-y", "-ss", f"{at:.3f}", "-i", str(SRC), "-frames:v", "1", "-vf", vf, str(png)])
    run(["cwebp", "-quiet", "-q", str(quality), str(png), "-o", str(dest)])
    png.unlink()


def even(v: float) -> int:
    return int(round(v / 2) * 2)


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Source video not found: {SRC}")
    OUT.mkdir(parents=True, exist_ok=True)

    w, h, duration, has_audio = probe(SRC)
    print(f"• source {w}x{h}, {duration:.2f}s, audio={has_audio}")

    frames = sample_frames(SRC, w, h, duration)
    bg, (fx0, fy0, fx1, fy1) = analyse(frames)
    print(f"• background ≈ {bg:.0f}/255, subject bbox {fx0:.3f},{fy0:.3f} → {fx1:.3f},{fy1:.3f}")

    # Crop: subject + padding, centred on the subject, clamped to the frame.
    cx = (fx0 + fx1) / 2 * w
    cw = min(w, even((fx1 - fx0 + PAD_X * 2) * w))
    y0 = max(0, even((fy0 - PAD_TOP) * h))
    y1 = min(h, even((fy1 + PAD_BOTTOM) * h))
    ch = y1 - y0
    x0 = even(min(max(0, cx - cw / 2), w - cw))
    out_h = even(ch * OUT_WIDTH / cw)
    print(f"• crop {cw}x{ch}+{x0}+{y0} → {OUT_WIDTH}x{out_h}")

    # Map the background level to pure white. Slightly lift the black point for richer ink.
    lvl = min(1.0, (bg - 6) / 255)
    grade = f"colorlevels=rimin=0.02:gimin=0.02:bimin=0.02:rimax={lvl:.3f}:gimax={lvl:.3f}:bimax={lvl:.3f}"
    base = f"crop={cw}:{ch}:{x0}:{y0},scale={OUT_WIDTH}:{out_h}:flags=lanczos,{grade},format=yuv420p"

    # Seamless loop: play [FADE, end] and crossfade its tail into [0, FADE].
    # The last output frame equals source frame at FADE == the first output frame.
    loop_len = duration - FADE
    vgraph = (
        f"[0:v]{base},split[va][vb];"
        f"[va]trim=start={FADE},setpts=PTS-STARTPTS[main];"
        f"[vb]trim=end={FADE},setpts=PTS-STARTPTS[head];"
        f"[main][head]xfade=transition=fade:duration={FADE}:offset={duration - 2 * FADE:.3f}[v]"
    )
    # The loop only ever plays muted (sound comes from hero-full.mp4), so it ships without audio.
    graph = vgraph
    maps = ["-map", "[v]"]

    print("• encoding hero.mp4")
    run(["ffmpeg", "-v", "error", "-y", "-i", str(SRC), "-filter_complex", graph, *maps,
         "-t", f"{loop_len:.3f}", "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-profile:v", "high",
         "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", str(OUT / "hero.mp4")])

    # Phones show the video at ~260-430 CSS px wide, so a 480px loop is plenty there.
    print("• encoding hero-sm.mp4")
    run(["ffmpeg", "-v", "error", "-y", "-i", str(OUT / "hero.mp4"), "-vf", f"scale={SMALL_WIDTH}:-2:flags=lanczos",
         "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-profile:v", "high",
         "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", str(OUT / "hero-sm.mp4")])

    print("• encoding hero.webm")
    run(["ffmpeg", "-v", "error", "-y", "-i", str(SRC), "-filter_complex", graph, *maps,
         "-t", f"{loop_len:.3f}", "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "40", "-row-mt", "1",
         "-deadline", "good", "-cpu-used", "2",
         "-an", str(OUT / "hero.webm")])

    # The loop trims the first FADE seconds into a crossfade, which would clip the first word.
    # For listening, ship the complete clip with the same crop and grade, played once.
    print("• encoding hero-full.mp4")
    run(["ffmpeg", "-v", "error", "-y", "-i", str(SRC), "-vf", base,
         "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-profile:v", "high",
         "-pix_fmt", "yuv420p", "-movflags", "+faststart",
         *(["-c:a", "aac", "-b:a", "128k"] if has_audio else ["-an"]), str(OUT / "hero-full.mp4")])

    print("• exporting hero-poster.webp")
    still(FADE, base.replace(",format=yuv420p", ""), OUT / "hero-poster.webp", 82)

    # Portrait bust: square-ish crop around head and shoulders (top ~30% of the subject).
    subj_h = (fy1 - fy0) * h
    bust = even(max(subj_h * 0.34, (fx1 - fx0) * w * 0.9))
    bx = even(min(max(0, cx - bust / 2), w - bust))
    by = even(max(0, fy0 * h - subj_h * 0.04))
    bh = even(bust * 1.2)
    print(f"• exporting portrait-bust.webp ({bust}x{bh}+{bx}+{by})")
    still(duration / 2, f"crop={bust}:{bh}:{bx}:{by},scale=480:-2:flags=lanczos,{grade}",
          OUT / "portrait-bust.webp", 86)

    meta = {"width": OUT_WIDTH, "height": out_h, "duration": round(loop_len, 3), "fullDuration": round(duration, 3)}
    (OUT / "hero.json").write_text(json.dumps(meta, indent=2) + "\n")
    for f in sorted(OUT.iterdir()):
        print(f"  {f.name:22s} {f.stat().st_size / 1024:8.1f} kB")
    print("done.")


if __name__ == "__main__":
    main()
