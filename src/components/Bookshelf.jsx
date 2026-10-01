import { Text } from '@react-three/drei';

export function Bookshelf(props) {
  const woodColor = "#2b1d10";
  const woodRoughness = 0.6;
  const goldColor = "#d4af37";
  const goldMetalness = 0.8;
  const goldRoughness = 0.3;

  return (
    <group {...props}>
      <mesh position={[0, -0.6, 0]} receiveShadow castShadow>
        <boxGeometry args={[5, 0.2, 1.2]} /> 
        <meshStandardMaterial color={woodColor} roughness={woodRoughness} />
      </mesh>

      <mesh position={[0, 0.2, -0.55]} receiveShadow>
        <boxGeometry args={[5, 1.6, 0.1]} />
        <meshStandardMaterial color={woodColor} roughness={woodRoughness} />
      </mesh>

      <mesh position={[-2.45, 0.2, -0.25]} receiveShadow castShadow>
        <boxGeometry args={[0.1, 1.6, 0.7]} />
        <meshStandardMaterial color={woodColor} roughness={woodRoughness} />
      </mesh>
      
      <mesh position={[2.45, 0.2, -0.25]} receiveShadow castShadow>
        <boxGeometry args={[0.1, 1.6, 0.7]} />
        <meshStandardMaterial color={woodColor} roughness={woodRoughness} />
      </mesh>

      <group position={[0, 1.1, 0]}>
        <mesh receiveShadow castShadow position={[0, 0, -0.1]}>
          <boxGeometry args={[5.2, 0.4, 1.0]} />
          <meshStandardMaterial color={woodColor} roughness={woodRoughness} />
        </mesh>
        <mesh position={[0, -0.25, -0.1]}>
             <boxGeometry args={[5.1, 0.1, 0.9]} />
             <meshStandardMaterial color={woodColor} roughness={woodRoughness} />
        </mesh>
      </group>

      <group position={[0, 1.1, 0.41]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.35, 0.05]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.4} metalness={0.7} />
        </mesh>

        <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[1.25, 0.4, 0.02]} />
            <meshStandardMaterial color={goldColor} metalness={goldMetalness} roughness={goldRoughness} />
        </mesh>

        <Text
          position={[0, 0, 0.04]}
          fontSize={0.2}
          color={goldColor}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          2025
        </Text>

        <mesh position={[-0.55, 0, 0.03]}>
            <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} rotation={[1.57, 0, 0]} />
            <meshStandardMaterial color={goldColor} metalness={1} />
        </mesh>
        <mesh position={[0.55, 0, 0.03]}>
            <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} rotation={[1.57, 0, 0]} />
            <meshStandardMaterial color={goldColor} metalness={1} />
        </mesh>
      </group>
    </group>
  );
}
