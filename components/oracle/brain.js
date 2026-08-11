/* 답을 만드는 쪽. 세 갈래가 있고 위에서부터 되는 것을 씁니다.

   1) ollama — 이 컴퓨터에서 Ollama가 돌고 있으면 그쪽에 물어봅니다 (내려받을 게 없음)
   2) local  — 브라우저 안에서 WebGPU로 소형 모델을 돌립니다 (진입 즉시 자동, 최초 1회 570MB)
   3) wiki   — 모델이 없거나 WebGPU가 없으면 위키 조각을 그대로 인용해 답합니다

   어느 쪽이든 근거는 같은 위키이고, 질문은 밖으로 나가지 않습니다. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { retrieve, lookup } from '@/lib/wiki';
import { DEFAULT_MODEL, byId } from './models.js';

// 모델이 죽어도(WebGPU OOM, 탭 스로틀링, 디바이스 로스트) 워커는 아무 메시지도 안 보냅니다.
// 그대로 두면 busy가 안 풀려 입력창이 새로고침 전까지 잠깁니다.
const ASK_TIMEOUT_MS = 120_000;

const OLLAMA = 'http://localhost:11434';

const SYSTEM = (ctx) => `너는 개발자 박상욱(iron, 아이언, 상욱)의 이력 위키를 대신 읽어 주는 안내자다.
아래 <자료>에 적힌 것만 근거로 한국어로 답한다. 3문장 이내로 짧고 담백하게.
자료에 없는 것은 지어내지 말고 "그건 위키에 없습니다"라고 말한다. 숫자는 자료에 있는 그대로만 쓴다.

<자료>
${ctx}
</자료>`;

/** Ollama가 이 컴퓨터에서 돌고 있는지.
    https로 배포된 사이트에서는 어차피 mixed content로 막히고, 시도 자체가 콘솔에
    빨간 줄을 남기므로(네트워크 오류는 catch해도 로그가 남습니다) 로컬에서만 두드립니다. */
async function findOllama() {
  if (!/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) return null;
  try {
    const r = await fetch(`${OLLAMA}/api/tags`, { signal: AbortSignal.timeout(900) });
    if (!r.ok) return null;
    const { models = [] } = await r.json();
    const names = models.map((m) => m.name);
    // gemma가 있으면 gemma로 — 이 페이지가 오래 약속해 온 모델이기 때문입니다.
    return names.find((n) => n.startsWith('gemma')) ?? names[0] ?? null;
  } catch {
    return null;
  }
}

async function askOllama(model, system, question, onToken, signal) {
  const r = await fetch(`${OLLAMA}/api/chat`, {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: true,
      options: { temperature: 0.2, num_predict: 320 },
      messages: [{ role: 'system', content: system }, { role: 'user', content: question }],
    }),
  });
  if (!r.ok) throw new Error(`Ollama ${r.status}`);
  const reader = r.body.getReader();
  const dec = new TextDecoder();
  let buf = '', out = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    // NDJSON — 줄 하나가 곧 토큰 한 덩어리입니다. 마지막 조각은 다음 청크에 이어 붙입니다.
    const lines = buf.split('\n');
    buf = lines.pop();
    for (const line of lines) {
      if (!line.trim()) continue;
      const piece = JSON.parse(line).message?.content;
      if (piece) { out += piece; onToken(piece); }
    }
  }
  return out;
}

