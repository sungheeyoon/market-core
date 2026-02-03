# Plan: Pre-deployment QA & E2E Testing

## Overview
This plan establishes a comprehensive Quality Assurance (QA) strategy for the "market-core" project before its initial deployment. It focuses on implementing End-to-End (E2E) testing using Playwright to verify critical user journeys and validating the production build integrity.

## Goals
- **Automated Validation**: Ensure the core shopping flow (Browse -> Cart -> Checkout -> Payment) works automatically.
- **Production Readiness**: Verify that the optimized production build (`npm run build`) functions correctly.
- **Mobile Responsiveness**: Test critical flows on mobile viewports.
- **SEO/Metadata Check**: Confirm essential SEO tags are present.

## Context Map
- **E2E Config**: `playwright.config.ts` (New)
- **E2E Tests**: `tests/e2e/` (New Directory)
- **CI/CD**: `package.json` (Scripts update)
- **Critical Pages**: `src/app/page.tsx`, `src/app/checkout/page.tsx`, `src/app/order-success/page.tsx`

## Tools & Architecture
- **Framework**: **Playwright** (Chosen for speed, reliability, and native TypeScript support).
- **Test Environment**:
    - **Local Dev**: Run against `localhost:3000`.
    - **Production Preview**: Run against `npm run start` output.
- **Browsers**: Chromium (Desktop), WebKit (Mobile Safari emulation).

## Risks
| Risk | Probability | Impact | Mitigation |
| :--- | :--- | :--- | :--- |
| **Flaky Tests** | Medium | Medium | Use reliable selectors (`data-testid`) and Playwright's auto-waiting. |
| **Payment Popup Automation** | High | High | We cannot automate the *contents* of the external Toss popup easily. We will test up to the point of *opening* the popup and mocking the redirect/callback if necessary. |
| **Build Failures** | Low | High | Run build locally before any commit. |

---

## Phase 1: E2E Infrastructure Setup
**Goal:** Install and configure Playwright for the project.

- [ ] **Install**: Run `npm init playwright@latest` (or manual install).
- [ ] **Config**: Create/Update `playwright.config.ts`.
    - Set `baseUrl` to `http://localhost:3000`.
    - Configure projects for Desktop Chrome and Mobile Safari.
- [ ] **Scripts**: Add `test:e2e` and `test:e2e:ui` to `package.json`.
- [ ] **Directory**: Ensure `tests/e2e` exists.

**Quality Gate:**
- [ ] `npm run test:e2e` runs (even with 0 tests) without configuration errors.
- [ ] Playwright UI opens successfully.

## Phase 2: Critical User Journey (Happy Path)
**Goal:** Automate the complete shopping flow from Home to Checkout.

- [ ] **Test File**: Create `tests/e2e/checkout-flow.spec.ts`.
- [ ] **Scenario 1: Add to Cart**:
    - Go to Home.
    - Click a product.
    - Click "Add to Cart".
    - Verify Cart Drawer opens and item is listed.
- [ ] **Scenario 2: Checkout Navigation**:
    - Click "Checkout" in Drawer.
    - Verify URL changes to `/checkout`.
- [ ] **Scenario 3: Payment Trigger**:
    - Fill Shipping Address.
    - Fill Contact.
    - Click "Pay" button.
    - **Verification**: Check if Toss Payment script loads/window opens (or mock the `window.TossPayments` for pure automation).
    - *Note:* For E2E, we might intercept the window open event to confirm it triggered.

**Quality Gate:**
- [ ] All critical flow tests pass in Headless mode.
- [ ] Tests pass on both Desktop and Mobile viewports.

## Phase 3: Production Build & Smoke Test
**Goal:** Verify the application works in a production-like environment.

- [ ] **Build**: Run `npm run build`. Fix any TypeScript/Lint errors that block the build.
- [ ] **Start**: Run `npm run start`.
- [ ] **Smoke Test**: Run the E2E suite against the production port (usually 3000).
- [ ] **SEO Check**: Verify `robots.txt` and `<meta>` tags in the production HTML.

**Quality Gate:**
- [ ] `npm run build` exits with code 0.
- [ ] E2E tests pass against the built application.

## Phase 4: Final Polish (Optional/If Needed)
**Goal:** Address any visual or UX issues found during testing.

- [ ] **Mobile Layout**: Fix any overflow issues found during mobile E2E.
- [ ] **Error Pages**: Manually trigger 404 to verify design.

