'use client';

import { useEffect, useRef, useState } from 'react';

export default function Live3D({ src }: { src: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [state, setState] = useState('idle');
  const [api, setApi] = useState('');

  useEffect(() => {
    const el = host.current;
    if (!el || !src) return;
    let stop = false;
    let dispose = () => {};

    // three는 ~150kB gzip — 초기 번들에 절대 넣지 않고, 이 섹션까지 실제로 스크롤했을 때만 받습니다.
    const io = new IntersectionObserver(async ([e]) => {
      if (!e.isIntersecting || stop) return;
      io.disconnect();
      setState('loading');
      try {
        // three 빌드는 평소에 하나만 받습니다. `three/webgpu`가 코어 클래스를 재수출하므로
        // 둘 다 import하면 같은 라이브러리를 두 벌(~190kB gzip 낭비) 싣게 됩니다 —
        // 진입점을 먼저 고르고 나서 import합니다.
        const useGPU = !!navigator.gpu;
        const THREE = useGPU ? await import('three/webgpu') : await import('three');
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
        if (stop) return;

        const w = el.clientWidth, h = el.clientHeight;

        let renderer, apiName = 'WebGL';
        if (useGPU) {
          try {
            // useGPU가 true인 갈래에서만 옵니다 — THREE는 그때 `three/webgpu`입니다.
            const GPU = THREE as typeof import('three/webgpu');
            const r = new GPU.WebGPURenderer({ antialias: true, alpha: true });
            await r.init();
            renderer = r;
            apiName = 'WebGPU';
          } catch (err) {
            console.warn('[aing-3d] WebGPU init failed, falling back to WebGL', err);
          }
        }
        if (!renderer) {
          // `three/webgpu`는 재수출 목록에 WebGLRenderer가 없습니다(RenderTarget들만 있습니다).
          // 그래서 여기서 THREE.WebGLRenderer를 부르면 `new undefined(...)`가 되어, navigator.gpu는
          // 있는데 init이 실패하는 기기 — 드라이버 블록리스트, 플래그로 끈 경우 — 에서 폴백이
          // 폴백이 아니라 에러였습니다. 그 경로에서만 코어 빌드를 마저 받습니다.
          const CORE = (useGPU ? await import('three') : THREE) as typeof import('three');
          if (stop) return;
          renderer = new CORE.WebGLRenderer({ antialias: true, alpha: true });
        }
        setApi(apiName);
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        renderer.setSize(w, h);
        el.appendChild(renderer.domElement);

        /* 여기서부터 렌더러는 GPU 컨텍스트를 쥐고 있습니다. 아래에 1.2MB GLB fetch가
           남아 있으므로, dispose를 그 뒤에서 대입하면 그 사이에 언마운트된 경우
           컨텍스트와 캔버스가 그대로 샙니다. 브라우저의 컨텍스트 예산은 8~16개라
           몇 번만 반복해도 이후 렌더러 생성이 실패합니다. 지금 걸어 두고 아래에서 늘립니다. */
        dispose = () => { renderer.dispose(); renderer.domElement.remove(); };

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 100);
        camera.position.set(0, 0.2, 3.2);

        scene.add(new THREE.HemisphereLight(0xdff1ff, 0xb8b0e8, 2.2));
        const key = new THREE.DirectionalLight(0xffffff, 1.6);
        key.position.set(2, 3, 2);
        scene.add(key);

        // GLB는 meshopt 압축본이라 디코더를 등록하지 않으면 로더가
        // EXT_meshopt_compression 확장에서 던집니다. (이 뷰어가 받는 건 205kB짜리
        // aing-lite.glb입니다 — 1.22MB 풀 모델은 킷 다운로드에 들어 있습니다.)
        const { MeshoptDecoder } = await import('three/examples/jsm/libs/meshopt_decoder.module.js');
        const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
        const gltf = await loader.loadAsync(src);
        if (stop) return;
        const model = gltf.scene;

        // 익스포터의 스케일·원점·방향이 생성마다 달라지므로 상수를 찍지 않고 모델 자신의
        // 바운드로 프레이밍합니다: 원점에 맞춘 뒤, 현재 화각에서 바운딩 스피어가 들어오는
        // 거리까지 카메라를 물립니다.
        const box = new THREE.Box3().setFromObject(model);
        const centre = box.getCenter(new THREE.Vector3());
        model.position.sub(centre);

        const pivot = new THREE.Group();
        pivot.add(model);
        pivot.rotation.y = Math.PI;      // tripo 익스포트는 카메라 반대편을 봅니다
        scene.add(pivot);

        const sphere = box.getBoundingSphere(new THREE.Sphere());
        const fit = sphere.radius / Math.sin((camera.fov * Math.PI) / 360);
        camera.position.set(0, sphere.radius * 0.05, fit * 0.95);
        camera.lookAt(0, 0, 0);
        camera.near = fit * 0.02;
        camera.far = fit * 6;
        camera.updateProjectionMatrix();

        const mixer = gltf.animations?.length ? new THREE.AnimationMixer(model) : null;
        gltf.animations?.forEach((c) => mixer!.clipAction(c).play());   // 클립이 있으면 mixer도 있습니다

        let drag: number | null = null, spin = 0, vel = 0.004;
        const down = (e: PointerEvent) => { drag = e.clientX; vel = 0; };
        const move = (e: PointerEvent) => { if (drag != null) { spin += (e.clientX - drag) * 0.01; drag = e.clientX; } };
        const up = () => { drag = null; vel = 0.004; };
        el.addEventListener('pointerdown', down);
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);

        const clock = new THREE.Clock();
        renderer.setAnimationLoop(() => {
          spin += vel;
          pivot.rotation.y = Math.PI + spin;
          mixer?.update(clock.getDelta());
          renderer.render(scene, camera);
        });

        const onResize = () => {
          const nw = el.clientWidth, nh = el.clientHeight;
          camera.aspect = nw / nh; camera.updateProjectionMatrix(); renderer.setSize(nw, nh);
        };
        window.addEventListener('resize', onResize);
        setState('ready');

        dispose = () => {
          renderer.setAnimationLoop(null);
          el.removeEventListener('pointerdown', down);
          window.removeEventListener('pointermove', move);
          window.removeEventListener('pointerup', up);
          window.removeEventListener('resize', onResize);
          renderer.dispose();
          renderer.domElement.remove();
        };
      } catch (err) {
        console.error('[aing-3d]', err);
        setState('error');
      }
    }, { rootMargin: '200px' });

    io.observe(el);
    return () => { stop = true; io.disconnect(); dispose(); };
  }, [src]);

  return (
    <div className="kit3d">
      <div className="kit3d__stage" ref={host} />
      <p className="kit3d__note">
        {state === 'error'
          ? '3D 모델을 불러오지 못했습니다.'
          : state === 'ready'
            ? `드래그해서 돌려보세요 · GLB · ${api}`
            : 'GLB 불러오는 중…'}
      </p>
    </div>
  );
}
