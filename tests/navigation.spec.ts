import { expect, test } from "@playwright/test";
import { NAV } from "../src/lib/data";

test.describe("header navigation", () => {
  test("every nav link brings its section into view", async ({ page, isMobile }) => {
    await page.goto("/");
    const menuButton = page.getByRole("button", { name: "Open menu" });
    const nav = page.getByRole("navigation", { name: "Primary" });

    for (const item of NAV) {
      if (isMobile) await menuButton.click();
      await nav.getByRole("link", { name: item.label, exact: true }).click();
      await expect(page.locator(`#${item.id}`)).toBeInViewport();
    }
  });

  test("marks the section on screen as current", async ({ page, isMobile }) => {
    test.skip(isMobile, "the desktop nav is always visible");
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav.locator("[aria-current]")).toHaveCount(0); // on the hero

    await nav.getByRole("link", { name: "Certifications", exact: true }).click();
    await expect(nav.getByRole("link", { name: "Certifications", exact: true })).toHaveAttribute("aria-current", "location");
    await expect(nav.locator("[aria-current]")).toHaveCount(1);
  });

  test("mobile menu opens, closes with Escape, and closes after picking a link", async ({ page, isMobile }) => {
    test.skip(!isMobile, "the menu button only shows on small screens");
    await page.goto("/");
    const toggle = page.locator(".menu-btn");

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Contact" }).click();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#contact")).toBeInViewport();
  });

  test("skip link is the first stop for keyboard users", async ({ page, isMobile }) => {
    test.skip(isMobile, "keyboard navigation");
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
  });
});
