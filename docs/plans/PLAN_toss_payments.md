# Plan: Toss Payments (Test Mode) Integration & Pre-deployment Polish

## Overview
This plan focuses on integrating **Toss Payments** (in Test Mode) to simulate a real payment environment for the "market-core" project. This allows testing the full checkout flow without business registration. Additionally, it covers essential pre-deployment tasks to ensure the application is production-ready (SEO, UX, Error Handling).

## Goals
- **Real Payment Simulation**: Use Toss Payments Widget to handle checkout.
- **Server-side Verification**: Implement payment confirmation logic using Toss API.
- **Production Polish**: Add SEO metadata, error boundaries, and loading states.
- **Verification**: Ensure the build is stable and bug-free.

## Context Map
- **Frontend Payment**: `src/app/checkout/page.tsx`, `src/presentation/hooks/useCheckout.ts`
- **Payment Service**: `src/domain/services/PaymentService.ts`, `src/data/services/TossPaymentService.ts` (New)
- **Server API**: `src/app/api/payments/confirm/route.ts` (New)
- **Order Success**: `src/app/order-success/page.tsx`
- **Global Layout/SEO**: `src/app/layout.tsx`, `src/app/error.tsx` (New), `src/app/loading.tsx` (New), `src/app/not-found.tsx` (New)

## Architecture Decisions
- **Toss Payments Widget**: Chosen for ease of integration and modern UI.
- **Test Mode Keys**: Using `test_ck_...` and `test_sk_...` environment variables.
- **Payment Flow**:
    1. User clicks "Payment" -> Toss Widget opens.
    2. User authorizes payment (Test environment).
    3. Widget redirects to `/order-success` (or internal callback).
    4. Server confirms payment via Toss API `confirm` endpoint.
    5. Order is created/finalized in the system.

## Risks
| Risk | Probability | Impact | Mitigation |
| :--- | :--- | :--- | :--- |
| **Payment Verification Fail** | Medium | High | Robust error handling in API route; clearly show failure reason to user. |
| **API Key Exposure** | Low | High | Ensure `TOSS_SECRET_KEY` is ONLY used server-side; Client Key is public. |
| **Build Errors** | Medium | Medium | Run `npm run build` locally before any "deployment" assumption. |

---

## Phase 1: Toss Payments Widget Integration (Frontend)
**Goal:** Display the Toss Payments widget on the checkout page and handle the initial payment request.

- [ ] **Setup**: Install `@tosspayments/payment-widget-sdk`.
- [ ] **Env**: Add `NEXT_PUBLIC_TOSS_CLIENT_KEY` and `TOSS_SECRET_KEY` to `.env.local`.
- [ ] **Service**: Create `src/data/services/TossPaymentService.ts` implementing `PaymentService`.
    *   *Note:* The interface might need adjustment if `processPayment` implies synchronous completion. Toss Widget is asynchronous (redirects). We might need a `requestPayment` method or adapt the existing flow.
- [ ] **UI**: Update `src/app/checkout/page.tsx` to render the Payment Widget.
- [ ] **Hook**: Refactor `useCheckout.ts` to use `TossPaymentService` or handle the widget logic directly.

**Quality Gate:**
- [ ] `npm run dev` starts without errors.
- [ ] Checkout page displays the Toss Payment UI (even if mock).
- [ ] "Pay" button triggers the Toss Payment popup/overlay.

## Phase 2: Payment Confirmation & Order Processing (Server)
**Goal:** Handle the redirect from Toss Payments, verify the payment server-side, and create the order.

- [ ] **API Route**: Create `src/app/api/payments/confirm/route.ts`.
    *   Receives `paymentKey`, `orderId`, `amount`.
    *   Calls Toss API `https://api.tosspayments.com/v1/payments/confirm`.
    *   On success: Creates Order in `OrderRepository`.
- [ ] **Success Page**: Update `src/app/order-success/page.tsx` to handle the redirection state (loading while confirming).
    *   Should fetch verification result from the API or receive the result.
- [ ] **Fail Page**: Create `src/app/checkout/fail/page.tsx` for payment failures.
- [ ] **Refactor**: Ensure `CreateOrderUseCase` can be triggered *after* payment confirmation (or atomically).

**Quality Gate:**
- [ ] Full payment flow works in Test Mode.
- [ ] Order is saved in repository after success.
- [ ] "Payment Failed" scenario redirects to fail page.

## Phase 3: Pre-deployment Polish (SEO & UX)
**Goal:** Make the application look and feel professional.

- [ ] **SEO**: Update `src/app/layout.tsx` with `metadata` (Title, Description, Open Graph).
- [ ] **Icons**: Add `favicon.ico` or `icon.png`.
- [ ] **Error Handling**: Create `src/app/error.tsx` (Global Error), `src/app/not-found.tsx` (404), `src/app/loading.tsx` (Global Loading).
- [ ] **Build**: Run `npm run build` and fix any type/lint errors.
- [ ] **Smoke Test**: Manual verification of the built application (`npm start`).

**Quality Gate:**
- [ ] `npm run build` passes with exit code 0.
- [ ] All pages have correct titles/metadata.
- [ ] 404 page works.
