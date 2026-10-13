import { expect, test } from "@playwright/test";
import { PROFILE } from "../src/lib/data";

test.describe("page health", () => {
  test("loads without console errors or failed requests", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => {
      // WebKit logs its own native media-control icons failing to load; not the page's doing
      if (m.type() === "error" && !m.text().startsWith("Button failed to load")) errors.push(m.text());
    });
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("requestfailed", (r) => {
      // media requests are routinely cancelled when the browser switches sources
      if (r.resourceType() !== "media") errors.push(`${r.failure()?.errorText} ${r.url()}`);
    });
    page.on("response", (r) => r.status() >= 400 && errors.push(`${r.status()} ${r.url()}`));

    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(
      `${PROFILE.name} — ${PROFILE.headline}`,
    );
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });

  test("never scrolls sideways", async ({ page }) => {
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("always opens at the top, even from a #section link", async ({ page }) => {
    await page.goto("/#contact");
    await expect(page).toHaveURL(/\/$/);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });
});

test.describe("SEO & sharing", () => {
  test("has title, description, canonical and a link-preview card", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(`${PROFILE.name} — ${PROFILE.headline}`);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{80,}/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https:\/\//);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /^https:\/\/.+\/og\.png$/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  });

  test("publishes valid schema.org Person data", async ({ page }) => {
    await page.goto("/");
    const raw = await page.locator('script[type="application/ld+json"]').textContent();
    const person = JSON.parse(raw ?? "{}");
    expect(person).toMatchObject({ "@type": "Person", name: PROFILE.name, jobTitle: PROFILE.headline });
    expect(person.sameAs).toContain(PROFILE.linkedin);
  });

  for (const [path, type] of [
    ["/og.png", "image/png"],
    ["/robots.txt", "text/plain"],
    ["/sitemap.xml", "xml"],
    ["/resume.pdf", "application/pdf"],
    ["/prasad-portfolio/resume.pdf", "application/pdf"],
    ["/media/hero-full.vtt", "text/vtt"],
  ] as const) {
    test(`serves ${path}`, async ({ request }) => {
      const res = await request.get(path);
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toContain(type);
    });
  }

  test("old /prasad-portfolio/ address forwards to the home page", async ({ request }) => {
    const html = await (await request.get("/prasad-portfolio/")).text();
    expect(html).toContain('http-equiv="refresh"');
    expect(html).toMatch(/<meta name="robots" content="noindex">/);
  });
});
