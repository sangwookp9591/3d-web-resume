/* 브라우저에서 돌릴 모델. 워커와 UI가 같은 표를 보므로 용량 표기가 실제와 어긋날 수 없습니다.
   sizeMB는 HF 저장소의 실제 q4f16 파일 크기입니다(측정값, 어림값 아님).

   기본이 0.6B인 이유: 이 모델이 하는 일은 "아래 위키 문단만 근거로 두어 문장 말하기"입니다.
   지식을 꺼내 오는 게 아니라 주어진 글을 다듬는 일이라, 파라미터를 6배 늘려도 방문자가
   느끼는 답의 질보다 3GB의 기다림이 먼저 옵니다. */
import type { DataType } from '@huggingface/transformers';

export type ModelSpec = {
  id: string;
  label: string;
  sizeMB: number;
  dtype: DataType;
  noThinking?: boolean;
};

export const MODELS: ModelSpec[] = [
  {
    id: 'onnx-community/Qwen3-0.6B-ONNX',
    label: 'Qwen3 0.6B',
    sizeMB: 570,
    dtype: 'q4f16',
    // Qwen3는 기본으로 사고 과정을 뱉습니다. 이력 문답에는 필요 없고 첫 글자까지가 훨씬 빨라집니다.
    noThinking: true,
  },
  {
    id: 'onnx-community/Qwen3-1.7B-ONNX',
    label: 'Qwen3 1.7B',
    sizeMB: 1426,
    dtype: 'q4f16',
    noThinking: true,
  },
];

/* 왜 Gemma 4가 아닌가: E2B는 멀티모달이라 AutoProcessor + Gemma4ForConditionalGeneration으로
   따로 태워야 하고, q4f16이 디코더 1.86GB + 임베딩 1.76GB = 3.4GB입니다. 텍스트만 쓰는
   이 화면에서 그 분기를 지고 가느니, 같은 causal-LM 경로를 쓰는 같은 계열의 큰 모델을
   "고품질" 자리에 둡니다 — 코드는 한 갈래로 남고 방문자는 570MB / 1.4GB 중에 고릅니다. */

export const DEFAULT_MODEL = MODELS[0];

/** 모르는 id는 기본 모델로 눕힙니다. 고르는 UI가 없으므로 여기 오는 id는 언제나
    이 표 안의 것이거나, 워커가 load 없이 받은 undefined입니다. */
export const byId = (id?: string): ModelSpec => MODELS.find((m) => m.id === id) ?? DEFAULT_MODEL;
