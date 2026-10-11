import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// ---- Síntese do "quack" (Web Audio API, sem asset de áudio) --------------
// Sawtooth com varredura de pitch descendente (520 → 280 Hz) por um bandpass
// nasal (1,4 → 0,8 kHz) e envelope curto: aquele "QUACK" cartunesco. Um
// AudioContext único é criado sob demanda — o primeiro clique É o gesto que o
// browser exige para liberar áudio. Áudio é bônus: qualquer falha é engolida.
let audioCtx = null;

function playQuack() {
  try {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      audioCtx = new AC();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume()?.catch(() => {});

    const now = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.16);

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + 0.16);
    filter.Q.value = 3.2;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.45, now + 0.015); // ataque rápido
    gain.gain.setValueAtTime(0.45, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24); // cauda

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
    osc.onended = () => {
      osc.disconnect();
      filter.disconnect();
      gain.disconnect();
    };
  } catch {
    /* silêncio — quack é bônus */
  }
}

// src/components/RubberDuck.jsx
// EASTER EGG: o pato da estante é clicável — ao clicar ele "acende":
//   • uma pointLight dourada (#ffd700) pulsante ilumina o canto da estante
//     (SEM castShadow — a única fonte de sombra continua sendo a "vela";
//     ver correção de acne de sombra do item 20);
//   • o próprio pato ganha brilho emissivo (entra suave via lerp);
//   • solta faíscas douradas (Sparkles);
//   • dá um "pop" de escala amortecido (~0,5s).
// Clique de novo para apagar (toggle). Sem dica nos controles — é segredo. :)
export function RubberDuck({ position, rotation }) {
  const duckRef = useRef();
  const lightRef = useRef();
  const [acesso, setAcesso] = useState(false);

  const glowRef = useRef(0);      // estado interpolado do brilho (0..1)
  const popTRef = useRef(-10);    // hora (clock) do último pop de escala
  const popPendingRef = useRef(false); // sinaliza pop no próximo frame (mesmo clock)

  // Materiais compartilhados entre as meshes — o emissiveIntensity é animado
  // por frame para o brilho entrar/sair suave.
  const bodyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffcf33',
        roughness: 0.4,
        emissive: new THREE.Color('#ffcf33'),
        emissiveIntensity: 0,
      }),
    []
  );
  const beakMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ff8800',
        roughness: 0.6,
        emissive: new THREE.Color('#ff8800'),
        emissiveIntensity: 0,
      }),
    []
  );
  const eyeMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 'black', roughness: 0.2 }),
    []
  );

  // Libera as GPU materials no unmount
  useEffect(
    () => () => {
      bodyMat.dispose();
      beakMat.dispose();
      eyeMat.dispose();
    },
    [bodyMat, beakMat, eyeMat]
  );

  useFrame((state) => {
    if (!duckRef.current) return;
    const t = state.clock.getElapsedTime();

    // o pop usa o MESMO clock do useFrame (não performance.now)
    if (popPendingRef.current) {
      popPendingRef.current = false;
      popTRef.current = t;
    }

    // bobbing + girinho de sempre
    duckRef.current.position.y = position[1] + Math.sin(t * 2) * 0.002;
    duckRef.current.rotation.y = rotation[1] + Math.sin(t * 1) * 0.05;

    // brilho alvo (apagado/aceso) com lerp suave
    const alvo = acesso ? 1 : 0;
    glowRef.current += (alvo - glowRef.current) * 0.08;
    const g = glowRef.current;

    // luz dourada pulsante (como a vela, respira um pouco)
    if (lightRef.current) {
      lightRef.current.intensity = g * (1.7 + Math.sin(t * 6) * 0.3);
    }

    // brilho do próprio pato
    bodyMat.emissiveIntensity = g * 0.55;
    beakMat.emissiveIntensity = g * 0.55;

    // "pop" de escala ao acender — amortecido em ~0,6s
    const dp = t - popTRef.current;
    const pop =
      dp >= 0 && dp < 0.6 ? Math.exp(-dp * 6) * Math.abs(Math.sin(dp * 22)) * 0.3 : 0;
    duckRef.current.scale.setScalar(1 + pop);
  });

  return (
    <group
      ref={duckRef}
      position={position}
      rotation={rotation}
      dispose={null}
      onClick={(event) => {
        event.stopPropagation(); // clique só do pato, não atravessa para trás
        playQuack(); // QUACK! (sintetizado, antes de qualquer await)
        popPendingRef.current = true;
        setAcesso((v) => !v);
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow material={bodyMat}>
        <sphereGeometry args={[0.06, 16, 16]} />
      </mesh>
      <mesh position={[-0.05, 0.06, 0]} rotation={[0, 0, 0.5]} material={bodyMat}>
        <coneGeometry args={[0.03, 0.06, 16]} />
      </mesh>
      <mesh position={[0.04, 0.09, 0]} castShadow material={bodyMat}>
        <sphereGeometry args={[0.035, 16, 16]} />
      </mesh>
      <mesh position={[0.07, 0.09, 0]} rotation={[0, 0, -1.57]} material={beakMat}>
        <coneGeometry args={[0.015, 0.03, 16]} />
      </mesh>
      <mesh position={[0.06, 0.10, 0.015]} material={eyeMat}>
        <sphereGeometry args={[0.003]} />
      </mesh>
      <mesh position={[0.06, 0.10, -0.015]} material={eyeMat}>
        <sphereGeometry args={[0.003]} />
      </mesh>

      {/* Luz do easter egg: dourada, pulsante e sem sombra (ver item 20) */}
      <pointLight ref={lightRef} position={[0, 0.12, 0]} color="#ffd700" intensity={0} distance={2.6} decay={2} />

      {/* Faíscas douradas enquanto aceso */}
      {acesso && (
        <Sparkles
          count={24}
          scale={[0.45, 0.45, 0.45]}
          position={[0, 0.14, 0]}
          size={2.4}
          speed={0.4}
          opacity={0.8}
          color="#ffd700"
        />
      )}
    </group>
  );
}
