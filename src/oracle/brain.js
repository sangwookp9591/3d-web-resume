/* 답을 만드는 쪽. 세 갈래가 있고 위에서부터 되는 것을 씁니다.

   1) ollama — 이 컴퓨터에서 Ollama가 돌고 있으면 그쪽에 물어봅니다 (내려받을 게 없음)
   2) gemma  — 브라우저 안에서 WebGPU로 Gemma 4를 돌립니다 (최초 1회 약 3.4GB)
   3) wiki   — 모델이 없어도 위키 조각을 그대로 인용해 답합니다

   어느 쪽이든 근거는 같은 위키이고, 질문은 밖으로 나가지 않습니다. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { retrieve, lookup } from './wiki.js';

const OLLAMA = 'http://localhost:11434';
const CONSENT = 'oracle:gemma-ok';   // 3.4GB를 한 번 허락했으면 다음부터는 묻지 않습니다

const SYSTEM = (ctx) => `너는 개발자 박상욱(iron, 아이언, 상욱)의 이력 위키를 대신 읽어 주는 안내자다.
아래 <자료>에 적힌 것만 근거로 한국어로 답한다. 3문장 이내로 짧고 담백하게.
자료에 없는 것은 지어내지 말고 "그건 위키에 없습니다"라고 말한다. 숫자는 자료에 있는 그대로만 쓴다.

<자료>
${ctx}
</자료>`;

const context = (q) => {
  const hits = retrieve(q, 3);
  return hits.length ? hits.map((h) => `[${h.title}]\n${h.text}`).join('\n\n') : null;
};

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
    // gemma가 있으면 gemma로 — 이 페이지가 약속한 모델이기 때문입니다.
    return names.find((n) => n.startsWith('gemma')) ?? names[0] ?? null;
  } catch {
    return null;
  }
}

async function askOllama(model, system, question, onToken) {
  const r = await fetch(`${OLLAMA}/api/chat`, {
    method: 'POST',
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
  const [engine, setEngine] = useState('wiki');   // wiki | ollama | gemma
  const [status, setStatus] = useState('idle');   // idle | loading | ready | error
  const [progress, setProgress] = useState(0);
  const ollamaRef = useRef(null);
  const workerRef = useRef(null);
  const pending = useRef(new Map());

  useEffect(() => {
    let dead = false;
    findOllama().then((m) => {
      if (dead || !m) return;
      ollamaRef.current = m;
      setEngine('ollama');
      setStatus('ready');
    });
    return () => { dead = true; };
  }, []);

  const spawn = useCallback(() => {
    if (workerRef.current) return workerRef.current;
    const w = new Worker(new URL('./llm.worker.js', import.meta.url), { type: 'module' });
    w.onmessage = ({ data }) => {
      if (data.type === 'progress') setProgress(data.ratio);
      else if (data.type === 'status') {
        setStatus(data.status);
        if (data.status === 'ready') { setEngine('gemma'); setProgress(1); }
      } else if (data.type === 'token') pending.current.get(data.id)?.token(data.text);
      else if (data.type === 'done') { pending.current.get(data.id)?.done(); pending.current.delete(data.id); }
      else if (data.type === 'error') { pending.current.get(data.id)?.fail(data.message); pending.current.delete(data.id); }
    };
    workerRef.current = w;
    return w;
  }, []);

  const enableGemma = useCallback(() => {
    localStorage.setItem(CONSENT, '1');
    setStatus('loading');
    spawn().postMessage({ type: 'load' });
  }, [spawn]);

  // 한 번 허락했다면 다음 방문에는 묻지 않고 바로 올립니다 (대개 캐시에서 옵니다).
  useEffect(() => {
    if (localStorage.getItem(CONSENT) === '1' && !ollamaRef.current && !workerRef.current) enableGemma();
  }, [enableGemma]);

  useEffect(() => () => workerRef.current?.terminate(), []);

  /** 질문 하나. onToken이 오면 스트리밍, 반환값은 완성된 답. */
  const ask = useCallback(async (question, onToken = () => {}) => {
    const ctx = context(question);
    if (!ctx) return lookup(question);          // 위키와 무관한 질문은 모델을 깨울 것도 없습니다

    try {
      if (ollamaRef.current) {
        return await askOllama(ollamaRef.current, SYSTEM(ctx), question, onToken);
      }
      if (workerRef.current && status === 'ready') {
        const id = String(Date.now());
        let out = '';
        return await new Promise((resolve, reject) => {
          pending.current.set(id, {
            token: (t) => { out += t; onToken(t); },
            done: () => resolve(out.trim() || lookup(question)),
            fail: (m) => reject(new Error(m)),
          });
          workerRef.current.postMessage({ type: 'ask', id, system: SYSTEM(ctx), question });
        });
      }
    } catch (e) {
      console.warn('[oracle] 모델이 답하지 못해 위키로 넘어갑니다:', e.message);
    }
    return lookup(question);
  }, [status]);

  return {
    engine,
    status,
    progress,
    // 아직 아무 모델도 없고, 아직 허락을 안 받은 상태에서만 권합니다.
    canEnableGemma: engine === 'wiki' && status === 'idle',
    enableGemma,
    ask,
  };
}
