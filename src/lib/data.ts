/**
 * Single source of content for the site. Everything here is taken from resume.pdf.
 * When the résumé changes, update this file — components never hard-code copy.
 */
import type { IconKey } from "./icons";
import { asset } from "./asset";

/* ───────────────────────────── Profile ───────────────────────────── */

export const PROFILE = {
  name: "Prasad Rao",
  firstName: "Prasad",
  headline: "Senior SDET & QA Automation Engineer",
  currentTitle: "QA Engineer",
  currentCompany: "Comcast",
  currentSince: "April 2026",
  location: "Philadelphia, PA",
  email: "polsaniprasadrao22@gmail.com",
  phone: "+1 (214) 836-0833",
  phoneHref: "tel:+12148360833",
  resume: asset("/resume.pdf"),
  careerStart: "2016",
  intro:
    "10+ years building scalable, maintainable automation frameworks with Selenium WebDriver, Cypress and Playwright — in JavaScript and TypeScript, across web, mobile, API and media-streaming platforms.",
  summary: [
    "10+ years of QA Automation Engineering experience with strong expertise in Selenium WebDriver, Cypress and Playwright — building scalable, maintainable frameworks using JavaScript and TypeScript with POM, Data-Driven and Hybrid design patterns in Agile/Scrum environments.",
    "At Comcast I built AI agents for QA using GitHub Copilot integrated with the client’s MCP server: one reads Cucumber and Playwright test reports to pinpoint why each test failed and recommend the fix, another generates test scenarios from user stories and acceptance criteria.",
    "Hands-on with media and streaming applications — video playback pipelines, adaptive bitrate (ABR) streaming, HLS/DASH stream integrity, OTT workflows, CDN content delivery and DRM license validation.",
  ],
  education: {
    degree: "B.Tech – Electrical & Electronics Engineering",
    short: "B.Tech EEE",
    school: "JNTU",
    place: "Hyderabad, India",
    score: "76%",
  },
} as const;

export const NAV = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "certifications", label: "Certifications" },
  { id: "experience", label: "Experience" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
] as const;

/* ───────────────────────────── Skills ───────────────────────────── */

export const SKILL_CATEGORIES = [
  { id: "core", label: "Core Automation", short: "Core" },
  { id: "lang", label: "Languages", short: "Lang" },
  { id: "media", label: "Media & Streaming QA", short: "Media" },
  { id: "api", label: "API Testing", short: "API" },
  { id: "bdd", label: "BDD", short: "BDD" },
  { id: "perf", label: "Performance", short: "Perf" },
  { id: "cicd", label: "CI/CD & Cloud", short: "CI/CD" },
  { id: "mon", label: "Monitoring", short: "Mon" },
] as const;

export type SkillCategoryId = (typeof SKILL_CATEGORIES)[number]["id"];

/** Company keys used to associate skills with roles. */
export type Org = "comcast" | "verizon" | "5y" | "hot" | "vensai";

export const ORG_LABEL: Record<Org, string> = {
  comcast: "Comcast",
  verizon: "Verizon",
  "5y": "5Y Business Solutions",
  hot: "Helen of Troy",
  vensai: "Vensai Technologies",
};

export type SkillElement = {
  symbol: string;
  name: string;
  category: SkillCategoryId;
  /** simple-icons logo; omitted when no official mark is available (monogram is shown). */
  icon?: IconKey;
  /** Brand colour for monogram tiles without an icon. */
  tint?: string;
  note: string;
  usedAt: Org[];
};

export type SkillGroup = { category: SkillCategoryId; items: SkillElement[] };

const el = (
  symbol: string,
  name: string,
  category: SkillCategoryId,
  note: string,
  usedAt: Org[],
  icon?: IconKey,
  tint?: string,
): SkillElement => ({ symbol, name, category, note, usedAt, icon, tint });

