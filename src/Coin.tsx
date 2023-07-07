import React from 'react';
import { MeshWobbleMaterial, Sphere } from "@react-three/drei";
import {Position } from './Game'
interface CoinProps {
  position: Position;
}

const Coin: React.FC<CoinProps> = ({ position }) => {
  return (
    <Sphere args={[1, 10, 10]} position={[position.x, position.y, position.z]}>
      <MeshWobbleMaterial color="yellow" speed={1} factor={0.6} />
    </Sphere>
  );
}

export default Coin;
