/** @type {import('next').NextConfig} */
const nextConfig = {
  // transformers.js는 서버에서만 쓰는 onnxruntime-node 바이너리를 함께 싣습니다.
  // 여기서는 모델이 브라우저 워커에서 도므로 서버 번들에서 통째로 뺍니다.
  serverExternalPackages: ['@huggingface/transformers'],
};

export default nextConfig;
