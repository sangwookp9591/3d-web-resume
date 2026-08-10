<div align="center">

<img src="docs/ai-ng-favicon.png" alt="Ai-ng" width="112" />

# 3d-web-resume

**스크롤이 카메라를 움직이는 이력서.**
구름 위에 떠 있는 다섯 개의 섬 안으로 차례로 날아 들어갑니다.
섬 하나가 실제 기여 사례 하나고, 마스코트 **Ai-ng(아잉)** 이 지금 보고 있는 장면을 설명합니다.

<br />

![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![three.js](https://img.shields.io/badge/three.js-WebGPU-000000?logo=threedotjs&logoColor=white)
![Lighthouse](https://img.shields.io/badge/Lighthouse-100%20×%204-0CCE6B?logo=lighthouse&logoColor=white)
![Bundle](https://img.shields.io/badge/초기%20번들-74KB%20gzip-blue)

<br />

<img src="docs/screens/cover.webp" alt="커버 — 구름 위의 리퀴드 글래스 명함" width="880" />

<img src="docs/screens/expr-strip.webp" alt="Ai-ng 표정 시트" width="880" />

</div>

---

## 어떻게 동작하나

스크롤은 **재생이 아니라 시간축**입니다. 미리 렌더한 카메라 비행 클립을 스크롤 위치로 스크럽해서,
카메라가 진짜로 섬 바깥에서 안으로 날아 들어갑니다. Apple의 스크롤 제품 페이지와 같은 기법입니다.

```
[섬1 다이브] → [커넥터] → [섬2 다이브] → [커넥터] → … → [섬5 다이브]
     ↑ 스크롤 위치 = video.currentTime
```

이음매가 튀지 않는 이유는 **커넥터의 양 끝이 이웃 클립의 실제 렌더 프레임**이기 때문입니다.
원본 스틸을 쓰면 매 생성마다 미세하게 달라져 seam에서 팝이 생깁니다.

<img src="docs/screens/world.webp" alt="규율 — 서로 다른 구멍의 문 다섯 개" />

---

## 다섯 개의 섬

각 섬은 은유가 **그림만으로 읽히도록** 설계했습니다. 사실 전달은 씬 위에 고정되는 카피가 합니다.

| # | 섬 | 무엇이 보이나 | 담긴 이력 |
|:-:|---|---|---|
| 01 | **기원** | 씨앗등에서 14갈래 리본이 부챗살로 뻗는 파빌리온 | Front 0→1 · 14개 언어 · QR 주문·결제 |
| 02 | **검증** | 캡슐차가 트랙을 계속 도는 밀폐 검사동, 똑같이 켜진 램프 10개 | 결제 E2E 하네스 · 플레이크 0 |
| 03 | **규율** | 뚫린 모양이 제각각인 문 다섯 개, 걸러진 구슬이 담기는 바구니 | RBAC 하이브리드 권한 · 공통 인프라 |
| 04 | **지능** | 등불 셋 중 하나가 꺼졌는데 빛 고리가 그 옆으로 우회하는 천문대 | OpenSearch 재색인 · 멀티 LLM fallback |
| 05 | **정합성** | 일방향 문을 하나씩 지나는 동전 수로, 한 개도 새지 않음 | 쿠폰 DDD/Hexagonal · Outbox |

<img src="docs/screens/footprint.webp" alt="저장소 기여도 — 막대 길이가 실제 커밋 점유율" />

> 막대 길이는 연출이 아니라 **실제 커밋 점유율**입니다.

---

## Ai-ng 캐릭터 킷

<img src="docs/screens/pose-strip.webp" alt="Ai-ng 액션 시트" />

마스코트를 페이지 장식이 아니라 **가져다 쓸 수 있는 에셋**으로 만들었습니다.
전부 `public/mascot/` 아래에 있고, 매니페스트 `aing-kit.json` 하나가 전체를 기술합니다.

| 항목 | 내용 |
|---|---|
| 표정 | **16종** · 알파 컷아웃 WebP |
| 액션 | **16종** · 알파 컷아웃 WebP |
| 모션 | **6종** · 알파 애니메이션 WebP (+ PNG 시퀀스, zip 동봉) |
| 아틀라스 | 256px 균일 그리드 · WebP(웹) + PNG(엔진) + TextureAtlas JSON |
| 3D | `aing.glb` **1.19MB** · `aing-lite.glb` **200KB** (meshopt) |

<img src="docs/screens/kit3d.webp" alt="페이지에 임베드된 실시간 3D 뷰어" />

### 엔진별 사용법

<table>
<tr><td><b>Phaser / PixiJS</b></td><td>

```js
this.load.atlas('aing',
  'mascot/sheets/aing-expr.webp',
  'mascot/sheets/aing-expr.json');
```
</td></tr>
<tr><td><b>Unity</b></td><td>

`sheets/aing-<set>.png` 임포트 → Sprite Mode **Multiple** →
Slice **Grid By Cell Size 256×256**, Pivot **Center**
</td></tr>
<tr><td><b>three.js / WebGPU</b></td><td>

```js
// 아틀라스: 프레임 i → (i % cols, floor(i / cols))
// GLB는 meshopt 압축이라 디코더 등록이 필수
new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
  .load('mascot/3d/aing.glb', …);
```
</td></tr>
</table>

<img src="docs/screens/kit-sheets.webp" alt="캐릭터 킷 섹션 — 표정·액션 그리드" />

---

## 성능

| 지표 | 값 |
|---|---|
| 초기 번들 | **74KB gzip** — three.js는 킷 섹션이 뷰포트에 들어온 뒤에만 로드 |
| Lighthouse (mobile) | 접근성 · 베스트프랙티스 · SEO · 에이전틱 **모두 100**, 실패 0건 |
| Core Web Vitals | LCP **342ms** · CLS **0.00** · INP **12ms** · 렌더 블로킹 **0ms** |
| 3D 모델 | 54.44MB → **1.19MB** (simplify + meshopt + 텍스처 WebP) |
| 클립 | 720p crf26/GOP10, 개당 약 3MB · Blob 로드로 byte-range 의존 제거 |

몇 가지 결정:

- **three는 한쪽만 받습니다.** `three/webgpu`는 코어를 재export하므로 `three`와 같이 import하면
  같은 라이브러리를 두 벌(~190KB gzip) 내려받게 됩니다. 엔트리를 먼저 고르고 나서 import합니다.
- **전면 섹션의 `backdrop-filter`는 걷어냈습니다.** 24,000px 페이지에서 그 면적을 블러하면
  스크롤마다 실제 프레임을 잃습니다. 블러는 작은 글래스 카드에만 남겼습니다.
- **하늘은 `background-attachment: fixed`가 아니라 실제 고정 엘리먼트**입니다. 전자는
  스크롤 틱마다 배경 전체를 다시 칠합니다.

---

## 스택

- **Vite 7 + React 19** — SSR이 필요 없는 단일 페이지라 정적 빌드
- **scroll-world 스크럽 엔진** — 의존성 0의 바닐라 JS. 클립을 Blob으로 로드해 호스트의
  byte-range 지원과 무관하게 seek 보장
- **씬 / 영상** — Higgsfield `gpt_image_2` + `seedance_2_0_mini`, 2D 셀 애니메이션 화풍
- **캐릭터** — `nano_banana_2_lite`(1크레딧/장)로 시트, 원본 Ai-ng를 레퍼런스로 정체성 고정
- **3D** — `tripo_h3_1_image_to_3d` → `gltf-transform`으로 최적화

---

## 개발

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/
npm run preview
```

---

## 에셋 파이프라인

원본은 `.world/`(git 제외)에 있고, 아래 스크립트가 `public/`으로 굽습니다.

```bash
# 월드
python3 .world/prep_assets.py                       # 씬 → webp 포스터
python3 .world/build_sky.py s4.png 0.80 1.0         # 씬의 하늘 열을 거울 타일링 → 무이음 배경
bash    .world/encode.sh                            # 클립 → crf26/GOP10, faststart, 무음

# 캐릭터 킷
bash    .world/kit.sh                                # 표정 16 + 액션 16
python3 .world/knockout.py IN.png OUT.webp --white   # 배경 녹아웃 (--checker 모드도 있음)
bash    .world/motion.sh                             # 모션 6종 (흰 배경 · 고정 카메라)
python3 .world/build_motion.py kit/motion/idle.mp4 --pingpong --fps 10 --size 256 --seconds 3
python3 .world/build_kit.py                          # 아틀라스 + 매니페스트 + zip

# 3D
npx gltf-transform optimize in.glb out.glb --compress meshopt \
  --texture-compress webp --texture-size 2048 --simplify true --simplify-error 0.0002
```

### 파이프라인에서 배운 것

- **생성 모델에 "투명 배경"을 요구하면 체커보드를 실제 픽셀로 그려버립니다.**
  흰 배경으로 뽑고 로컬에서 플러드필로 벗기는 쪽이 안정적입니다. 캐릭터의 진한 외곽선이
  실루엣을 닫아주기 때문에, 몸통이 흰색이어도 채우기가 안으로 새지 않습니다.
- **영상에서 알파를 뽑을 때는 압축 노이즈가 남습니다.** 임계만 넓히면 선이 깎이므로,
  연결요소 면적 필터로 작은 조각만 지웁니다.
- **루프는 핑퐁으로 닫습니다.** 모델이 첫 프레임으로 정확히 돌아오게 만드는 것보다,
  정방향 뒤에 역방향을 붙이는 쪽이 확실하고 공짜입니다.

---

## 사실 정확성

숫자는 전부 세 저장소(`ZIVO_FRONT` / `ZIVO_ADMIN` / `ZIVO_BACK`)의 git 이력 분석에서 나온
실측치입니다. **지어낸 지표는 없습니다.** 검증되지 않은 항목은 아예 넣지 않았습니다.

---

<div align="center">

**박상욱 (iron)** · ZIVO Medical Tourism Platform · 2025.10 – 2026.07

[sangwookp9591@gmail.com](mailto:sangwookp9591@gmail.com)

</div>
