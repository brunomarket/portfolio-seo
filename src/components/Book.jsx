// src/components/Book.jsx
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

export function Book({ project, position, onSelect, rotation }) {
  const groupRef = useRef();
  const [hovered, setHover] = useState(false);

  useFrame(() => {
    // Animação simples de hover (o livro vem para frente)
    // O grupo interno move mesh E texto juntos, para o título colado na lombada
    const targetZ = hovered ? 0.3 : 0;
    // Interpolação suave (Lerp) para não pular seco
    groupRef.current.position.z += (targetZ - groupRef.current.position.z) * 0.1;
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Grupo animado: concentra o movimento de hover (mesh + lombada) */}
      <group
        ref={groupRef}
        onClick={(e) => {
          e.stopPropagation(); // Evita clicar em coisas atrás
          onSelect(project);
        }}
        onPointerOver={() => { setHover(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHover(false); document.body.style.cursor = 'auto'; }}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.2, 1.2, 0.8]} />
          <meshStandardMaterial 
              color={project.color} 
              roughness={0.8} 
              metalness={0.1} 
          />
        </mesh>

        {/* Título na lombada: face frontal (+Z) voltada para a câmera,
            girado90° para caber na largura estreita da lombada */}
        <Text
            position={[0, 0, 0.41]} // 0,41 = face frontal (0,4) + folga antiz-fighting
            rotation={[0, 0, -Math.PI / 2]} // leitura de cima para baixo, como lombada real
            fontSize={0.15}
            color="white"
            anchorX="center"
            anchorY="middle"
            material-toneMapped={false}
        >
            {project.spineTitle || project.title}
        </Text>
      </group>
    </group>
  );
}
