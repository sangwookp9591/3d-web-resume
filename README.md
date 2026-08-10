# 3d-web-resume

박상욱(iron)의 엔지니어링 스토리를 **스크롤로 날아다니는 하늘 위 세계**로 만든 이력서 사이트.

스크롤이 카메라를 움직입니다. 미리 렌더한 카메라 비행 영상을 스크롤 위치로 스크럽해서,
구름 위에 떠 있는 다섯 개의 섬 안으로 차례로 날아 들어갑니다. 각 섬은 실제 기여 사례
하나씩이고, 마스코트 **Ai-ng(아잉)** 이 지금 보고 있는 장면을 설명합니다.

## 다섯 개의 섬

| 섬 | 은유 | 담긴 이력 |
|---|---|---|
| 기원 | 씨앗등에서 14갈래 리본이 뻗는 파빌리온 | Front 0→1 · 14개 언어 · QR 주문·결제 |
| 검증 | 캡슐이 트랙을 도는 밀폐 검사동 | 결제 E2E 하네스 · 플레이크 0 |
| 규율 | 서로 다른 구멍의 문 다섯 개 | RBAC 하이브리드 권한 · 공통 인프라 |
| 지능 | 등불 셋 중 하나가 꺼진 천문대 | OpenSearch 재색인 · 멀티 LLM fallback |
| 정합성 | 일방향 문을 지나는 동전 수로 | 쿠폰 DDD/Hexagonal · Outbox |

## Ai-ng 캐릭터 킷

마스코트를 페이지 장식이 아니라 **재사용 가능한 에셋**으로 만들었습니다.
`public/mascot/` 아래에 있고, `aing-kit.json` 매니페스트 하나로 전부 기술됩니다.

| 항목 | 내용 |
|---|---|
| 표정 | 16종 · 알파 컷아웃 WebP |
| 액션 | 16종 · 알파 컷아웃 WebP |
| 모션 | 6종 · 알파 애니메이션 WebP (+ PNG 시퀀스, zip 동봉) |
| 아틀라스 | 256px 균일 그리드 · WebP(웹) + PNG(엔진) + TextureAtlas JSON |
| 3D | `aing.glb` 1.19MB · `aing-lite.glb` 200KB (meshopt) |

- **Phaser / PixiJS** — `sheets/aing-<set>.json`을 TextureAtlas(hash)로 로드
- **Unity** — `sheets/aing-<set>.png`, Sprite Mode = Multiple, Grid By Cell Size 256×256
- **three.js / WebGPU** — 아틀라스는 `(i % cols, floor(i / cols))`로 인덱싱, GLB는 `MeshoptDecoder` 등록 후 `GLTFLoader`

## 성능

- 초기 번들 **74KB gzip**. three.js는 캐릭터 킷 섹션이 뷰포트에 들어온 뒤에만 로드
- WebGPU 지원 시 `three/webgpu`, 아니면 `three` — **한쪽만** 받음 (둘 다 받으면 190KB gzip 중복)
- 3D 원본 54.44MB → **1.19MB** (gltf-transform: simplify + meshopt + 텍스처 WebP)
- 클립은 crf26/GOP10 720p (3MB/개), 스크럽은 Blob 로드로 byte-range 의존 제거
- Lighthouse(mobile) 접근성·베스트프랙티스·SEO·에이전틱 **모두 100**, LCP 342ms, CLS 0.00

## 스택

- Vite 7 + React 19 (SSR이 필요 없는 단일 페이지라 정적 빌드)
- scroll-world 스크럽 엔진 (의존성 0의 바닐라 JS, 클립을 Blob으로 로드해 seek 보장)
- 씬/영상: Higgsfield `gpt_image_2` + `seedance_2_0_mini`, 2D 셀 애니메이션 화풍
- 마스코트 포즈: `nano_banana_2`, 원본 Ai-ng를 레퍼런스로 정체성 고정

## 개발

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/
```

## 에셋 파이프라인

`.world/`(git 제외)에 원본이 있고, 아래 스크립트가 `public/`으로 굽습니다.

```bash
python3 .world/prep_assets.py                          # 씬 -> webp 포스터
python3 .world/build_sky.py s4.png 0.80 1.0            # 씬의 하늘 열을 거울 타일링해 배경 파노라마
bash .world/encode.sh                                  # 클립 -> crf26/GOP10, faststart, 무음

bash .world/kit.sh                                     # 표정 16 + 액션 16 (nano_banana_2_lite)
python3 .world/knockout.py IN.png OUT.webp --white     # 흰 배경 녹아웃 (--checker 모드도 있음)
bash .world/motion.sh                                  # 모션 6종 (seedance, 흰 배경 고정 카메라)
python3 .world/build_motion.py kit/motion/idle.mp4 --pingpong --fps 10 --size 256 --seconds 3
python3 .world/build_kit.py                            # 아틀라스 + 매니페스트 + zip
npx gltf-transform optimize in.glb out.glb --compress meshopt --texture-compress webp \
  --texture-size 2048 --simplify true --simplify-error 0.0002
```

## 사실 정확성

숫자는 전부 세 저장소(ZIVO_FRONT/ADMIN/BACK)의 git 이력 분석에서 나온 실측치입니다.
지어낸 지표는 없습니다.
