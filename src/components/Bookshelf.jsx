import { Text } from '@react-three/drei';

export function Bookshelf(props) {
  // Configurações visuais
  const woodColor = "#2b1d10"; // Mogno escuro
  const woodRoughness = 0.6;
  
  const goldColor = "#d4af37"; // Ouro envelhecido
  const goldMetalness = 0.8;
  const goldRoughness = 0.3;

  return (
    <group {...props}>
      {/* === ESTRUTURA DE MADEIRA === */}
      
      {/* 1. Base da Prateleira (Chão) */}
      {/* Posição levemente ajustada para os livros (que estão em Y=0) ficarem apoiados */}
      <mesh position={[0, -0.6, 0]} receiveShadow castShadow>
        <boxGeometry args={[5, 0.2, 1.2]} /> 
        <meshStandardMaterial color={woodColor} roughness={woodRoughness} />
      </mesh>

      {/* 2. Fundo (Backboard) - Altura reduzida para ficar "Justo" */}
      {/* Altura de 1.6 é suficiente para livros de tamanho 1.0 + sobra */}
      <mesh position={[0, 0.2, -0.55]} receiveShadow>
        <boxGeometry args={[5, 1.6, 0.1]} />
        <meshStandardMaterial color={woodColor} roughness={woodRoughness} />
      </mesh>

      {/* 3. Laterais */}
      <mesh position={[-2.45, 0.2, -0.25]} receiveShadow castShadow>
        <boxGeometry args={[0.1, 1.6, 0.7]} />
        <meshStandardMaterial color={woodColor} roughness={woodRoughness} />
      </mesh>
      <mesh position={[2.45, 0.2, -0.25]} receiveShadow castShadow>
        <boxGeometry args={[0.1, 1.6, 0.7]} />
        <meshStandardMaterial color={woodColor} roughness={woodRoughness} />
      </mesh>

      {/* 4. Teto / Cornija (O "Cabeçalho" da Estante) */}
      {/* Fica logo acima dos livros (Y=1.1) */}
      <group position={[0, 1.1, 0]}>
        {/* Bloco principal do teto */}
        <mesh receiveShadow castShadow position={[0, 0, -0.1]}>
          <boxGeometry args={[5.2, 0.4, 1.0]} />
          <meshStandardMaterial color={woodColor} roughness={woodRoughness} />
        </mesh>
        
        {/* Detalhe decorativo (borda fina embaixo do teto) */}
        <mesh position={[0, -0.25, -0.1]}>
             <boxGeometry args={[5.1, 0.1, 0.9]} />
             <meshStandardMaterial color={woodColor} roughness={woodRoughness} />
        </mesh>
      </group>

      {/* === A PLACA "2025" (Pendurada/Fixada na Cornija) === */}
      {/* Posição Y=1.1 (Centro do teto) e Z=0.41 (Na face da frente) */}
      <group position={[0, 1.1, 0.41]}>
        
        {/* Placa de Fundo (Preta/Metal Escuro) */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.35, 0.05]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.4} metalness={0.7} />
        </mesh>

        {/* Moldura Dourada da Placa */}
        <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[1.25, 0.4, 0.02]} />
            <meshStandardMaterial color={goldColor} metalness={goldMetalness} roughness={goldRoughness} />
        </mesh>

        {/* Texto do Ano */}
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

        {/* Detalhes: "Parafusos" ou suportes dourados nos cantos */}
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