export default function useOracleBrain() {
  const [engine, setEngine] = useState('wiki');   // wiki | ollama | local
  const [status, setStatus] = useState('idle');   // idle | loading | ready | error
  const [progress, setProgress] = useState(0);
  const [model, setModel] = useState(DEFAULT_MODEL);
  const ollamaRef = useRef(null);
  const workerRef = useRef(null);
  const pending = useRef(new Map());

  const spawn = useCallback(() => {
    if (workerRef.current) return workerRef.current;
    const w = new Worker(new URL('./llm.worker.js', import.meta.url), { type: 'module' });
    w.onmessage = ({ data }) => {
      if (data.type === 'progress') setProgress(data.ratio);
      else if (data.type === 'status') {
        setStatus(data.status);
        if (data.model) setModel(byId(data.model));
        if (data.status === 'ready') { setEngine('local'); setProgress(1); }
      } else if (data.type === 'token') pending.current.get(data.id)?.token(data.text);
      else if (data.type === 'done') { pending.current.get(data.id)?.done(); pending.current.delete(data.id); }
      else if (data.type === 'error') { pending.current.get(data.id)?.fail(data.message); pending.current.delete(data.id); }
    };
    // 워커가 아예 안 뜨면(모듈 워커 미지원, 청크 404) onmessage는 영영 안 옵니다.
    // 잡아두지 않으면 헤더가 '내려받는 중 0%'에 붙박입니다. 그리고 답을 기다리던 질문들도
    // 여기서 같이 깨워야 합니다 — 안 그러면 입력창이 잠긴 채 남습니다.
    w.onerror = (e) => {
      console.error('[oracle] 워커', e.message || e);
      setStatus('error');
      for (const [id, p] of pending.current) { p.fail('워커가 죽었습니다'); pending.current.delete(id); }
    };
    workerRef.current = w;
    return w;
  }, []);

  const enableModel = useCallback((id) => {
    const spec = byId(id);
    setModel(spec);
    setStatus('loading');
    setProgress(0);
    spawn().postMessage({ type: 'load', model: spec.id });
  }, [spawn]);

  /* Ollama 탐지가 끝난 다음에야 모델을 올릴지 정합니다. 탐지는 비동기라서
     마운트 시점에 ollamaRef를 읽으면 언제나 비어 있고, 그대로 두면 Ollama가 도는
     컴퓨터에서도 재방문자가 수백 MB를 다시 받습니다 — 그러고는 쓰지도 않습니다. */
  useEffect(() => {
    let dead = false;
    findOllama().then((m) => {
      if (dead) return;
      if (m) {
        ollamaRef.current = m;
        setEngine('ollama');
        setStatus('ready');
        return;
      }
      /* Ollama가 없으면 브라우저 모델을 묻지 않고 바로 내려받습니다. 두 번째 방문부터는
         브라우저 캐시에서 올라옵니다.
         WebGPU가 없는 브라우저는 걸러냅니다 — 세션은 파일을 다 받은 뒤에야 만들어지므로,
         가드가 없으면 실행할 수도 없는 모델 570MB를 끝까지 받고 나서 죽습니다. */
      if (!navigator.gpu || workerRef.current) return;
      enableModel(DEFAULT_MODEL.id);
    }).catch((err) => console.warn('[oracle] 엔진 탐지 실패:', err));
    return () => { dead = true; };
  }, [enableModel]);

  // 실패했으면 워커를 버리고 다시 시도할 수 있게 합니다 — 안 그러면 localStorage를
  // 직접 지우는 것 말고는 되살릴 방법이 없습니다.
  const retryModel = useCallback(() => {
    workerRef.current?.terminate();
    workerRef.current = null;
    pending.current.clear();
    enableModel(model.id);
  }, [enableModel, model]);

  useEffect(() => () => workerRef.current?.terminate(), []);

  /** 질문 하나. onToken이 오면 스트리밍, 반환값은 언제나 최종본입니다. */
  const ask = useCallback(async (question, onToken = () => {}) => {
    const hits = retrieve(question, 3);
    if (!hits.length) return lookup(question);  // 위키와 무관한 질문은 모델을 깨울 것도 없습니다
    const ctx = hits.map((h) => `[${h.title}]\n${h.text}`).join('\n\n');
    const quote = () => hits.map((h) => `【${h.title}】\n${h.text}`).join('\n\n');

    try {
      if (ollamaRef.current) {
        // 로컬 모델이 멎으면(런너 세그폴트 등) 읽기가 영영 안 끝나서 입력창이 잠깁니다.
        const out = await askOllama(ollamaRef.current, SYSTEM(ctx), question, onToken,
          AbortSignal.timeout(60_000));
        return out.trim() || quote();
      }
      if (workerRef.current && status === 'ready') {
        const id = String(Date.now());
        let out = '';
        return await new Promise((resolve, reject) => {
          /* 워커가 죽으면(WebGPU OOM, 탭 스로틀링, 디바이스 로스트) done도 error도 안 옵니다.
             타임아웃이 없으면 이 프라미스가 영영 안 풀리고, Oracle의 finally가 못 돌아
             busy가 true로 굳어 입력창이 새로고침 전까지 잠깁니다. Ollama 쪽에는 이미
             같은 이유로 60초 타임아웃이 걸려 있는데, 정작 방문자에게 나가는 건 이쪽입니다. */
          const timer = setTimeout(() => {
            pending.current.delete(id);
            reject(new Error('모델이 시간 안에 답하지 못했습니다'));
          }, ASK_TIMEOUT_MS);
          const settle = (fn) => (arg) => { clearTimeout(timer); pending.current.delete(id); fn(arg); };
          pending.current.set(id, {
            token: (t) => { out += t; onToken(t); },
            done: settle(() => resolve(out.trim() || quote())),
            fail: settle((m) => reject(new Error(m))),
          });
          workerRef.current.postMessage({ type: 'ask', id, system: SYSTEM(ctx), question });
        });
      }
    } catch (e) {
      console.warn('[oracle] 모델이 답하지 못해 위키로 넘어갑니다:', e.message);
    }
    return quote();
  }, [status]);

  return {
    engine,
    status,
    progress,
    model,
    retryModel,
    ask,
  };
}
