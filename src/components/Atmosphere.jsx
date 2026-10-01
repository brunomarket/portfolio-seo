// src/components/Atmosphere.jsx
import { Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { FlickeringLight } from './FlickeringLight';

export function Atmosphere() {
  const fogColor = '#050505'; 

  return (
    <>
      <color attach="background" args={[fogColor]} />
      <fogExp2 attach="fog" color={fogColor} density={0.12} />

      <ambientLight intensity={0.1} color="#4a5a6a" />

      {/* Nossa vela principal */}
      <FlickeringLight position={[1, 1.5, 1.5]} intensity={2.5} color="#ffaa55" />
      {/* Luz de preenchimento suave */}
      <pointLight position={[-2, 0.5, 2]} intensity={0.5} color="#ffaa55" decay={2} />

      {/* Partículas de poeira */}
      <Sparkles 
        count={200} 
        scale={[10, 10, 10]} 
        size={1.5} 
        speed={0.3} 
        opacity={0.3} 
        color="#ffd700" 
      />

      {/* Pós-processamento */}
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.8} mipmapBlur intensity={1.2} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <Noise opacity={0.025} />
      </EffectComposer>
    </>
  );
}