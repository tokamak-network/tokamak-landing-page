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
