/* 언어 모델을 브라우저 안에서 돌립니다. 서버로 아무것도 보내지 않습니다.
   메인 스레드에서 돌리면 생성 한 번에 UI가 통째로 멈추므로 워커에 가둡니다.

   기본은 Qwen3 0.6B q4f16 (약 570MB). 두 번째 방문부터는 브라우저 캐시에서 바로 올라옵니다.
   모델 목록과 용량은 models.js 한 곳에 있습니다. */
import { AutoTokenizer, AutoModelForCausalLM, TextStreamer } from '@huggingface/transformers';
import { DEFAULT_MODEL, byId } from './models.js';

let tokenizer = null;
let model = null;
let spec = DEFAULT_MODEL;
let loading = null;

// 파일별 진행률을 합산합니다 — 파일 하나가 끝날 때마다 0%로 되돌아가면 진행 중인지 알 수 없습니다.
const files = new Map();
const reportProgress = () => {
  let loaded = 0, total = 0;
  for (const f of files.values()) { loaded += f.loaded; total += f.total; }
  if (total > 0) postMessage({ type: 'progress', ratio: loaded / total, mb: Math.round(loaded / 1e6) });
};

function load(id) {
  if (loading) return loading;
  spec = byId(id);
  files.clear();
  loading = (async () => {
    postMessage({ type: 'status', status: 'loading', model: spec.id });
    tokenizer = await AutoTokenizer.from_pretrained(spec.id);
    model = await AutoModelForCausalLM.from_pretrained(spec.id, {
      dtype: spec.dtype,
      device: 'webgpu',
      progress_callback: (info) => {
        if (info.status === 'progress' && info.total) {
          files.set(info.file, { loaded: info.loaded ?? 0, total: info.total });
          reportProgress();
        }
      },
    });
    postMessage({ type: 'status', status: 'ready', model: spec.id });
  })().catch((err) => {
    loading = null;
    postMessage({ type: 'status', status: 'error', message: String(err?.message || err) });
    throw err;
  });
  return loading;
}

async function ask({ id, system, question }) {
  // load 없이 ask가 오면 byId(undefined)가 기본 모델을 집어, 방문자가 허락하지도 않은
  // 모델을 받고 spec(=enable_thinking)도 그 세션과 어긋납니다. 조용히 고르지 않습니다.
  if (!loading) throw new Error('모델이 아직 올라오지 않았습니다');
  await loading;
  const text = tokenizer.apply_chat_template(
    [
      { role: 'system', content: system },
      { role: 'user', content: question },
    ],
    { tokenize: false, add_generation_prompt: true, enable_thinking: !spec.noThinking }
  );
  const inputs = await tokenizer(text, { add_special_tokens: false });

  const streamer = new TextStreamer(tokenizer, {
    skip_prompt: true,
    skip_special_tokens: true,
    callback_function: (piece) => postMessage({ type: 'token', id, text: piece }),
  });

  await model.generate({ ...inputs, max_new_tokens: 320, do_sample: false, streamer });
  postMessage({ type: 'done', id });
}

self.onmessage = async (e) => {
  const msg = e.data;
  try {
    if (msg.type === 'load') await load(msg.model);
    else if (msg.type === 'ask') await ask(msg);
  } catch (err) {
    postMessage({ type: 'error', id: msg.id, message: String(err?.message || err) });
  }
};
