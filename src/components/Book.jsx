import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

export function Book({ project, position, onSelect }) {
  const meshRef = useRef();
  const [hovered, setHover] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      // Animação: O livro vem para frente (Eixo Z) no hover
      const targetZ = hovered ? 0.3 : 0;
      meshRef.current.position.z += (targetZ - meshRef.current.position.z) * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(project);
        }}
        onPointerOver={() => {
          setHover(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = 'auto';
        }}
        castShadow
        receiveShadow
      >
        {/* Geometria do Livro */}
        <boxGeometry args={[0.15, 1, 0.8]} />
        <meshStandardMaterial
          color={project.color}
          roughness={0.8}
          metalness={0.1}
        />

        {/* O Texto agora vive DENTRO da mesh, então ele segue o movimento automaticamente */}
        <Text
          position={[0, 0, 0.41]} // Na frente da lombada (0.8 / 2 + um pouquinho)
          rotation={[0, 0, -Math.PI / 2]} // Girado verticalmente
          fontSize={0.1}
          maxWidth={0.8}
          lineHeight={1}
          color="#ffca8a" // Dourado claro
          anchorX="center"
          anchorY="middle"
        >
          {project.title.toUpperCase()}
        </Text>
      </mesh>
    </group>
  );
}