'use client';

import {
  useRef,
  useState,
  useEffect,
  Suspense,
  ChangeEvent,
  PointerEvent,
} from 'react';
import { useParams } from 'next/navigation';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VRMLoaderPlugin, VRM } from '@pixiv/three-vrm';
import { Euler, Quaternion, Vector3, Camera, Matrix4 } from 'three';

// --- Expression Controller Component ---
function ExpressionController({ vrm }: { vrm: VRM }) {
  const proxy = vrm.blendShapeProxy;
  if (!proxy || !proxy.expressions) return null;

  const names = Object.keys(proxy.expressions);
  const [values, setValues] = useState<Record<string, number>>(
    names.reduce((acc, name) => ({ ...acc, [name]: 0 }), {})
  );

  useEffect(() => {
    names.forEach((name) => proxy.setValue(name, values[name]));
    proxy.applyValues();
  }, [values]);

  return (
    <div className="absolute top-4 left-4 p-4 bg-white bg-opacity-80 rounded shadow space-y-2 max-h-64 overflow-auto z-20">
      <h2 className="text-lg font-semibold">表情コントローラー</h2>
      {names.map((name) => (
        <div key={name} className="flex items-center space-x-2">
          <label className="w-24 text-sm">{name}</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={values[name]}
            onChange={(e) =>
              setValues((v) => ({ ...v, [name]: parseFloat(e.target.value) }))
            }
          />
          <span className="w-8 text-sm">{values[name].toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}

// --- Helper ModelLoader ---
function ModelLoader({
  url,
  onLoaded,
  position,
  modelRef,
}: {
  url: string;
  onLoaded: (vrm: VRM) => void;
  position: [number, number, number];
  modelRef: React.MutableRefObject<THREE.Group | null>;
}) {
  const gltf = useLoader(
    GLTFLoader,
    url,
    (loader) => loader.register((parser) => new VRMLoaderPlugin(parser))
  ) as any;
  const vrm = (gltf.userData as { vrm?: VRM }).vrm!;

  useEffect(() => onLoaded(vrm), [vrm]);

  const ref = useRef<THREE.Group>(null);
  useEffect(() => {
    modelRef.current = ref.current;
  }, [ref.current]);
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.005;
      ref.current.position.set(...position);
    }
  });
  return (
    <group ref={ref}>
      <primitive object={vrm.scene} />
    </group>
  );
}

// --- Wave Animation Controller ---
function WaveController({
  vrm,
  trigger,
}: {
  vrm: VRM;
  trigger: number;
}) {
  const waveRef = useRef({
    isWaving: false,
    progress: 0,
    originalQuat: new Quaternion(),
  });

  useEffect(() => {
    const arm = vrm.humanoid?.getBoneNode('leftUpperArm');
    if (!arm) return;
    waveRef.current.originalQuat.copy(arm.quaternion);
    waveRef.current.progress = 0;
    waveRef.current.isWaving = true;
  }, [trigger]);

  useFrame((_, delta) => {
    if (!waveRef.current.isWaving) return;
    const arm = vrm.humanoid?.getBoneNode('leftUpperArm');
    if (!arm) return;

    const { originalQuat } = waveRef.current;
    const duration = 1.0;
    waveRef.current.progress += delta;
    const t = waveRef.current.progress;

    if (t >= duration) {
      arm.quaternion.copy(originalQuat);
      waveRef.current.isWaving = false;
    } else {
      const angle = Math.sin((t / duration) * Math.PI * 2) * 0.5;
      const deltaQuat = new Quaternion().setFromEuler(new Euler(angle, 0, 0));
      arm.quaternion.copy(originalQuat).multiply(deltaQuat);
    }
  });

  return null;
}

// --- Shooting Game Component ---
function ShootingGame({
  modelRef,
  camera,
}: {
  modelRef: React.MutableRefObject<THREE.Group | null>;
  camera: Camera;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const bullets = useRef<{ x: number; y: number }[]>([]);
  const enemies = useRef<
    { x: number; y: number; bullets: { x: number; y: number }[] }[]
  >([]);
  const raf = useRef(0);
  const jsRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  // 敵スポーン
  useEffect(() => {
    if (gameOver) return;
    const id = setInterval(() => {
      enemies.current.push({ x: Math.random() * innerWidth, y: -20, bullets: [] });
    }, 1200);
    return () => clearInterval(id);
  }, [gameOver]);

  // メインループ
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    function loop() {
      if (!ctx) return;
      const w = innerWidth,
        h = innerHeight;
      canvasRef.current!.width = w;
      canvasRef.current!.height = h;
      ctx.clearRect(0, 0, w, h);

      const wp = new Vector3();
      modelRef.current!.getWorldPosition(wp);
      wp.project(camera);
      const px = ((wp.x + 1) / 2) * w;
      const py = ((-wp.y + 1) / 2) * h;

      ctx.fillStyle = 'blue';
      ctx.beginPath();
      ctx.arc(px, py, 20, 0, Math.PI * 2);
      ctx.fill();

      bullets.current = bullets.current
        .map(b => ({ x: b.x, y: b.y - 8 }))
        .filter(b => b.y > 0);
      bullets.current.forEach(b => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(b.x - 4, b.y - 12, 8, 12);
      });

      enemies.current = enemies.current
        .map(e => {
          e.y += 1.5;
          if (Math.random() < 0.01) e.bullets.push({ x: e.x, y: e.y + 10 });
          return e;
        })
        .filter(e => e.y < h + 20);
      enemies.current.forEach(e => {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(e.x, e.y, 15, 0, Math.PI * 2);
        ctx.fill();
        e.bullets = e.bullets
          .map(b => ({ x: b.x, y: b.y + 5 }))
          .filter(b => b.y < h);
        e.bullets.forEach(b => {
          ctx.fillStyle = 'white';
          ctx.fillRect(b.x - 3, b.y - 3, 6, 6);
        });
      });

      bullets.current.forEach((b, bi) => {
        enemies.current.forEach((e, ei) => {
          if (Math.hypot(b.x - e.x, b.y - e.y) < 20) {
            setScore(s => s + 1);
            enemies.current.splice(ei, 1);
            bullets.current.splice(bi, 1);
          }
        });
      });

      let dead = false;
      enemies.current.forEach(e => {
        if (Math.hypot(px - e.x, py - e.y) < 35) dead = true;
        e.bullets.forEach(b => {
          if (Math.hypot(px - b.x, py - b.y) < 20) dead = true;
        });
      });
      if (dead && !gameOver) {
        setGameOver(true);
        return;
      }

      ctx.fillStyle = 'white';
      ctx.font = '20px sans-serif';
      ctx.fillText(`Score: ${score}`, 20, 30);

      raf.current = requestAnimationFrame(loop);
    }
    loop();
    return () => cancelAnimationFrame(raf.current);
  }, [camera, score, gameOver]);

  // クリックまたはスペースキーで射撃
  const handleShoot = () => {
    if (gameOver) return;
    const wp = new Vector3();
    modelRef.current!.getWorldPosition(wp);
    wp.project(camera);
    const w = innerWidth,
      h = innerHeight;
    bullets.current.push({
      x: ((wp.x + 1) / 2) * w,
      y: ((-wp.y + 1) / 2) * h - 20,
    });
  };

  // スペースキー入力ハンドラ
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleShoot();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, camera, modelRef]);

  // シューティング用ジョイスティック（左右移動）
  useEffect(() => {
    const js = jsRef.current;
    if (!js || !modelRef.current) return;
    const onDown = (e: PointerEvent) => {
      js.setPointerCapture(e.pointerId);
      dragging.current = true;
    };
    const onUp = () => {
      dragging.current = false;
      if (knobRef.current) knobRef.current.style.transform = '';
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging.current || !modelRef.current) return;
      const r = js.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const max = r.width / 2;
      const mag = Math.min(Math.abs(dx), max);
      const dir = dx / (mag || 1);
      if (knobRef.current) {
        knobRef.current.style.transform = `translate(${dir * mag}px,0)`;
      }
      modelRef.current.position.x += dir * 0.05;
    };
    js.addEventListener('pointerdown', onDown);
    js.addEventListener('pointermove', onMove);
    js.addEventListener('pointerup', onUp);
    js.addEventListener('pointerleave', onUp);
    return () => {
      js.removeEventListener('pointerdown', onDown);
      js.removeEventListener('pointermove', onMove);
      js.removeEventListener('pointerup', onUp);
      js.removeEventListener('pointerleave', onUp);
    };
  }, [modelRef]);

  return (
    <div className="absolute inset-0 z-20" onClick={handleShoot}>
      <canvas ref={canvasRef} className="w-full h-full" />
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center text-4xl text-red-500 font-bold bg-black bg-opacity-50">
          GAME OVER
          <br />
          <span className="text-white text-xl">Score: {score}</span>
        </div>
      )}
      <div
        ref={jsRef}
        className="absolute bottom-8 left-8 w-32 h-32 bg-white bg-opacity-50 rounded-full touch-none z-30"
      >
        <div
          ref={knobRef}
          className="w-16 h-16 bg-blue-600 bg-opacity-75 rounded-full m-8"
        />
      </div>
    </div>
  );
}

