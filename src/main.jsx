import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.jsx';

// The sky is referenced from CSS but its URL has to respect the deploy base, and a
// relative url() inside a custom property resolves against the *stylesheet*, not the
// document — which turns "./assets/..." into "/assets/assets/...". Resolve it to an
// absolute URL here, before first paint, so there is no flash and no subpath break.
document.documentElement.style.setProperty(
  '--sky-img',
  `url("${new URL(`${import.meta.env.BASE_URL}assets/sky.webp`, document.baseURI).href}")`
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
