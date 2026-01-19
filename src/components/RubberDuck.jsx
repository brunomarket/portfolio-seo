import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

export function RubberDuck({ position, rotation }) {
  const duckRef = useRef();

  // Uma leve animação de "flutuar" ou respirar para ele não parecer estátua
  useFrame((state) => {
    if (duckRef.current) {
        const t = state.clock.getElapsedTime();
        duckRef.current.position.y = position[1] + Math.sin(t * 2) * 0.002;
        duckRef.current.rotation.y = rotation[1] + Math.sin(t * 1) * 0.05;
    }
  });

  return (
    <group ref={duckRef} position={position} rotation={rotation} dispose={null}>
      {/* CORPO (Amarelo) */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        {/* Esfera achatada para o corpo */}
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#ffcf33" roughness={0.4} />
      </mesh>
      
      {/* RABO (Ponta do corpo) */}
      <mesh position={[-0.05, 0.06, 0]} rotation={[0, 0, 0.5]}>
        <coneGeometry args={[0.03, 0.06, 16]} />
        <meshStandardMaterial color="#ffcf33" roughness={0.4} />
      </mesh>

      {/* CABEÇA (Amarela) */}
      <mesh position={[0.04, 0.09, 0]} castShadow>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color="#ffcf33" roughness={0.4} />
      </mesh>

      {/* BICO (Laranja) */}
      <mesh position={[0.07, 0.09, 0]} rotation={[0, 0, -1.57]}>
        <coneGeometry args={[0.015, 0.03, 16]} />
        <meshStandardMaterial color="#ff8800" roughness={0.6} />
      </mesh>

      {/* OLHOS (Pretos) */}
      <mesh position={[0.06, 0.10, 0.015]}>
        <sphereGeometry args={[0.003]} />
        <meshStandardMaterial color="black" roughness={0.2} />
      </mesh>
      <mesh position={[0.06, 0.10, -0.015]}>
        <sphereGeometry args={[0.003]} />
        <meshStandardMaterial color="black" roughness={0.2} />
      </mesh>
    </group>
  );
}