// --- Main ViewerPage Component ---
export default function ViewerPage() {
  const { locale } = useParams()!;
  const [fileUrl, setFileUrl] = useState<string>('');
  const initialPos: [number, number, number] = [0, 0, 0];
  const [pos, setPos] = useState<[number, number, number]>(initialPos);
  const [bgMode, setBgMode] = useState<'green' | 'image'>('green');
  const [bgImageUrl, setBgImageUrl] = useState<string>('');
  const [vrmInstance, setVrmInstance] = useState<VRM | null>(null);
  const [waveTrigger, setWaveTrigger] = useState(0);
  const [mode, setMode] = useState<'viewer' | 'shooting'>('viewer');
  const modelRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<Camera>(null!);
  const joystickRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  function CameraCapture() {
    const { camera } = useThree();
    useEffect(() => {
      cameraRef.current = camera;
    }, [camera]);
    return null;
  }

  const getCameraRotationMatrix = () => {
    const matrix = new Matrix4();
    if (cameraRef.current) {
      matrix.extractRotation(cameraRef.current.matrixWorld);
    }
    return matrix;
  };

  useEffect(() => {
    const step = 0.1;
    const handler = (e: KeyboardEvent) => {
      setPos(([x, y, z]) => {
        const matrix = getCameraRotationMatrix();
        let move = new Vector3(0, 0, 0);
        if (e.key === 'w' || e.key === 'ArrowUp') move.z = -step;
        if (e.key === 's' || e.key === 'ArrowDown') move.z = step;
        if (e.key === 'a' || e.key === 'ArrowLeft') move.x = -step;
        if (e.key === 'd' || e.key === 'ArrowRight') move.x = step;
        move.applyMatrix4(matrix);
        return [x + move.x, y, z + move.z];
      });
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    const js = joystickRef.current;
    if (!js) return;
    const onPointerDown = (e: PointerEvent) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragging(true);
    };
    const onPointerUp = () => {
      setDragging(false);
      if (knobRef.current) knobRef.current.style.transform = '';
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging || !joystickRef.current || !knobRef.current) return;
      const rect = joystickRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const max = rect.width / 2;
      const mag = Math.hypot(dx, dy);
      const ratio = mag > 0 ? Math.min(mag / max, 1) : 0;
      const ux = mag > 0 ? dx / mag : 0;
      const uy = mag > 0 ? dy / mag : 0;
      const nx = ux * ratio * max;
      const ny = uy * ratio * max;
      knobRef.current.style.transform = `translate(${nx}px, ${ny}px)`;
      const speed = 0.02;
      const move = new Vector3(ux * ratio * speed, 0, uy * ratio * speed);
      move.applyMatrix4(getCameraRotationMatrix());
      setPos(([x, y, z]) => [x + move.x, y, z + move.z]);
    };
    js.addEventListener('pointerdown', onPointerDown);
    js.addEventListener('pointermove', onPointerMove);
    js.addEventListener('pointerup', onPointerUp);
    js.addEventListener('pointerleave', onPointerUp);
    return () => {
      js.removeEventListener('pointerdown', onPointerDown);
      js.removeEventListener('pointermove', onPointerMove);
      js.removeEventListener('pointerup', onPointerUp);
      js.removeEventListener('pointerleave', onPointerUp);
    };
  }, [dragging, fileUrl, mode]);

  useEffect(() => {
    if (!vrmInstance) return;
    const proxy = vrmInstance.blendShapeProxy;
    if (!proxy) return;
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const ctx = new AudioContext();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      src.connect(analyser);
      analyser.fftSize = 256;
      const data = new Uint8Array(analyser.frequencyBinCount);
      const loop = () => {
        analyser.getByteFrequencyData(data);
        const level = data.reduce((sum, v) => sum + v, 0) / data.length / 255;
        proxy.setValue('A', level);
        proxy.applyValues();
        requestAnimationFrame(loop);
      };
      loop();
    });
  }, [vrmInstance]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileUrl(URL.createObjectURL(file));
  };
  const handleBgImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setBgImageUrl(URL.createObjectURL(file));
  };
  const resetPosition = () => setPos(initialPos);
  const bgStyle: React.CSSProperties =
    bgMode === 'green'
      ? { backgroundColor: 'limegreen' }
      : {
          backgroundImage: `url(${bgImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };

  return (
    <div className="relative h-screen w-full flex flex-col">
      <header className="p-4 bg-white z-10 flex flex-wrap gap-2">
        <h1 className="w-full text-3xl font-bold">
          {locale === 'en' ? '3D Viewer' : '3D ビューア'}
        </h1>
        <input
          type="file"
          accept=".vrm"
          onChange={handleFileChange}
          className="border p-2 rounded"
        />
        <select
          value={bgMode}
          onChange={(e) => setBgMode(e.target.value as any)}
          className="border p-2 rounded"
        >
          <option value="green">
            {locale === 'en' ? 'Green Back' : 'グリーンバック'}
          </option>
          <option value="image">
            {locale === 'en' ? 'Custom Image' : 'カスタム画像'}
          </option>
        </select>
        {bgMode === 'image' && (
          <input
            type="file"
            accept="image/*"
            onChange={handleBgImageChange}
            className="border p-2 rounded"
          />
        )}
        <button
          onClick={() => setMode((m) => (m === 'viewer' ? 'shooting' : 'viewer'))}
          className="border p-2 rounded bg-blue-500 text-white"
        >
          {mode === 'viewer'
            ? locale === 'en'
              ? 'Enter Shooting Mode'
              : 'シューティングモードへ'
            : locale === 'en'
            ? 'Exit Shooting Mode'
            : 'ビューアへ戻る'}
        </button>
      </header>

      <div className="flex-1 relative" style={bgStyle}>
        {fileUrl ? (
          <Canvas shadows camera={{ position: [0, 1.5, 3], fov: 50 }}>
            <CameraCapture />
            <ambientLight intensity={0.5} />
            <directionalLight
              intensity={1}
              position={[0, 5, 5]}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            <Suspense fallback={null}>
              <ModelLoader
                url={fileUrl}
                position={pos}
                onLoaded={setVrmInstance}
                modelRef={modelRef}
              />
            </Suspense>
            {vrmInstance && (
              <WaveController vrm={vrmInstance} trigger={waveTrigger} />
            )}
            <OrbitControls
              enablePan={false}
              enableZoom
              minPolarAngle={0}
              maxPolarAngle={Math.PI / 2}
            />
          </Canvas>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            {locale === 'en'
              ? 'Please select a VRM file above.'
              : 'まずは VRM ファイルを選択してください。'}
          </div>
        )}

        {fileUrl && (
          <>
            <button
              onClick={resetPosition}
              className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow z-10"
            >
              {locale === 'en' ? 'Reset' : '初期配置に戻す'}
            </button>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-10">
              <button
                onClick={() => setPos(([x, y, z]) => {
                  const matrix = getCameraRotationMatrix();
                  const move = new Vector3(0, 0, -0.1);
                  move.applyMatrix4(matrix);
                  return [x + move.x, y, z + move.z];
                })}
                className="w-12 h-12 bg-white bg-opacity-75 rounded-full flex items-center justify-center shadow"
              >
                ↑
              </button>
              <div className="flex space-x-4">
                <button
                  onClick={() => setPos(([x, y, z]) => {
                    const matrix = getCameraRotationMatrix();
                    const move = new Vector3(-0.1, 0, 0);
                    move.applyMatrix4(matrix);
                    return [x + move.x, y, z + move.z];
                  })}
                  className="w-12 h-12 bg-white bg-opacity-75 rounded-full flex items-center justify-center shadow"
                >
                  ←
                </button>
                <button
                  onClick={() => setPos(([x, y, z]) => {
                    const matrix = getCameraRotationMatrix();
                    const move = new Vector3(0.1, 0, 0);
                    move.applyMatrix4(matrix);
                    return [x + move.x, y, z + move.z];
                  })}
                  className="w-12 h-12 bg-white bg-opacity-75 rounded-full flex items-center justify-center shadow"
                >
                  →
                </button>
              </div>
              <button
                onClick={() => setPos(([x, y, z]) => {
                  const matrix = getCameraRotationMatrix();
                  const move = new Vector3(0, 0, 0.1);
                  move.applyMatrix4(matrix);
                  return [x + move.x, y, z + move.z];
                })}
                className="w-12 h-12 bg-white bg-opacity-75 rounded-full flex items-center justify-center shadow"
              >
                ↓
              </button>
            </div>

            {mode === 'viewer' && (
              <div
                ref={joystickRef}
                className="absolute bottom-8 right-8 w-32 h-32 bg-white bg-opacity-50 rounded-full touch-none z-10"
              >
                <div
                  ref={knobRef}
                  className="w-16 h-16 bg-blue-600 bg-opacity-75 rounded-full m-8"
                />
              </div>
            )}

            <button
              onClick={() => vrmInstance && setWaveTrigger((t) => t + 1)}
              className="absolute top-20 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow z-10"
            >
              Wave!
            </button>

            {mode === 'viewer' && vrmInstance && vrmInstance.blendShapeProxy && (
              <ExpressionController vrm={vrmInstance} />
            )}
            {mode === 'shooting' && modelRef.current && cameraRef.current && (
              <ShootingGame modelRef={modelRef} camera={cameraRef.current} />
            )}
          </>
        )}
      </div>
    </div>
  );
}