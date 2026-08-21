<div align="center">

<img src="docs/ai-ng-favicon.png" alt="Ai-ng" width="112" />

# 3d-web-resume

**질문을 받는 이력서.**

구름 위에 유리판이 떠 있고, 한복판의 검색창은 누르면 그 자리에서 자라 채팅창이 됩니다.
아래로 내려가면 스크롤이 카메라가 되어 다섯 장소 안으로 걸어 들어갑니다.
마스코트 **Ai-ng(아잉)** 이 지금 보고 있는 장면을 옆에서 설명합니다.

<br />

![Next.js](https://img.shields.io/badge/Next.js-16.3%20App%20Router-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178C6?logo=typescript&logoColor=white)
![WebGPU](https://img.shields.io/badge/WebGPU-파티클%20·%20온디바이스%20LLM-000000?logo=webgpu&logoColor=white)
![AEO](https://img.shields.io/badge/AEO-JSON--LD%20·%20llms.txt%20·%20text%2Fmarkdown-7C9EE8)
![Bundle](https://img.shields.io/badge/초기%20JS-198KB%20gzip-blue)

<br />

<img src="docs/screens/cover.webp" alt="커버 — 구름 위의 리퀴드 글래스 판과 검색창" width="880" />

<br />

<img src="docs/screens/oracle.webp" alt="같은 검색창이 그 자리에서 자라 채팅창이 된 상태" width="880" />

</div>

---

## 한 페이지에 무엇이 있나

라우트는 `/` 하나입니다. 그 아래 여덟 블록이 한 문서로 이어져 있고, 오라클과 아잉만 그 흐름
위에 떠 있습니다. 1440×900에서 문서 전체 높이는 **16,999px — 뷰포트 18.9개분**입니다.

```
.sky                하늘 한 장 (fixed · 스크롤해도 움직이지 않음)
 │
 ├─ ① 커버          이름판 · 오라클 · 통계 넷 · 스크롤 안내        900px
 ├─ ② 픽셀 여정     다섯 장면 — 기원·검증·규율·지능·정합성      8,415px  ← 문서의 절반
 ├─ ③ 저장소 발자국 세 저장소 기여도 막대                          703px
 ├─ ④ 영상·오디오   업로드 파이프라인 + 4년 이력                 1,433px
 ├─ ⑤ 공유 로그     팀 채널에 올린 글 9건                        1,889px
 ├─ ⑥ 일하는 방식   원칙 셋                                        902px
 ├─ ⑦ 마스코트 킷   3D 뷰어 + 모션·표정·액션 시트                1,981px
 └─ ⑧ 콜로폰       GitHub · YouTube 피드 · 메일                   776px

  아잉  오른쪽 아래 고정 · 스크롤 위치에 따라 대사 교체
```

어느 블록에 어떤 글이 어디서 오는지는 [docs/screen-map.md](docs/screen-map.md)에 있습니다.
여기 README는 **어떻게 동작하나**만 다룹니다.

---

## ① 커버 — 판이 세 장이 아니라 방 하나

이름판·검색창·통계판이 서로 다른 깊이에 떠 있습니다. 포인터는 판을 움직이지 않고 **카메라를**
움직입니다 — 그래서 시차가 느슨한 카드 세 장이 아니라 하나의 방으로 읽힙니다. 클라이언트로
넘어가는 것은 포인터를 CSS 변수로 옮기는 래퍼(`CoverParallax`) 하나뿐이고, 글자는 전부
서버에서 나옵니다.

| 5,240+ | 3개 전 영역 | 98% | 440건 |
|:-:|:-:|:-:|:-:|
| 9개월간의 커밋 | 웹 · 어드민 · 백엔드 리드 | 글로벌 웹 단독 구축 | 안정적으로 머지된 PR |

이름판 다음에 오는 것이 방문자의 질문이라서, 검색창은 장식이 아니라 **화면 한복판**입니다.

---

## 오라클 — 검색창이 그대로 자라 채팅창이 된다

누르면 **새 창이 열리는 게 아니라 그 판이 그 자리에서 커집니다.** 페이지 이동도, 레이어
교체도 없습니다.

| 층 | 무엇을 하나 |
|---|---|
| **파티클 막** | 16,000개가 rounded-rect 둘레를 목표로 모입니다. 위치·속도는 전부 WebGPU 컴퓨트 셰이더가 계산합니다 |
| **DOM 판** | 항상 확장 크기로 고정하고 `clip-path`만 바꿉니다 — 리플로 0 |
| **내용** | 판 외곽이 거의 완성된 뒤(`morph` 0.72~1.0)에야 헤더 → 로그 → 입력이 차례로 맺힙니다 |

- 둘레를 `u∈[0,1)`로 파라미터화해서 검색창과 채팅창이 **연속으로 대응**됩니다. 그래서 중간 상태가 늘 그럴듯합니다
- 파티클 간 인력·반발은 저해상도 밀도 그리드의 기울기로 O(N) 근사합니다
- 열림 진행률은 스프링입니다. 저프레임에서 명시적 오일러가 발산하므로 **고정 서브스텝**으로 적분합니다
- 플레이스홀더 문구는 신기루처럼 글자 단위로 맺혔다가 증발합니다
- WebGPU가 없으면 파티클 없이 `clip-path` 전환만 남습니다

### 답은 누가 하나

세 갈래 중 되는 것을 위에서부터 씁니다. 어느 쪽이든 **질문은 브라우저 밖으로 나가지 않습니다.**

| 순위 | 엔진 | 조건 |
|:-:|---|---|
| 1 | **Ollama** | 이 컴퓨터에서 돌고 있을 때 (내려받을 것 없음, localhost에서만 탐지) |
| 2 | **브라우저 모델** | Gemma 3 1B q4f16 **763MB**를 WebGPU로. 물어볼 뜻을 보였을 때 받습니다 |
| 3 | **위키** | 모델이 없거나 WebGPU가 없으면 질문에 걸린 구간만 골라 답합니다 |

세 갈래 중 어느 쪽으로 왔든, 답은 화면에 닿기 전에 표현 층(`lib/answer.ts`)을 지납니다.
위키 쪽은 조각을 통째로 붙이지 않고 **질문과 가장 가까운, 이어지는 두세 문장**만 떠 옵니다 —
점수 높은 문장을 흩어 모으면 "쿠폰을 왜 새로 설계했나"에 테스트 컨테이너 이야기가 붙습니다.
모델 쪽은 반대로 사고 과정 태그, `### 요약` 같은 빈 제목, "자료에 따르면", 같은 문장 반복을 걷어냅니다.
스트리밍 중에도 매 토큰 다듬으므로 속엣말이 화면에 흐르지 않습니다.
그리고 답은 마크다운으로 그립니다 — 파서 없이 문단·목록·강조·코드·링크만, React 엘리먼트로
직접(`components/oracle/Markdown.tsx`).

모델이 하는 일은 *지식을 꺼내는 것*이 아니라 **검색된 위키 문단을 두어 문장으로 다듬는 것**입니다.
그래서 한동안 기본이 570MB Qwen3 0.6B였는데, 실제 답이 그 계산을 뒤집었습니다 —
0.6B는 주어를 빠뜨리고, 목록의 앞 몇 개만 옮기고, 한자를 섞었습니다("모두集成했습니다").

위로 올리는 데는 천장이 있습니다. Qwen3 1.7B(1.4GB)는 **브라우저에서 세션이 안 뜹니다** —
`Can't create a session. ERROR_CODE: 6, std::bad_alloc`. onnxruntime-web의 WASM 힙이
32비트라 1.4GB 가중치 + 실행 작업공간에서 죽습니다. 1.4GB를 다 받고 나서 실패하므로
방문자에게는 0.6B보다 나쁩니다. Gemma 4 E2B는 멀티모달이라 코드 경로가 갈라지고
ONNX q4f16이 디코더 1,520MB + 임베딩 1,591MB = **3.1GB**입니다(qat-mobile q2f16도 2.3GB).

그래서 기본은 **763MB Gemma 3 1B**입니다 — 세션이 뜨는 가장 큰 텍스트 전용 모델이고,
챗 템플릿이 system을 첫 user 턴에 접어 넣어 주므로 코드 경로도 그대로입니다.
그리고 나열형 질문은 아예 모델을 안 거칩니다
(`lib/wiki.ts`의 `verbatim` — 스택 같은 조각은 원문이 이미 답의 꼴입니다).
모델·용량·dtype·샘플링은 `components/oracle/models.ts` 한 곳에 있고 워커와 UI가 같은 표를 봅니다.

내려받기는 묻지 않습니다. Ollama 탐지가 끝나고 `navigator.gpu`가 있을 때만 시작하므로,
Ollama가 도는 컴퓨터와 WebGPU가 없는 브라우저는 763MB를 건드리지 않습니다 — 세션은 파일을
다 받은 뒤에야 만들어져서, 가드가 없으면 못 쓸 모델을 끝까지 받고 나서 죽습니다.
데이터 세이버·느린 회선·`prefers-reduced-data`도 같은 자리에서 걸러냅니다.

### 무엇을 근거로 답하나

근거는 셋 다 같은 위키(`lib/wiki.ts`) **28개 조각**입니다. PAR 이력서의
Problem·Analyze·Action·Result를 옮겨서, 무엇을 했는지뿐 아니라 **어떤 선택지를 왜 골랐는지**까지 답합니다.

| 갈래 | 조각 |
|---|---|
| 개요 | 종합 프로필 · 세 저장소 포지션 · 경력 |
| FRONT | 웹 0→1(14개 언어) · 결제 실패 경로 · E2E 하네스 · 장바구니 · 다국어 |
| ADMIN | RBAC 하이브리드 권한 · 공통 인프라와 팀 규약 · 가맹 운영 |
| BACK | 도메인 개요 · 모듈 구조 · OpenSearch 재색인 · 멀티 LLM 회복탄력 · 쿠폰 DDD/Outbox · 프로모션 |
| 팀 | 에이전트 스킬 CLI와 PR 자동 리뷰 · **공유 기록**(팀 채널에 올린 것들) |
| 그 외 | 일하는 방식 · 스택 · 영상·오디오 이력 · 이 사이트 · 연락 · **하지 않은 일** |

마지막 조각이 중요합니다. RAG/pgvector는 계획 흔적만 있고 구현이 없으며, 백엔드 결제 코어는
다른 기여자 소유입니다. **모델이 넘지 말아야 할 선을 근거 안에 적어 둡니다.**

검색은 형태소 분석기 없이 돌아갑니다:

- **2-gram으로 조사를 뚫되 한글에만.** 영문 두 글자는 뜻이 없어서 `archunit`의 `ch`가
  `opensearch`에 걸리는 식으로 노이즈만 만듭니다
- **문서 빈도로 흔한 말을 누릅니다.** 없으면 "iron"이 붙었다는 이유로 소개 조각이 1등을 합니다
- **길이 정규화는 완만하게**(BM25의 `b`항). 안 하면 개요 조각이 다 먹고, 제곱근으로 나누면
  반대로 가장 짧은 조각이 아무 질문에나 튀어나옵니다
- **일반 서술어는 불용어로.** "설계"가 어쩌다 한 제목에만 있다는 이유로 희소어 취급을 받으면,
  "쿠폰은 왜 새로 설계했어?"에 결제 조각이 1등을 합니다

```bash
npm run check
# wiki: 28 chunks, 149 checks pass   ← 엉뚱한 조각이 1등이면 실패
```

---

## ② 다섯 장소 — 스크롤이 걸음이 된다

스크롤은 재생이 아니라 **아잉의 걸음**입니다. 스크롤 위치가 곧 캐릭터의 x 좌표이고, 다섯
장소를 순간이동 없이 걸어서 지나갑니다. 멈추면 아잉도 멈추고 `idle`로 돌아갑니다.

```
[새벽 숲 오두막] → [강의 돌다리] → [문지기 초소] → [언덕 전망대] → [해질녘 창고]
      ↑ 스크롤 위치 = 카메라 x = 아잉의 x
   하늘 0.2 · 배경 0.6 · 지면과 아잉 1.0 · 전경 소품 1.15
```

걷기는 스크롤 속도가 아니라 **시계**가 굴립니다(8fps 고정). 휙 넘겨도 리듬이 무너지지 않습니다.
씬의 글은 캔버스가 아니라 서버가 그린 DOM이고, 화면에 붙잡아 두는 것은 JS가 아니라
`position: sticky`입니다 — 엔진이 없어도, 모션을 줄여 달라고 해도 다섯 장은 그대로 읽힙니다.

장소마다 **문제가 먼저** 보이고 그 다음에 그것을 다룬 사물이 보입니다. 도구를 진열하지 않습니다.
왼쪽에서 오른쪽으로 해가 기웁니다.

| # | 장소 | 무엇이 보이나 | 담긴 이력 |
|:-:|---|---|---|
| 01 | **기원** | 새벽 숲의 오두막, 길을 따라 늘어선 등불 14개 | Front 0→1 · 14개 언어 · QR 주문·결제 |
| 02 | **검증** | 물살이 센데도 흔들리지 않는 돌다리, 같은 돌 10개 더미 | 결제 E2E 하네스 · 플레이크 0 |
| 03 | **규율** | 열쇠 하나로만 열리는 문, 담장의 열쇠고리와 규칙판 | RBAC 하이브리드 권한 · 공통 인프라 |
| 04 | **지능** | 언덕 위 망원경과 아래로 갈라지는 세 갈래 물길 | OpenSearch 재색인 · 멀티 LLM fallback |
| 05 | **정합성** | 이중 자물쇠 창고와 상자를 하나씩 확인하는 우편함 | 쿠폰 DDD/Hexagonal · Outbox |

<img src="docs/screens/world.webp" alt="규율 — 서로 다른 구멍의 문 다섯 개" />

---

## ③~⑧ 나머지 판들

<img src="docs/screens/footprint.webp" alt="저장소 기여도 — 막대 길이가 실제 커밋 점유율" />

| 블록 | 무엇을 말하나 |
|---|---|
| **저장소 발자국** | 세 저장소의 커밋 점유율. **막대 길이는 연출이 아니라 실제 수치**입니다 |
| **영상·오디오** | 촬영 → FFmpeg 컷 → S3 → MediaConvert → CloudFront → 스트리밍 6단계와, 2022년부터 이 포트폴리오까지의 미디어 작업 넷. 스크린샷은 촬영본이 아니라 그때 만든 앱을 그대로 띄운 것입니다 |
| **공유 로그** | 팀 채널에 올린 글 9건. 반응 수를 적은 항목이 있는 이유는, 공유가 혼잣말이 아니라 팀이 실제로 집어 갔다는 근거가 그것뿐이기 때문입니다 |
| **일하는 방식** | 원칙 셋. 각각 왜 그렇게 하는지가 붙습니다 |
| **콜로폰** | 이 사이트에서 **저장소 밖에서 오는 유일한 두 목록** — GitHub 최근 프로젝트와 YouTube 최근 영상 |

콜로폰의 두 피드는 6시간마다 다시 옵니다(`lib/feeds.ts`). Next 16의 `fetch`는 기본이 캐시
안 함이라 `revalidate`를 안 붙이면 홈이 통째로 요청마다 렌더되는 동적 경로로 내려앉습니다 —
정적 프리렌더라는 이 사이트의 전제가 조용히 깨집니다. 바깥이 죽어도 배포는 막지 않되,
빈 목록으로 조용히 넘어가지 않고 빌드 로그에 남깁니다. 화면에서는 "영상이 없는 것"과
구분되지 않기 때문입니다.

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
| 3D | `aing.glb` **1.19MB** · `aing-lite.glb` **201KB** (meshopt) |

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

## AEO — 에이전트가 JS 없이 읽는 이력서

이 사이트에서 가장 할 말이 많은 부분은 다섯 장소의 카피입니다. 그런데 그 글은 예전 엔진이
런타임 `innerHTML`로 만들고 있었습니다 — **JS를 돌리지 않는 크롤러에게는 페이지가 통째로
비어 있었다**는 뜻입니다. Next 이관의 본론이 이걸 서버로 옮긴 것입니다.

| 표면 | 무엇을 내나 |
|---|---|
| **HTML** | 다섯 장면의 제목·본문·태그, 저장소 수치, 원칙, 킷 그리드 전부 서버 렌더. 엔진은 이 마크업을 **읽기만** 하고(씬 경계와 스크롤 길이를 여기서 가져옵니다) 글은 건드리지 않습니다 |
| **JSON-LD** | `ProfilePage` · `Person` · `ItemList`×2 · `FAQPage`. **화면에 실제로 보이는 글만** 올립니다 — 위키는 안 보이므로 FAQ로 올리지 않습니다 |
| **`/iron.md`** | 이력서 전문 Clean Markdown. 페이지와 **같은 상수**에서 생성되어 어긋날 사본이 없습니다 |
| **`Accept: text/markdown`** | 홈 요청을 rewrite로 `/iron.md`에 연결(`proxy.ts`). URL은 그대로라 에이전트가 인용하는 주소 = 사람이 여는 주소. `Vary: Accept` |
| **`/llms.txt`** · **`/llms-full.txt`** | 색인과 전문. 역시 `lib/markdown.ts`가 생성 |
| **`robots.txt`** | GPTBot·ClaudeBot·PerplexityBot 등 16종을 **이름으로** 허용. 와일드카드만 두면 색인을 건너뛰는 봇이 있습니다 |

```bash
curl -H "Accept: text/markdown" https://…/     # 3D 세계 대신 마크다운 전문
```

`Accept` rewrite는 공유 캐시 한계 때문에 어디까지나 편의 기능이고, 에이전트에게 약속하는
정본 주소는 `/iron.md`입니다.

---

## 성능

| 지표 | 값 |
|---|---|
| 초기 JS | **198KB gzip** — three.js·픽셀 엔진·파티클 막·LLM은 전부 필요할 때만 |
| 3D 모델 | 54.44MB → **1.19MB** (simplify + meshopt + 텍스처 WebP) |
| 픽셀 에셋 | 26장 **721KB** (배경 5 · 소품 10 · 아잉 8 · 공용 3) |
| 파비콘 | 1.5MB → **52KB** (1024px 원본이 그대로 들어가 있었습니다) |

> 초기 JS는 프리렌더된 `index.html`이 참조하는 스크립트 8개의 gzip 합입니다. App Router
> 런타임 값이고, 그 대가로 산 것이 위의 AEO 표입니다. 에이전트에게는 초기 JS가 0이므로
> 이 거래는 그쪽에서 이득입니다.

몇 가지 결정:

- **three는 한쪽만 받습니다.** `three/webgpu`는 코어를 재export하므로 `three`와 같이 import하면
  같은 라이브러리를 두 벌(~190KB gzip) 내려받게 됩니다. 엔트리를 먼저 고르고 나서 import합니다.
- **전면 섹션의 `backdrop-filter`는 걷어냈습니다.** 17,000px 페이지에서 그 면적을 블러하면
  스크롤마다 실제 프레임을 잃습니다. 블러는 작은 글래스 카드에만 남겼습니다.
- **하늘은 `background-attachment: fixed`가 아니라 실제 고정 엘리먼트**입니다. 전자는
  스크롤 틱마다 배경 전체를 다시 칠합니다.
- **폰트는 표제용 Instrument Serif만 self-host**하고, 본문 한글 Pretendard는 동적 서브셋을
  `media="print"`로 받아 첫 페인트를 막지 않습니다.

### JS 없이도 남는 것

픽셀 여정 다섯 장, 저장소 막대, 모든 섹션의 글이 그대로 읽히고 앵커 이동도 됩니다.
안 되는 것은 오라클 대화와 3D 뷰어뿐입니다. 탭 첫 입력에 "본문으로 건너뛰기"가 나오고,
아잉은 정지 포즈가 기본이라 모션을 줄여 달라고 한 방문자에게는 움직이지 않습니다.

---

## 스택

- **Next.js 16.3 App Router + React 19 + TypeScript 7** — 본문은 전부 서버 컴포넌트.
  클라이언트로 넘어가는 것은 다섯 조각뿐입니다: `CoverParallax`(포인터) · `WorldMount`(엔진) ·
  `Oracle`(WebGPU+워커) · `Live3D`(GLB) · `Guide`(스크롤 위치)
- **픽셀 여정 엔진** — 의존성 0의 바닐라 TS(`lib/pixel-journey.ts`). 스크롤을 카메라
  좌표로 바꿔 레이어 넷을 서로 다른 속도로 밀 뿐입니다. 씬의 글과 스크롤 길이는 서버가 그린
  마크업이 쥐고 있고, 붙잡는 것은 CSS입니다
- **씬 / 스프라이트** — Higgsfield `gpt_image_2` + `nano_banana_2`, 16-bit 픽셀 아트.
  1024×512 파노라마 5장은 지평선을 화면 하단 38%로 고정해 장소가 바뀌어도 땅이 튀지 않습니다
- **캐릭터** — `nano_banana_2_lite`(1크레딧/장)로 시트, 원본 Ai-ng를 레퍼런스로 정체성 고정
- **3D** — `tripo_h3_1_image_to_3d` → `gltf-transform`으로 최적화

---

## 개발

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # .next/
npm start          # 프로덕션 서버

npm run check      # 위키 검색 회귀 체크 149건 (프레임워크 없음)
npm run typecheck  # tsc --noEmit
npm run lint       # oxlint
```

배포는 Vercel입니다. `NEXT_PUBLIC_SITE_URL`을 두면 그 값이, 없으면 Vercel이 주는
`VERCEL_PROJECT_PRODUCTION_URL`이 canonical·sitemap·JSON-LD의 기준이 됩니다 —
프리뷰 배포가 스스로를 정본이라 주장하지 않도록 하드코딩하지 않았습니다(`lib/site.ts`).

변경 이력과 결정 근거는 [CHANGELOG.md](CHANGELOG.md)에, 화면 구성도는
[docs/screen-map.md](docs/screen-map.md)에 있습니다.

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

숫자는 전부 세 저장소(`ZIVO_FRONT` / `ZIVO_ADMIN` / `ZIVO_BACK`)의 git 이력 분석(2026-07-02
기준)에서 나온 실측치입니다. **지어낸 지표는 없습니다.** 검증되지 않은 항목은 아예 넣지
않았고, 하지 않은 일은 위키에 하지 않았다고 적어 두었습니다.

---

<div align="center">

<img src="docs/screens/expr-strip.webp" alt="Ai-ng 표정 시트" width="880" />

**박상욱 (iron)** · ZIVO Medical Tourism Platform · 2025.10 – 2026.07

[sangwookp9591@gmail.com](mailto:sangwookp9591@gmail.com)

</div>
