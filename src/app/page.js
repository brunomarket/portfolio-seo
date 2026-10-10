'use client';

import { useState, Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import { Book } from '@/components/Book';
import { FillerBook } from '@/components/FillerBook';
import { RubberDuck } from '@/components/RubberDuck';
import { Bookshelf } from '@/components/Bookshelf'; 
import { ProjectOverlay } from '@/components/ProjectOverlay';
import { Atmosphere } from '@/components/Atmosphere';
import { MouseLight } from '@/components/MouseLight';
import { ControlsHint } from '@/components/ControlsHint';
import { projects } from '@/data/projects';

// Posição inicial da câmera: de frente para a estante (reset pela tecla R)
const INITIAL_CAMERA_POSITION = [0, 0.5, 2.5];

export default function LibraryPage() {
  const [activeProject, setActiveProject] = useState(null);
  const controlsRef = useRef(null);
  const resetAnimRef = useRef(null); // id do rAF da transição suave do R

  // Tecla "R": retorna a câmera à posição inicial (frente para a estante) com
  // transição SUAVE — interpola em coordenadas esféricas (arco de órbita, sempre
  // dentro dos limites do OrbitControls) com easeInOutCubic em 800ms. Qualquer
  // interação do usuário (roda/clique) cancela a animação e retoma o controle.
  useEffect(() => {
    const cancelReset = () => {
      if (resetAnimRef.current !== null) {
        cancelAnimationFrame(resetAnimRef.current);
        resetAnimRef.current = null;
      }
    };

    const onKeyDown = (event) => {
      if (event.key !== 'r' && event.key !== 'R') return;
      const tag = event.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || event.target?.isContentEditable) return;
      const controls = controlsRef.current;
      if (!controls) return; // OrbitControls ainda não montado (ex.: WebGL indisponível)

      cancelReset();

      const camera = controls.object;
      const s = camera.position;
      const [tx, ty, tz] = INITIAL_CAMERA_POSITION;

      // Esféricas inicial/final: theta = ângulo polar, phi = azimuth
      const r0 = Math.hypot(s.x, s.y, s.z);
      const th0 = Math.acos(Math.min(1, Math.max(-1, s.y / r0)));
      const ph0 = Math.atan2(s.x, s.z);
      const r1 = Math.hypot(tx, ty, tz);
      const th1 = Math.acos(Math.min(1, Math.max(-1, ty / r1)));
      const ph1 = Math.atan2(tx, tz);

      const DURATION = 800; // ms
      const t0 = performance.now();

      const step = (now) => {
        const t = Math.min((now - t0) / DURATION, 1);
        const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; // easeInOutCubic
        const r = r0 + (r1 - r0) * e;
        const th = th0 + (th1 - th0) * e;
        const ph = ph0 + (ph1 - ph0) * e;
        camera.position.set(
          r * Math.sin(th) * Math.sin(ph),
          r * Math.cos(th),
          r * Math.sin(th) * Math.cos(ph)
        );
        controls.target.set(0, 0, 0);
        controls.update();
        if (t < 1) resetAnimRef.current = requestAnimationFrame(step);
        else resetAnimRef.current = null;
      };
      resetAnimRef.current = requestAnimationFrame(step);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('wheel', cancelReset, { passive: true });
    window.addEventListener('pointerdown', cancelReset);
    return () => {
      cancelReset();
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('wheel', cancelReset);
      window.removeEventListener('pointerdown', cancelReset);
    };
  }, []);

  const fillerBooks = [
    { id: 'f1', pos: [-1.9, -0.025, 0], rot: [0, 0, 0], color: '#3e2723', size: [0.15, 0.95, 0.8] },
    { id: 'f2', pos: [-1.65, -0.075, 0], rot: [0, 0, 0], color: '#1a237e', size: [0.12, 0.85, 0.75] },
    { id: 'f3', pos: [-1.45, 0, 0], rot: [0, 0.1, 0], color: '#004d40', size: [0.18, 1.0, 0.8] },
    { id: 'f4', pos: [1.2, -0.05, 0],  rot: [0, -0.1, 0], color: '#4a148c', size: [0.14, 0.9, 0.78] },
    { id: 'f5', pos: [1.4, -0.04, 0],  rot: [0, 0, -0.05], color: '#b71c1c', size: [0.16, 0.92, 0.8] },
    { id: 'f6', pos: [1.6, -0.2, 0], rot: [0, 0, 0.4],  color: '#212121', size: [0.12, 0.8, 0.7] },
    { id: 'f7', pos: [1.9, -0.425, 0], rot: [0, 0, 1.57], color: '#1b5e20', size: [0.15, 0.9, 0.8] },
  ];

  return (
    <div className="h-screen w-full bg-black relative">
      <ProjectOverlay activeProject={activeProject} onClose={() => setActiveProject(null)} />
      {!activeProject && <ControlsHint />}
      
      <Canvas shadows camera={{ position: INITIAL_CAMERA_POSITION, fov: 50 }}>
        <Suspense fallback={null}>
          <Atmosphere />
          <MouseLight />
          
          <group position={[0, -0.2, 0]}>
            <Bookshelf />

            <RubberDuck 
              position={[-2.2, -0.5, -0.2]} 
              rotation={[0, 0.8 + Math.PI, 0]} 
            />

            {fillerBooks.map((book) => (
              <FillerBook 
                key={book.id}
                position={book.pos}
                rotation={book.rot}
                color={book.color}
                args={book.size}
              />
            ))}

            <group position={[-((projects.length * 0.2) / 2) + 0.1, 0, 0]}>
              {projects.map((project, index) => (
                <Book 
                  key={project.id} 
                  project={project} 
                  position={[index * 0.25, 0, 0]} 
                  onSelect={setActiveProject}
                />
              ))}
            </group>
          </group>

          <OrbitControls 
            ref={controlsRef}
            enablePan={false}
            minDistance={1.5}
            maxDistance={5}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.8}
            maxAzimuthAngle={Math.PI / 4}
            minAzimuthAngle={-Math.PI / 4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
