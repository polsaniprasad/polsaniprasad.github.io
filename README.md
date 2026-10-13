# Prasad Rao — portfolio

Source for **https://polsaniprasad.github.io**, the portfolio of a QA engineer, so it is tested the
way a production app would be. Nothing reaches the live site unless every check below passes.

Built with Next.js (static export), React and Tailwind; hosted on GitHub Pages.

## How this site is tested

Every push and pull request runs [`.github/workflows/ci.yml`](.github/workflows/ci.yml):

| Step | What it checks |
|---|---|
| ESLint + `tsc` | Code style and types |
| `npm run build:static` | Builds the exact files GitHub Pages will serve |
| Playwright | End-to-end tests on **desktop Chrome**, **Android (Pixel 7)** and **iPhone 14 (WebKit)** |
| axe-core | WCAG 2.1 A/AA accessibility scan |
| Lighthouse CI | Phone-profile scores: performance ≥ 90; accessibility, best practices and SEO ≥ 95 |
| Deploy | On `main` only, publishes the build that just passed to the `gh-pages` branch |

The Playwright report and Lighthouse reports are attached to each run as artifacts.

### What the Playwright suite covers ([`tests/`](tests))

- **Page health**: no console errors or failed requests, no sideways scrolling on phones, the
  page always opens at the top.
- **SEO & sharing**: title, description, canonical URL, link-preview card, schema.org data,
  and that the résumé, preview image, captions, robots.txt and sitemap are served.
- **Navigation**: every menu link reaches its section, the current section is marked, the
  mobile menu opens/closes (including Escape), and the skip link is first for keyboard users.
- **Interactions**: résumé download name, email copy, skills filter and screen-reader
  announcements, the work accordion, the ID card flipping from the keyboard, and the phone
  number staying out of the page source until a visitor asks for it.
- **Intro video**: sound playback with captions, and a transcript for screen readers.
- **Accessibility**: an axe scan with reduced motion on, so every element is measured in its final state.

Tests import their expectations from [`src/lib/data.ts`](src/lib/data.ts), the same file the
page renders from, so updating content doesn't mean updating tests.

## Running it locally

```bash
npm install
npx playwright install chromium webkit   # once; desktop tests also use your installed Chrome

npm run dev            # http://localhost:3000
npm test               # static build + full Playwright suite
npm run test:e2e       # re-run tests against the existing build
npx @lhci/cli@0.15.1 autorun   # Lighthouse, same budgets as CI
npm run deploy         # manual deploy (CI normally does this)
```

The test server ([`scripts/serve-static.mjs`](scripts/serve-static.mjs)) mimics GitHub Pages:
plain files, folder `index.html`, and `404.html`.

## Content

All copy lives in [`src/lib/data.ts`](src/lib/data.ts), taken from
[`public/resume.pdf`](public/resume.pdf). Components never hard-code text.

Hero media is generated from a source video kept outside the repo:
`npm run assets` (reads `intro.mp4` from the project root; needs ffmpeg and numpy). Captions for
the voiced intro are in [`public/media/hero-full.vtt`](public/media/hero-full.vtt).