export const SKILL_GROUPS: SkillGroup[] = [
  {
    category: "core",
    items: [
      el("Pw", "Playwright", "core", "TypeScript/JavaScript · Chromium, Firefox, WebKit · AI-assisted self-healing locators", ["comcast", "verizon", "5y"], undefined, "#2EAD33"),
      el("Cy", "Cypress", "core", "JavaScript/TypeScript · API mocking, network interception, full E2E journeys", ["verizon", "5y", "hot"], "cypress"),
      el("Se", "Selenium WebDriver", "core", "Java/JavaScript · POM, Data-Driven and Hybrid frameworks", ["verizon", "5y", "hot"], "selenium"),
      el("Sg", "Selenium Grid", "core", "Parallel, cross-browser execution on Chrome, Firefox, Safari and Edge", ["verizon", "5y", "hot"], "selenium"),
      el("Ap", "Appium", "core", "Android/iOS mobile automation with Xcode, Android Studio and ADB log analysis", ["verizon", "5y", "hot"], "appium"),
      el("Mc", "MCP", "core", "Model Context Protocol — AI QA agents wired into the client’s MCP server", ["comcast"], "mcp"),
      el("Gc", "GitHub Copilot", "core", "Agents for failure analysis and scenario generation", ["comcast"], "copilot"),
      el("Uf", "QTP/UFT", "core", "Data-driven tests with VBScript and descriptive programming", ["vensai"], undefined, "#0073E7"),
    ],
  },
  {
    category: "lang",
    items: [
      el("Js", "JavaScript", "lang", "Primary language", ["comcast", "verizon", "5y", "hot"], "javascript"),
      el("Ts", "TypeScript", "lang", "Primary language", ["verizon", "hot"], "typescript"),
      el("Ja", "Java", "lang", "Selenium WebDriver frameworks with TestNG and Maven", ["5y", "hot"], "java"),
      el("Py", "Python", "lang", "Part of the Comcast technology stack", ["comcast"], "python"),
      el("Sq", "SQL", "lang", "Advanced SQL, table joins and stored procedures on Oracle, SQL Server, PostgreSQL", ["verizon", "5y", "hot", "vensai"], undefined, "#336791"),
      el("Vb", "VBScript", "lang", "QTP/UFT data-driven automation", ["vensai"], undefined, "#4B4B4B"),
    ],
  },
  {
    category: "media",
    items: [
      el("Ab", "Adaptive Bitrate", "media", "ABR validation and bitrate switching", ["verizon"]),
      el("Hd", "HLS / DASH", "media", "Stream integrity verification", ["verizon"]),
      el("Ot", "OTT Platforms", "media", "OTT platform workflows", ["verizon"]),
      el("Cd", "CDN Delivery", "media", "CDN request/response integrity via network interception", ["verizon"]),
      el("Dr", "DRM License", "media", "DRM license validation", ["verizon"]),
      el("Pb", "Playback & Buffering", "media", "Video playback pipelines and buffering analysis", ["verizon"]),
    ],
  },
  {
    category: "api",
    items: [
      el("Pm", "Postman", "api", "REST endpoint validation and stub services for payment processors", ["verizon", "5y", "hot"], "postman"),
      el("Ra", "REST Assured", "api", "JSON/XML payloads, headers and status codes", ["verizon", "5y", "hot"], undefined, "#4E9A06"),
      el("Gq", "GraphQL", "api", "REST/SOAP/GraphQL endpoint validation", ["verizon"], "graphql"),
      el("Br", "Bruno", "api", "Request/response payloads, status codes and error handling", ["comcast"], "bruno"),
      el("Ni", "Network Interception", "api", "API mocking and stubbing in Cypress and Playwright", ["verizon"]),
    ],
  },
  {
    category: "bdd",
    items: [
      el("Cu", "Cucumber", "bdd", "Selenium-Cucumber and Cypress-Cucumber frameworks in Jenkins CI/CD", ["comcast", "verizon", "5y", "hot"], "cucumber"),
      el("Gk", "Gherkin", "bdd", "Business-aligned feature files", ["5y", "hot"], "cucumber"),
      el("Jn", "Jasmine", "bdd", "Listed in technical skills", [], "jasmine"),
      el("Mo", "Mocha", "bdd", "Listed in technical skills", [], "mocha"),
      el("Je", "Jest", "bdd", "Listed in technical skills", [], "jest"),
    ],
  },
  {
    category: "perf",
    items: [
      el("Jm", "JMeter", "perf", "Load, stress and endurance tests for checkout, booking and payment APIs", ["verizon", "5y", "hot"], "jmeter"),
      el("Al", "Azure Load Testing", "perf", "Cloud-based performance validation on AWS and Azure", ["5y"], undefined, "#0078D4"),
      el("Nr", "New Relic APM", "perf", "Transaction traces and error rates correlated with test runs", ["verizon", "5y"], "newrelic"),
      el("Gf", "Grafana", "perf", "SLA and throughput validation", [], "grafana"),
    ],
  },
  {
    category: "cicd",
    items: [
      el("Jk", "Jenkins", "cicd", "Quality gates, nightly regression and parallel runs", ["comcast", "verizon", "5y", "hot"], "jenkins"),
      el("Ga", "GitHub Actions", "cicd", "CI/CD-driven regression pipelines", ["verizon", "5y"], "githubactions"),
      el("Ad", "Azure DevOps", "cicd", "Continuous regression for React storefronts", ["hot"], undefined, "#0078D7"),
      el("Gt", "Git", "cicd", "Version control workflows", ["comcast", "verizon", "5y", "hot"], "git"),
      el("Mv", "Maven", "cicd", "Build tooling for Selenium/TestNG frameworks", ["5y", "hot"], "maven"),
      el("Dk", "Docker", "cicd", "Containerized environments", ["hot"], "docker"),
      el("K8", "Kubernetes", "cicd", "Microservices and containerized environments", [], "kubernetes"),
      el("Aw", "AWS", "cicd", "EC2, S3, Lambda, RDS", ["verizon", "5y"], undefined, "#FF9900"),
      el("Gl", "GitLab", "cicd", "Listed in technical skills", [], "gitlab"),
    ],
  },
  {
    category: "mon",
    items: [
      el("Sp", "Splunk", "mon", "Log search and observability", ["verizon"], "splunk"),
      el("Kb", "Kibana", "mon", "Application logs traced to root cause during triage", ["comcast"], "kibana"),
      el("Dd", "Datadog", "mon", "Listed in technical skills", [], "datadog"),
      el("Am", "Azure Monitor", "mon", "API performance and application health for Epic Will and RoyFi", ["5y"], undefined, "#0078D4"),
      el("Ai", "Application Insights", "mon", "Listed in technical skills", [], undefined, "#68217A"),
    ],
  },
];

