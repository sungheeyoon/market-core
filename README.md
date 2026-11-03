# Market Core

상품을 둘러보고 장바구니에 담아 토스페이먼츠로 결제까지 하는 쇼핑몰 프로젝트입니다.

[데모](https://market-core-pi.vercel.app)

## 할 수 있는 것

- 메인 · 신상품 · 세일 · 에디토리얼 목록과 상품 상세
- 장바구니와 주문서 작성
- 토스페이먼츠 결제 요청과 서버 승인(`/api/payments/confirm`), 결제 실패 · 완료 화면
- Supabase 로그인과 내 주문 목록

상품은 목 데이터, 장바구니와 주문은 브라우저 localStorage 에 둡니다. 도메인 층의 저장소 인터페이스 뒤에 구현을 두어, 서버 저장소로 바꿀 때 화면과 유스케이스는 그대로 둘 수 있게 했습니다.

## 기술 구성

Next.js (App Router) · React · TypeScript · Tailwind CSS · Supabase · Toss Payments · Jest · Playwright

```text
src/app/           화면과 결제 승인 API
src/domain/        엔티티와 유스케이스
src/data/          저장소 구현 · 외부 서비스 연결
src/presentation/  화면 컴포넌트와 상태
```

## 로컬 실행

```bash
pnpm install
pnpm dev
```

`.env.local` 에 넣는 값:

| 변수 | 용도 |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 공개 키 |
| `NEXT_PUBLIC_TOSS_CLIENT_KEY` | 토스페이먼츠 클라이언트 키 |
| `TOSS_SECRET_KEY` | 토스페이먼츠 시크릿 키 (서버 전용) |

## 확인

```bash
pnpm lint
pnpm test          # Jest
npx playwright test
```
