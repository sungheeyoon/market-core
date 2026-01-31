# Implementation Plan: Navigation Bar Pages

**Status**: 🔄 In Progress
**Started**: 2026-01-11
**Last Updated**: 2026-01-11
**Estimated Completion**: 2026-01-13

---

**⚠️ CRITICAL INSTRUCTIONS**: After completing each phase:
1. ✅ Check off completed task checkboxes
2. 🧪 Run all quality gate validation commands
3. ⚠️ Verify ALL quality gate items pass
4. 📅 Update "Last Updated" date above
5. 📝 Document learnings in Notes section
6. ➡️ Only then proceed to next phase

⛔ **DO NOT skip quality gates or proceed with failing checks**

---

## 📋 Overview

### Feature Description
현재 메인 페이지(`Catalog`) 외에 Nav Bar에 링크로만 존재하는 `New Arrivals`, `Editorial`, `Sale` 페이지를 구현합니다. 이를 위해 공통 헤더 컴포넌트를 분리하고, 각 페이지의 성격에 맞는 데이터 필터링(신상품, 할인상품) 및 레이아웃을 적용합니다.

### Success Criteria
- [ ] Nav Bar의 모든 링크(New Arrivals, Editorial, Sale)가 실제 페이지로 연결됨
- [ ] `New Arrivals`: 최신 등록순으로 상품이 정렬되어 표시됨
- [ ] `Sale`: 할인 중인 상품만 필터링되어 표시됨
- [ ] `Editorial`: 브랜드 스토리 또는 아티클 형태의 콘텐츠 페이지 구현
- [ ] 공통 `Header` 컴포넌트가 모든 페이지에서 일관되게 동작함

---

## 🏗️ Architecture Decisions

| Decision | Rationale | Trade-offs |
|----------|-----------|------------|
| **Shared Header Component** | 코드 중복을 줄이고 유지보수성을 높이기 위해 Nav Bar를 별도 컴포넌트로 분리 | 초기 리팩토링 비용 발생 |
| **Filter-based Listing** | 별도의 리스트 컴포넌트를 만들지 않고, 기존 `ProductList`와 `useProductCatalog`에 필터/정렬 옵션을 추가하여 재사용 | UseCase 로직이 다소 복잡해질 수 있음 |

---

## 🚀 Implementation Phases

### Phase 1: Routing & Header Refactoring
**Goal**: 페이지 라우팅 구조 생성 및 헤더 컴포넌트 공통화
**Estimated Time**: 2 hours
**Status**: ✅ Complete

#### Tasks
- [x] **Task 1.1**: `src/presentation/components/Header.tsx` 생성 및 기존 Nav Bar 코드 이관
- [x] **Task 1.2**: `app/layout.tsx`에 `Header` 및 `CartProvider` 적용
- [x] **Task 1.3**: `new-arrivals`, `editorial`, `sale` 폴더 생성 및 빈 페이지 라우팅 연결

#### Quality Gate ✋
- [x] 모든 페이지에서 헤더가 정상적으로 표시되고 링크 클릭 시 URL이 변경됨
- [x] `npm run build` 성공

---

### Phase 2: Domain Logic Expansion (Sort & Filter)
**Goal**: 상품 정렬 및 필터링 기능 강화 (신상품, 세일)
**Estimated Time**: 3 hours
**Status**: ✅ Complete

#### Tasks
- [x] **Task 2.1**: `GetProductsUseCase` 및 Repository에 `sortBy`, `filter` 옵션 추가
- [x] **Task 2.2**: `MockProductRepository` 및 DataSource에 `createdAt`, `discountPrice` 필드 추가 및 로직 구현
- [x] **Task 2.3**: `Product` 엔티티에 할인 관련 Getter 추가 (`isOnSale`)

#### Quality Gate ✋
- [x] `GetProductsUseCase` 관련 필터링 로직 구현 완료

---

### Phase 3: Listing Pages Implementation (New Arrivals & Sale)
**Goal**: 신상품 및 세일 페이지 UI 구현
**Estimated Time**: 3 hours
**Status**: ✅ Complete

#### Tasks
- [x] **Task 3.1**: `New Arrivals` 페이지에서 `useProductCatalog({ sortBy: 'newest' })` 호출 구현
- [x] **Task 3.2**: `Sale` 페이지에서 `useProductCatalog({ onSale: true })` 호출 구현
- [x] **Task 3.3**: `ProductCard`에 할인 가격(취소선) 표시 및 Sale 배지 로직 추가

#### Quality Gate ✋
- [x] New Arrivals 페이지 진입 시 최신 상품 순 표시 확인
- [x] Sale 페이지 진입 시 할인 상품만 표시 확인

---

### Phase 4: Editorial Page & Final Polish
**Goal**: 에디토리얼 페이지 구현 및 최종 점검
**Estimated Time**: 2 hours
**Status**: ✅ Complete

#### Tasks
- [x] **Task 4.1**: `Editorial` 페이지 정적 레이아웃 구현 (이미지 + 텍스트 그리드)
- [x] **Task 4.2**: Nav Bar 활성 상태(Active State) 및 검색 연동 구현
- [x] **Task 4.3**: 전체 빌드 및 라우팅 점검 완료

#### Quality Gate ✋
- [x] 전체 빌드(npm run build) 성공
- [x] 모든 페이지 디자인 일관성 확인

---

## 📊 Progress Tracking

### Completion Status
- **Phase 1**: ✅ 100%
- **Phase 2**: ✅ 100%
- **Phase 3**: ✅ 100%
- **Phase 4**: ✅ 100%

**Overall Progress**: 100% complete
