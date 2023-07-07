import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { usePlane } from "@react-three/cannon";

function Floor() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
  }));

  const texture = useLoader(
    THREE.TextureLoader,
    "./src/assets/floor_texture.jpg"
  );

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10);

  return (
    <mesh ref={ref} position={[0, -1, 0]} receiveShadow>
      <planeGeometry attach="geometry" args={[300, 300]} />
      <meshToonMaterial attach="material" map={texture} />
    </mesh>
  );
}

export default Floor;
