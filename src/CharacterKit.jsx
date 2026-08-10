import { useEffect, useRef, useState } from 'react';

/* The mascot is a real asset, not page decoration — so the page shows the whole kit and
   hands it over: alpha cutouts for the web, a uniform-grid atlas any 2D engine can slice,
   PNG sequences, and a GLB. Everything is read from public/mascot/aing-kit.json, so
   regenerating the kit updates this section without touching the component. */

function Live3D({ src }) {
  const host = useRef(null);
  const [state, setState] = useState('idle');
  const [api, setApi] = useState('');

  useEffect(() => {
    const el = host.current;
    if (!el || !src) return;
    let stop = false;
    let dispose = () => {};

    // three is ~150kB gzip — never in the initial bundle, only once this section
    // is actually scrolled to.
    const io = new IntersectionObserver(async ([e]) => {
      if (!e.isIntersecting || stop) return;
      io.disconnect();
      setState('loading');
      try {
        // Exactly ONE three build is fetched. `three/webgpu` already re-exports the core
        // classes, so importing it *and* `three` would ship two copies of the same
        // library (~190kB gzip wasted) — pick the entry point first, then import.
        const useGPU = !!navigator.gpu;
        const THREE = useGPU ? await import('three/webgpu') : await import('three');
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
        if (stop) return;

        const w = el.clientWidth, h = el.clientHeight;

        let renderer, apiName = 'WebGL';
        if (useGPU) {
          try {
            const r = new THREE.WebGPURenderer({ antialias: true, alpha: true });
            await r.init();
            renderer = r;
            apiName = 'WebGPU';
          } catch (e) {
            console.warn('[aing-3d] WebGPU init failed, falling back to WebGL', e);
          }
        }
        renderer = renderer || new THREE.WebGLRenderer({ antialias: true, alpha: true });
        setApi(apiName);
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        renderer.setSize(w, h);
        el.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 100);
        camera.position.set(0, 0.2, 3.2);

        scene.add(new THREE.HemisphereLight(0xdff1ff, 0xb8b0e8, 2.2));
        const key = new THREE.DirectionalLight(0xffffff, 1.6);
        key.position.set(2, 3, 2);
        scene.add(key);

        // The GLB ships meshopt-compressed (54 MB raw → 200 kB), so the decoder has to
        // be registered or the loader throws on the EXT_meshopt_compression extension.
        const { MeshoptDecoder } = await import('three/examples/jsm/libs/meshopt_decoder.module.js');
        const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
        const gltf = await loader.loadAsync(src);
        if (stop) return;
        const model = gltf.scene;

        // The exporter's scale, origin and facing all vary per generation, so frame the
        // model from its own bounds rather than guessing constants: centre it on the
        // origin, then pull the camera back to the distance that fits its bounding
        // sphere in the current field of view.
        const box = new THREE.Box3().setFromObject(model);
        const centre = box.getCenter(new THREE.Vector3());
        model.position.sub(centre);

        const pivot = new THREE.Group();
        pivot.add(model);
        pivot.rotation.y = Math.PI;      // tripo exports facing away from the camera
        scene.add(pivot);

        const sphere = box.getBoundingSphere(new THREE.Sphere());
        const fit = sphere.radius / Math.sin((camera.fov * Math.PI) / 360);
        camera.position.set(0, sphere.radius * 0.05, fit * 0.95);
        camera.lookAt(0, 0, 0);
        camera.near = fit * 0.02;
        camera.far = fit * 6;
        camera.updateProjectionMatrix();

        const mixer = gltf.animations?.length ? new THREE.AnimationMixer(model) : null;
        gltf.animations?.forEach((c) => mixer.clipAction(c).play());

        let drag = null, spin = 0, vel = 0.004;
        const down = (e) => { drag = e.clientX; vel = 0; };
        const move = (e) => { if (drag != null) { spin += (e.clientX - drag) * 0.01; drag = e.clientX; } };
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

function Row({ title, note, items, base, big }) {
  if (!items?.length) return null;
  return (
    <div className="kit__row">
      <div className="kit__rowhead">
        <h3 className="kit__rowtitle">{title}</h3>
        <p className="kit__rownote">{note}</p>
      </div>
      <ul className={`kit__grid${big ? ' kit__grid--big' : ''}`}>
        {items.map((it) => (
          <li className="kit__cell" key={it.name}>
            <img src={`${base}${it.file}`} alt={it.name} loading="lazy" />
            <span className="kit__name">{it.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CharacterKit() {
  const [kit, setKit] = useState(null);
  const base = `${import.meta.env.BASE_URL}mascot/`;

  useEffect(() => {
    fetch(`${base}aing-kit.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setKit)
      .catch((e) => console.error('[aing-kit]', e));
  }, [base]);

  if (!kit) return null;

  const toItems = (setname) =>
    (kit.sets?.[setname]?.frames || []).map((n) => ({ name: n, file: `${setname}/${n}.webp` }));
  const motions = (kit.motion || []).map((m) => ({ name: m.name, file: m.webp }));
  const glb = kit.model3d?.aing ?? (kit.model3d ? Object.values(kit.model3d)[0] : null);

  return (
    <section className="kit" id="aing" data-stage="kit">
      <div className="kit__head">
        <p className="eyebrow">Ai-ng · 캐릭터 킷</p>
        <h2 className="kit__title">여기까지 안내한 고양이는, 쓸 수 있는 에셋입니다</h2>
        <p className="kit__lead">
          표정과 액션을 시트로 뽑고, 모션은 알파 애니메이션으로, 형태는 3D 모델로 만들었습니다.
          웹은 물론 three.js·WebGPU·Unity에서 바로 쓸 수 있게 아틀라스와 매니페스트를 함께 냅니다.
        </p>
      </div>

      {glb && <Live3D src={`${base}${glb}`} />}

      <Row title="모션" note="알파 애니메이션 WebP · PNG 시퀀스 동봉" items={motions} base={base} big />
      <Row title="표정" note={`${toItems('expr').length}종 · 알파 컷아웃`} items={toItems('expr')} base={base} />
      <Row title="액션" note={`${toItems('pose').length}종 · 알파 컷아웃`} items={toItems('pose')} base={base} />

      {kit.download && (
        <a className="kit__dl" href={`${base}${kit.download}`} download>
          킷 내려받기 · 표정·액션·모션·아틀라스·GLB
        </a>
      )}

      <ul className="kit__use">
        {Object.entries(kit.usage || {}).map(([k, v]) => (
          <li className="kit__usecell" key={k}>
            <code>{k}</code>
            <span>{v}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