/* ───────────────────────────── Work ───────────────────────────── */

export type Project = {
  id: string;
  org: string;
  period: string;
  title: string;
  description: string;
  features: string[];
  stack: string[];
  ui: "agents" | "player" | "hybrid" | "commerce";
};

export const PROJECTS: Project[] = [
  {
    id: "comcast-agents",
    org: "Comcast",
    period: "2026 — Present",
    title: "AI Test Failure Analysis & Scenario Generator Agents",
    description:
      "Two AI agents for QA, built with GitHub Copilot integrated with the client’s MCP server. One reads Cucumber and Playwright test reports to pinpoint why each test failed and recommend the fix; the other generates test scenarios from user stories and acceptance criteria.",
    features: [
      "Reads Cucumber & Playwright test reports",
      "Pinpoints the exact reason each test failed",
      "Recommends the fix for every failure",
      "Separates product defects from environment and script issues",
      "Generates scenarios from user stories & acceptance criteria",
      "Widens coverage of edge cases and cuts manual triage time",
    ],
    stack: ["GitHub Copilot", "MCP", "Playwright", "Cucumber", "Python/JavaScript", "Jenkins"],
    ui: "agents",
  },
  {
    id: "verizon-streaming",
    org: "Verizon",
    period: "2025 — 2026",
    title: "Streaming & OTT Media Playback Automation",
    description:
      "Scalable automation frameworks in Selenium WebDriver, Cypress and Playwright for Verizon’s media streaming and OTT platform — validating playback pipelines, ABR streaming, HLS/DASH integrity, CDN delivery and DRM licensing across web and mobile.",
    features: [
      "Adaptive bitrate & HLS/DASH stream integrity",
      "CDN request/response assertions via network interception",
      "DRM license validation",
      "Cross-browser: Chromium, Firefox, WebKit, Edge",
      "Self-healing locators: 60% fewer flaky tests",
      "40% faster regression execution",
    ],
    stack: ["Playwright", "Cypress", "Selenium", "Postman", "REST Assured", "Jenkins", "GitHub Actions"],
    ui: "player",
  },
  {
    id: "5y-hybrid",
    org: "5Y Business Solutions",
    period: "2022 — 2024",
    title: "Multi-Platform Hybrid Automation",
    description:
      "Selenium, Cypress and Appium frameworks built from scratch for fintech, legal-tech and rental-booking clients — RoyFi, Epic Will and the LDV booking engine — with hybrid UI + API workflows that check every front-end action reaches the backend.",
    features: [
      "RoyFi: credit & repayment workflows",
      "Epic Will: will creation across all 50 states",
      "LDV: search, availability, blackout periods, refunds",
      "Hybrid UI + API with Cypress and Postman",
      "Integration defects caught 3 sprints earlier",
      "Selenium Grid parallel runs on Chrome, Firefox, Edge",
    ],
    stack: ["Selenium", "Cypress", "Appium", "Postman", "JMeter", "Cucumber", "Jenkins"],
    ui: "hybrid",
  },
  {
    id: "hot-commerce",
    org: "Helen of Troy",
    period: "2018 — 2022",
    title: "Multi-Channel eCommerce E2E Test Suite",
    description:
      "Selenium and Cypress coverage for a multi-channel eCommerce platform — catalog, cart, checkout, payment gateways, promotional engines, coupon logic and order management — running continuously in Azure DevOps.",
    features: [
      "Catalog → cart → checkout → order management",
      "90% of REST API tests automated",
      "30% less API validation time",
      "99% response accuracy on payment APIs",
      "Appium mobile regression at 80% coverage",
      "Cross-browser on Chrome, Firefox, Safari, Edge",
    ],
    stack: ["Selenium", "Cypress", "REST Assured", "Postman", "JMeter", "Appium", "Azure DevOps"],
    ui: "commerce",
  },
];

