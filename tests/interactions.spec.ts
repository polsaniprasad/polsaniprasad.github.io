import { expect, test } from "@playwright/test";
import { PROFILE, PROJECTS, SITE_QA, SKILL_GROUPS } from "../src/lib/data";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("résumé downloads with a readable file name", async ({ page }) => {
  const download = page.waitForEvent("download");
  await page.locator(".hero").getByRole("link", { name: "Résumé" }).click();
  expect((await download).suggestedFilename()).toBe("Prasad-Rao-Resume.pdf");
});

test("email chip copies the address", async ({ page, context, browserName }) => {
  test.skip(browserName !== "chromium", "clipboard permissions are Chromium-only in Playwright");
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const chip = page.locator(".email-chip");
  await chip.scrollIntoViewIfNeeded();
  await chip.click();
  await expect(chip).toContainText("Copied");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(PROFILE.email);
});

test.describe("skills table", () => {
  test("a category chip dims every other family", async ({ page }) => {
    const api = SKILL_GROUPS.find((g) => g.category === "api")!;
    const chip = page.getByRole("button", { name: "API Testing", exact: true });
    await chip.scrollIntoViewIfNeeded();
    await chip.click();
    await expect(chip).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator('.el[data-dim="false"]')).toHaveCount(api.items.length);

    await chip.click(); // pressing it again clears the filter
    await expect(page.getByRole("button", { name: /^All/ })).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator('.el[data-dim="true"]')).toHaveCount(0);
  });

  test("picking an element shows where it was used", async ({ page }) => {
    const tile = page.getByRole("button", { name: "Postman, API Testing" });
    await tile.scrollIntoViewIfNeeded();
    await tile.click();
    const inspector = page.getByRole("complementary", { name: "Skill details" });
    await expect(inspector.getByRole("heading", { name: "Postman" })).toBeVisible();
    await expect(inspector.getByRole("listitem")).toHaveText(["Verizon", "5Y Business Solutions", "Helen of Troy"]);
  });
});

test("work accordion keeps exactly one panel open", async ({ page }) => {
  const heads = page.locator(".acc-head");
  await expect(heads).toHaveCount(PROJECTS.length);
  await expect(heads.first()).toHaveAttribute("aria-expanded", "true");

  await heads.nth(1).scrollIntoViewIfNeeded();
  await heads.nth(1).click();
  await expect(heads.nth(1)).toHaveAttribute("aria-expanded", "true");
  await expect(heads.first()).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByText(PROJECTS[1].description)).toBeVisible();
});

test("ID card flips from the keyboard", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard interaction");
  const card = page.getByRole("button", { name: `Developer ID ${PROFILE.name}` });
  await card.focus();
  await page.keyboard.press("Enter");
  await expect(card).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Enter");
  await expect(card).toHaveAttribute("aria-pressed", "false");
});

test("links that open a new tab are safe and point at https", async ({ page }) => {
  const links = page.locator('a[target="_blank"]');
  expect(await links.count()).toBeGreaterThan(0);
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute("rel", /noopener/);
    await expect(link).toHaveAttribute("href", /^https:\/\//);
  }
});

test.describe("phone number", () => {
  const digits = PROFILE.phoneHref.replace(/\D/g, "").slice(-7); // the part that gets masked

  test("is not in the page source until asked for", async ({ request }) => {
    const html = await (await request.get("/")).text();
    expect(html.replace(/\D/g, "")).not.toContain(digits);
    expect(html).not.toContain(PROFILE.phone);
  });

  test("shows masked, then reveals a working tel: link with focus on it", async ({ page }) => {
    const reveal = page.getByRole("button", { name: "Phone: Show number" });
    await reveal.scrollIntoViewIfNeeded();
    await expect(reveal).toContainText("•••-••••");
    await reveal.click();

    const link = page.getByRole("link", { name: PROFILE.phone });
    await expect(link).toHaveAttribute("href", PROFILE.phoneHref);
    await expect(link).toBeFocused();
  });
});

test("skills are announced to screen readers on pick, not on hover", async ({ page, isMobile }) => {
  test.skip(isMobile, "hover");
  const live = page.locator('.ptable [aria-live="polite"]').last();
  const tile = page.getByRole("button", { name: "Postman, API Testing" });
  await tile.scrollIntoViewIfNeeded();
  await tile.hover();
  await expect(live).toBeEmpty();
  await tile.click();
  await expect(live).toHaveText(/^Postman\. .+ Used at Verizon, 5Y Business Solutions, Helen of Troy\.$/);
});

test("work section explains how this site is tested", async ({ page }) => {
  const card = page.getByRole("article", { name: SITE_QA.title });
  await card.scrollIntoViewIfNeeded();
  await expect(card).toBeVisible();
  await expect(card.getByRole("listitem").filter({ hasText: "Playwright E2E" })).toBeVisible();
});
