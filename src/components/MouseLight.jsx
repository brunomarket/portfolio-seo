import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function MouseLight() {
  const lightRef = useRef();
  
  // O hook useFrame roda 60 vezes por segundo
  useFrame((state) => {
    if (lightRef.current) {
      // state.pointer.x vai de -1 (esquerda) a +1 (direita)
      // state.pointer.y vai de -1 (baixo) a +1 (cima)
      
      // Criamos um vetor alvo onde o mouse está
      const targetX = state.pointer.x * 5; // Multiplica por 5 para cobrir a largura da estante
      const targetY = state.pointer.y * 2; // Multiplica por 2 para cobrir a altura
      
      // Usamos LERP (Linear Interpolation) para a luz seguir o mouse com um atraso suave (peso)
      // O 0.1 define a velocidade (quanto menor, mais "pesada" e suave a luz parece)
      lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, targetX, 0.1);
      lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, targetY, 0.1);
    }
  });

  return (
    <pointLight
      ref={lightRef}
      distance={5}   // A luz alcança 5 metros
      decay={2}      // A luz enfraquece fisicamente correta
      intensity={2}  // Força da luz
      color="#ffaa55" // Cor de fogo/vela
      position={[0, 0, 2]} // Começa na frente da estante (Z=2)
      castShadow     // Gera sombras dos livros
    />
  );
}