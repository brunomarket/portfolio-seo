import { Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { FlickeringLight } from './FlickeringLight';

export function Atmosphere() {
  return (
    <>
      <color attach="background" args={['#050505']} />
      <fogExp2 attach="fog" color="#050505" density={0.12} />
      <ambientLight intensity={0.1} color="#4a5a6a" />
      <FlickeringLight position={[1, 1.5, 1.5]} intensity={2.5} />
      <Sparkles count={200} scale={10} size={1.5} speed={0.3} opacity={0.3} color="#ffd700" />
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.8} mipmapBlur intensity={1.2} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <Noise opacity={0.025} />
      </EffectComposer>
    </>
  );
}