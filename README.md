# 🎭 SDET Playwright Automation Framework

> Enterprise-grade SDET automation framework built with **Playwright + TypeScript** — covering UI, API, and E2E testing with full CI/CD integration via GitHub Actions.

[![CI Pipeline](https://github.com/YOUR_USERNAME/sdet-playwright-automation-framework/actions/workflows/playwright.yml/badge.svg)](https://github.com/YOUR_USERNAME/sdet-playwright-automation-framework/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.43-green?logo=playwright)](https://playwright.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📐 Architecture Overview

```
sdet-playwright-automation-framework/
├── .github/
│   └── workflows/
│       └── playwright.yml         # CI/CD pipeline (multi-browser matrix + nightly)
├── fixtures/
│   ├── fixtures.ts                # Custom Playwright fixtures (POM injection)
│   └── auth.setup.ts              # Pre-auth setup — saves storage state
├── pages/                         # Page Object Model
│   ├── BasePage.ts                # Abstract base: click, fill, assert, wait helpers
│   ├── LoginPage.ts               # Login page POM
│   └── DashboardPage.ts           # Products/dashboard POM
├── tests/
│   ├── api/
│   │   └── users.spec.ts          # API: GET, POST, PUT, PATCH, DELETE + schema validation
│   ├── ui/
│   │   └── login.spec.ts          # UI: login flows, error states, accessibility
│   └── e2e/
│       └── purchase-flow.spec.ts  # E2E: full shopping cart + API/UI hybrid test
├── utils/
│   ├── ApiClient.ts               # Typed HTTP client (wraps Playwright APIRequestContext)
│   ├── Logger.ts                  # Structured, color-coded test step logger
│   └── TestDataGenerator.ts       # Random data factory (users, emails, passwords)
├── reports/                       # HTML + JUnit + Allure output
├── playwright.config.ts           # Multi-project config (Chrome, Firefox, Safari, Mobile)
├── tsconfig.json
└── package.json
```

---

## ✨ Key Features

| Feature | Details |
|---|---|
| **Framework** | Playwright 1.43 + TypeScript 5.4 |
| **Test Types** | UI · API · E2E · Hybrid (API + UI in same test) |
| **Design Pattern** | Page Object Model (POM) with BasePage inheritance |
| **Multi-Browser** | Chromium · Firefox · WebKit · Mobile Chrome |
| **API Testing** | Typed `ApiClient` with schema validation, CRUD coverage |
| **CI/CD** | GitHub Actions: parallel jobs, browser matrix, nightly cron |
| **Reporting** | Playwright HTML · JUnit XML · Allure · GitHub Pages publishing |
| **Test Tagging** | `@smoke` · `@regression` · `@api` · `@ui` · `@e2e` |
| **Retries** | Auto-retry on failure in CI (2x) with trace/screenshot/video |
| **Auth Handling** | Storage state saved once, reused across all tests |
| **Environments** | `.env.dev` / `.env.staging` / `.env.prod` via dotenv |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/sdet-playwright-automation-framework.git
cd sdet-playwright-automation-framework

# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install --with-deps
```

### Run Tests

```bash
# All tests
npm test

# By layer
npm run test:api
npm run test:ui
npm run test:e2e

# By tag
npm test -- --grep @smoke
npm test -- --grep @regression

# Specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Debug mode (headed + inspector)
npm run test:debug

# View HTML report
npm run test:report
```

### Environment Setup

```bash
# Copy and configure
cp .env.dev .env.local

# Edit credentials / URLs as needed
nano .env.local

# Run against staging
ENV=staging npm test
```

---

## 🧪 Test Suites

### API Tests (`tests/api/users.spec.ts`)
Tests the [ReqRes](https://reqres.in/) public API — a realistic mock REST API.

| Test | Method | Endpoint | Assertion |
|------|--------|----------|-----------|
| List users with valid schema | GET | `/users?page=1` | 200 + array + field types |
| Single user by ID | GET | `/users/2` | 200 + schema match |
| Non-existent user | GET | `/users/9999` | 404 |
| Create new user | POST | `/users` | 201 + id + createdAt |
| Full update | PUT | `/users/2` | 200 + updatedAt |
| Partial update | PATCH | `/users/2` | 200 + field match |
| Delete user | DELETE | `/users/2` | 204 No Content |
| Register success | POST | `/register` | 200 + token |
| Login missing password | POST | `/login` | 400 + error message |

### UI Tests (`tests/ui/login.spec.ts`)
Tests [Swag Labs](https://www.saucedemo.com/) (Sauce Demo) — a public demo e-commerce app.

- ✅ Page load and element visibility
- ✅ Successful login → redirect
- ✅ Invalid credentials → error message
- ✅ Locked-out user handling
- ✅ Empty username / password validation
- ✅ Page title assertion

### E2E Tests (`tests/e2e/purchase-flow.spec.ts`)
Full end-to-end flows combining UI + API layers.

- ✅ **Complete purchase flow**: Login → View products → Add to cart → Checkout → Confirm order
- ✅ **Product sorting**: Low-to-high price sort with numeric order verification
- ✅ **API + UI hybrid**: API data validation alongside UI state assertions

---

## 🔄 CI/CD Pipeline

The GitHub Actions pipeline runs on every push to `main`/`develop` and nightly:

```
push/PR ──► Setup ──► Lint
                   ├── API Tests ──────────────────────────┐
                   └── UI Tests (Chrome / Firefox / Safari) ──► E2E Tests ──► Publish Report
```

### Pipeline Jobs

| Job | Trigger | Details |
|-----|---------|---------|
| `setup` | Every run | Install deps + cache Playwright browsers |
| `lint` | Every run | TypeScript ESLint |
| `api-tests` | Every run | API layer, no browser needed |
| `ui-tests` | Every run | 3-browser matrix (Chrome, Firefox, Safari) |
| `e2e-tests` | After API + UI pass | Full flow tests on Chromium |
| `publish-report` | Always (even on failure) | Deploys HTML report to GitHub Pages |
| `notify` | On failure | Slack webhook alert |

### Nightly Regression
Full regression suite runs at **2:00 AM UTC** via cron schedule.

### Secrets Required
```
TEST_USERNAME        # Test account username
TEST_PASSWORD        # Test account password  
SLACK_WEBHOOK_URL    # (Optional) Slack notifications
```

---

## 📊 Reporting

Three report formats are generated on every run:

**1. Playwright HTML Report** (interactive, with traces)
```bash
npm run test:report
# Opens: http://localhost:9323
```

**2. JUnit XML** (for Jenkins / Azure DevOps integration)
```
reports/junit/results.xml
```

**3. Allure Report** (rich analytics dashboard)
```bash
npm run allure:generate
npm run allure:open
```

**4. GitHub Pages** (live report on every CI run)
- Automatically deployed via the `publish-report` job
- URL: `https://YOUR_USERNAME.github.io/sdet-playwright-automation-framework`

---

## 🏗️ Design Patterns

### Page Object Model
All UI interactions are encapsulated in page classes under `pages/`. Tests never use raw selectors — they call page methods.

```typescript
// ❌ Anti-pattern — selector leaking into tests
await page.click('[data-test="login-button"]');

// ✅ POM pattern — clean, readable, maintainable
await loginPage.login(username, password);
await dashboardPage.assertDashboardLoaded();
```

### Custom Fixtures
Page objects are injected via Playwright fixtures — no manual `new` calls in tests:

```typescript
test('login works', async ({ loginPage, dashboardPage }) => {
  await loginPage.login('user', 'pass');
  await dashboardPage.assertDashboardLoaded();
});
```

### Typed API Client
All HTTP calls go through the `ApiClient` utility — strongly typed responses, no raw `fetch`:

```typescript
const response = await apiClient.get<UserListResponse>('/users');
apiClient.assertStatus(response, 200);
expect(response.body.data.length).toBeGreaterThan(0);
```

### Data Factory
Test data is never hardcoded — `TestDataGenerator` creates randomized payloads:

```typescript
const user = TestDataGenerator.createUser({ job: 'SDET' });
await apiClient.post('/users', user);
```

---

## 🧰 Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Playwright](https://playwright.dev/) | 1.43 | Browser automation + API testing |
| [TypeScript](https://www.typescriptlang.org/) | 5.4 | Type-safe test code |
| [GitHub Actions](https://github.com/features/actions) | — | CI/CD pipeline |
| [Allure](https://allurereport.org/) | 3.0 | Rich test reporting |
| [dotenv](https://github.com/motdotla/dotenv) | 16 | Environment config |
| [ESLint](https://eslint.org/) | 8 | Code quality |

---

## 📁 Environment Files

| File | Purpose |
|------|---------|
| `.env.dev` | Local development defaults |
| `.env.staging` | Staging environment URLs + credentials |
| `.env.prod` | Production smoke test config |

> **Never commit `.env` files with real credentials.** Use GitHub Secrets in CI.

---

## 👤 Author

**Your Name**  
SDET | QA Automation Engineer  
📧 your.email@example.com  
🔗 [LinkedIn](https://linkedin.com/in/yourprofile)  
🐙 [GitHub](https://github.com/YOUR_USERNAME)

---

## 📄 License

MIT © Your Name
