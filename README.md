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
python3 .world/prep_assets.py                  # 씬 -> webp 포스터, 마스코트 -> 알파 트림 webp
python3 .world/build_sky.py s4.png 0.80 1.0    # 씬의 하늘 열을 거울 타일링해 배경 파노라마
bash .world/encode.sh                          # 클립 -> crf26/GOP10, faststart, 무음
```

## 사실 정확성

숫자는 전부 세 저장소(ZIVO_FRONT/ADMIN/BACK)의 git 이력 분석에서 나온 실측치입니다.
지어낸 지표는 없습니다.
