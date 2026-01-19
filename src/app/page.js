'use client';

import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import { Book } from '@/components/Book';
import { FillerBook } from '@/components/FillerBook';
import { RubberDuck } from '@/components/RubberDuck';
import { Bookshelf } from '@/components/Bookshelf'; 
import { ProjectOverlay } from '@/components/ProjectOverlay';
import { Atmosphere } from '@/components/Atmosphere';
import { MouseLight } from '@/components/MouseLight';
import { projects } from '@/data/projects';

export default function LibraryPage() {
  const [activeProject, setActiveProject] = useState(null);

  const fillerBooks = [
    // --- LADO ESQUERDO ---
    
    // f1 (O problemático): 
    // Movi para X = -1.9 (Mais para esquerda)
    // Rotação Y = 0 (Totalmente Vertical)
    // Altura corrigida para chão (-0.025)
    { id: 'f1', pos: [-1.9, -0.025, 0], rot: [0, 0, 0], color: '#3e2723', size: [0.15, 0.95, 0.8] },
    
    // f2: Mantive em -1.65 (Dando um respiro de 0.25 de distância)
    { id: 'f2', pos: [-1.65, -0.075, 0], rot: [0, 0, 0], color: '#1a237e', size: [0.12, 0.85, 0.75] },
    
    // f3: Inclinado levemente
    { id: 'f3', pos: [-1.45, 0, 0], rot: [0, 0.1, 0], color: '#004d40', size: [0.18, 1.0, 0.8] },
    
    // --- LADO DIREITO ---
    { id: 'f4', pos: [1.2, -0.05, 0],  rot: [0, -0.1, 0], color: '#4a148c', size: [0.14, 0.9, 0.78] },
    { id: 'f5', pos: [1.4, -0.04, 0],  rot: [0, 0, -0.05], color: '#b71c1c', size: [0.16, 0.92, 0.8] },
    { id: 'f6', pos: [1.6, -0.2, 0],  rot: [0, 0, 0.4],  color: '#212121', size: [0.12, 0.8, 0.7] },
    { id: 'f7', pos: [1.9, -0.425, 0],  rot: [0, 0, 1.57], color: '#1b5e20', size: [0.15, 0.9, 0.8] },
  ];

  return (
    <div className="h-screen w-full bg-black relative">
      <ProjectOverlay activeProject={activeProject} onClose={() => setActiveProject(null)} />
      
      <Canvas shadows camera={{ position: [0, 0.5, 2.5], fov: 50 }}>
        <Suspense fallback={null}>
          <Atmosphere />
          <MouseLight />
          
          <group position={[0, -0.2, 0]}>
            <Bookshelf />

            {/* === O PATINHO === */}
            {/* Rotação ajustada:
                Antes: 0.8
                Agora: 0.8 + Math.PI (3.94) -> Vira 180 graus
                Isso deve fazer ele olhar para a frente/câmera agora.
            */}
            <RubberDuck 
              position={[-2.2, -0.5, -0.2]} 
              rotation={[0, 0.8 + Math.PI, 0]} 
            />

            {/* === LIVROS DECORATIVOS === */}
            {fillerBooks.map((book) => (
              <FillerBook 
                key={book.id}
                position={book.pos}
                rotation={book.rot}
                color={book.color}
                args={book.size}
              />
            ))}

            {/* === PROJETOS REAIS === */}
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