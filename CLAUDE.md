# Tokamak Landing Page — Project Instructions

## Harness Evaluation (Visual QA)

UI 컴포넌트(src/app/components/ui/sections/, src/app/components/ui/header/, src/app/components/ui/footer/)를 수정한 후, 커밋 전에 반드시 하네스 평가를 실행하라:

```bash
node .omc/harness/evaluate.mjs
```

실행 후:
1. 리포트 JSON에서 콘솔 에러, 접근성 이슈 확인
2. 변경된 층의 desktop/mobile 스크린샷을 읽어서 시각적으로 검증
3. 문제가 발견되면 수정 후 재실행
4. 문제가 없으면 커밋 진행

dev 서버(localhost:3000)가 실행 중이어야 한다. 실행 중이 아니면 사용자에게 알린다.

## Biweekly Report Update

2주마다 새 biweekly report HTML이 나오면 아래 절차를 따른다.

### 1. 리포트 파일 추가

```bash
# 사용자의 Downloads 폴더에서 복사 (파일명은 상황에 맞게)
cp ~/Downloads/biweekly#N.html public/reports/report-YYYY-MM-DD-DD.html
```

- 파일명 규칙: `report-{year}-{month}-{startDay}-{endDay}.html`
- 예: 2026년 3월 16~31일 → `report-2026-03-16-31.html`
- `listReports.ts`가 파일명을 자동 파싱하므로 정확한 네이밍 필수

### 2. Placeholder 설명 업데이트

리포트에 description이 없는 repo는 `"{name} component"`로 표시된다. 이를 확인하고 `REPO_DESCRIPTIONS` 맵에 추가:

1. 새 리포트에서 placeholder 찾기:
   ```bash
   grep 'repo-desc">[^<]*component' public/reports/report-YYYY-MM-DD-DD.html
   ```

2. 기존 맵에 없는 항목 확인:
   - 파일: `src/app/lib/ecosystem-data.ts`
   - 객체: `REPO_DESCRIPTIONS`

3. 새 항목 추가 시:
   - 리포트 HTML 내 해당 repo의 **Key Accomplishments** 섹션을 참고하여 정확한 설명 작성
   - 이름만 보고 추측하지 말 것 — 반드시 리포트 내용 기반으로 작성
   - 60자 이내, 영문

### 3. 검증

```bash
# 타입체크
npx tsc --noEmit

# 린트
npm run lint

# dev 서버에서 확인 (localhost:3000)
# - Ecosystem Nexus 캐러셀에 새 프로젝트가 반영되었는지
# - 카드에 "component" placeholder가 남아있지 않은지
# - 프로젝트 수(N projects · M categories)가 늘었는지
```

### 4. 커밋

```
feat: add Biweekly Report #N (Month DD-DD, YYYY)
```

### 참고

- `getEcosystemData()`는 최근 2개 리포트를 머지한다 (`src/app/lib/ecosystem-data.ts`)
- 중복 repo는 하나로 카운팅, 코드 변경량은 합산, 높은 activity 유지
- 리포트 파싱은 HTML comment marker 기반: `<!-- STATS BAR -->`, `<!-- ECOSYSTEM LANDSCAPE -->` 등

## Tech Stack

- Next.js 15 (App Router, Turbopack)
- React Three Fiber + Three.js (3D elements)
- Framer Motion (animations)
- Tailwind CSS
- TypeScript (strict mode)

## Design Language

- FUI (Futuristic User Interface) aesthetic
- Primary accent: cyan #00e5ff
- Typography: Orbitron (headers), Share Tech Mono (body/mono)
- Dark theme with glowing effects
- Tower floor metaphor: each section is a floor with background image + interactive overlay