/* ─────────────────────────── Certifications ─────────────────────────── */

export const CERTIFICATIONS = [
  { title: "ISTQB Certified Tester — Foundation Level", tag: "CTFL", issuer: "ISTQB" },
  { title: "LambdaTest Certified Professional — Test Automation", tag: "Automation", issuer: "LambdaTest" },
  { title: "Claude Code 101", tag: "AI", issuer: "Anthropic" },
  { title: "Claude Code in Action", tag: "AI", issuer: "Anthropic" },
  { title: "Introduction to Model Context Protocol (MCP)", tag: "Oct 2026", issuer: "Anthropic · Claude Academy" },
  { title: "Playwright & Agentic AI: Building Autonomous Test Frameworks", tag: "AI", issuer: "" },
] as const;

/* ───────────────────────────── Experience ───────────────────────────── */

export type Role = {
  org: string;
  title: string;
  place: string;
  period: string;
  highlights: string[];
  stack: string[];
};

/** Oldest first — the timeline reads top-to-bottom through time. */
export const EXPERIENCE: Role[] = [
  {
    org: "Vensai Technologies Pvt. Ltd.",
    title: "Software Test Engineer",
    place: "Hyderabad, India",
    period: "June 2016 – July 2018",
    highlights: [
      "System, integration, GUI, functional and regression testing for healthcare and enterprise web apps.",
      "Data-driven QTP/UFT automation in VBScript for eligibility, provider lookup and benefit verification.",
      "HIPAA compliance testing — PHI masking, role-based access and authentication controls.",
    ],
    stack: ["QTP/UFT", "VBScript", "SQL Server", "HP ALM", "Bugzilla"],
  },
  {
    org: "Helen of Troy",
    title: "QA Automation Tester",
    place: "El Paso, TX",
    period: "July 2018 – February 2022",
    highlights: [
      "Selenium (POM, TestNG, Maven, Log4J) frameworks for a multi-channel eCommerce platform.",
      "Automated 90% of REST API tests — 30% less validation time, 99% response accuracy on payment APIs.",
      "Appium mobile regression at 80% coverage, 20% faster execution.",
    ],
    stack: ["Selenium", "Cypress", "REST Assured", "JMeter", "Azure DevOps", "Appium"],
  },
  {
    org: "5Y Business Solutions",
    title: "QA Automation Engineer",
    place: "Remote — Franklin, TN",
    period: "March 2022 – December 2024",
    highlights: [
      "Clients RoyFi, LDV, Epic Will and Health Rise — fintech, rental, legal-tech and health insurance.",
      "Caught a RoyFi referral-discount defect that would have caused ongoing revenue loss.",
      "Hybrid UI + API automation caught integration defects 3 sprints earlier than manual testing.",
    ],
    stack: ["Selenium", "Cypress", "Playwright", "Postman", "JMeter", "Appium", "New Relic"],
  },
  {
    org: "Verizon",
    title: "QA Automation Engineer",
    place: "Remote",
    period: "February 2025 – March 2026",
    highlights: [
      "Automation for the media streaming & OTT platform — ABR, HLS/DASH, CDN and DRM validation.",
      "AI-assisted Playwright techniques: 60% fewer flaky failures, 40% faster regression.",
      "Mentored 5+ QA engineers on Cypress and Playwright framework standards.",
    ],
    stack: ["Playwright", "Cypress", "Selenium", "Postman", "Jenkins", "GitHub Actions"],
  },
  {
    org: "Comcast",
    title: "QA Engineer",
    place: "Philadelphia, PA",
    period: "April 2026 – Present",
    highlights: [
      "Built AI agents for test-failure analysis and scenario generation with GitHub Copilot + MCP.",
      "Owned QA for the OTP authentication launch — shipped with no post-release defects.",
      "Caught a critical Okta duplicate-cookie/session defect before it reached production; mentor to 6 QA engineers.",
    ],
    stack: ["Playwright", "Cucumber", "GitHub Copilot", "MCP", "Okta", "Kibana", "Bruno"],
  },
];

export const EDUCATION = [
  {
    degree: PROFILE.education.degree,
    school: "JNTU",
    place: PROFILE.education.place,
    score: PROFILE.education.score,
  },
] as const;

/* ───────────────────────────── Achievements ───────────────────────────── */

export const ACHIEVEMENTS = [
  { value: 10, prefix: "", suffix: "+", label: "Years experience", detail: "In QA Automation & SDET" },
  { value: 60, prefix: "", suffix: "%", label: "Reduction in flaky tests", detail: "Playwright AI-assisted, self-healing locators" },
  { value: 40, prefix: "", suffix: "%", label: "Faster regression", detail: "Execution cycles with intelligent retries" },
  { value: 90, prefix: "", suffix: "%", label: "REST API tests automated", detail: "REST Assured & Postman at Helen of Troy" },
  { value: 0, prefix: "", suffix: "", label: "Post-release defects", detail: "On the OTP authentication rollout at Comcast" },
] as const;

/** A few résumé figures for the back of the ID card. */
export const CARD_STATS = [
  { value: "60%", label: "fewer flaky tests" },
  { value: "40%", label: "faster regression" },
  { value: "90%", label: "API tests automated" },
  { value: "6", label: "QA engineers mentored" },
] as const;
