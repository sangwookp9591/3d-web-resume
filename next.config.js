/** @type {import('next').NextConfig} */
const nextConfig = {
  // transformers.js ships an onnxruntime-node binary it only needs on a server; the
  // model runs in a browser worker here, so keep it out of the server bundle entirely.
  serverExternalPackages: ['@huggingface/transformers'],

  async headers() {
    return [
      {
        // The worker downloads the model from the HF CDN and runs it through WebGPU.
        // Cross-origin isolation is not required for that, but the model files are
        // immutable and large — let the browser keep them.
        source: '/:path*',
        headers: [{ key: 'X-Content-Type-Options', value: 'nosniff' }],
      },
    ];
  },
};

export default nextConfig;
