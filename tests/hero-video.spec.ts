import { expect, test } from "@playwright/test";
import { PROFILE } from "../src/lib/data";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("the intro has a transcript for screen readers", async ({ page }) => {
  const video = page.locator("video.hero-video");
  await expect(video).toHaveAttribute("aria-describedby", "hero-transcript");
  await expect(page.locator("#hero-transcript")).toHaveText(`Transcript: ${PROFILE.introTranscript}`);
});

test("caption file is valid WebVTT covering the transcript", async ({ request }) => {
  const vtt = (await (await request.get("/media/hero-full.vtt")).text()).trim();
  expect(vtt.startsWith("WEBVTT")).toBe(true);
  const spoken = vtt
    .split(/\n\n+/)
    .slice(1)
    .map((cue) => cue.split("\n").slice(2).join(" "))
    .join(" ");
  expect(spoken).toBe(PROFILE.introTranscript);
});

test("sound button plays the intro with captions, then pauses", async ({ page }) => {
  const video = page.locator("video.hero-video");
  const playable = await video.evaluate((v: HTMLVideoElement) => v.canPlayType('video/mp4; codecs="avc1.42E01E"'));
  test.skip(!playable, "this browser build has no H.264 decoder");

  const button = page.locator(".sound-btn");
  await expect(button).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator(".hero-caption")).toHaveCount(0); // silent loop: no captions

  await button.click();
  await expect(button).toHaveAttribute("aria-pressed", "true");
  await expect(button).toHaveAccessibleName("Pause intro");
  expect(await video.evaluate((v: HTMLVideoElement) => v.muted)).toBe(false);
  await expect(page.locator(".hero-caption")).toHaveText("Hi, I’m Prasad Rao.");

  await button.click();
  await expect(button).toHaveAttribute("aria-pressed", "false");
  expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
});
