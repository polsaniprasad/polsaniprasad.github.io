import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Reduced motion shows every scroll-reveal at full opacity, so contrast is measured on the
// finished state rather than mid-fade.
test.use({ reducedMotion: "reduce" });

test("no WCAG 2.1 A/AA violations", async ({ page }) => {
  await page.goto("/");
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const summary = violations.map((v) => ({
    rule: v.id,
    impact: v.impact,
    targets: v.nodes.slice(0, 5).map((n) => n.target.join(" ")),
  }));
  expect(summary).toEqual([]);
});
