import * as THREE from "three";
import { useLoader } from "@react-three/fiber";

function Skybox() {
  const texture = useLoader(THREE.TextureLoader, "/src/assets/sky_texture.jpg");

  return (
    <mesh>
      <sphereGeometry attach="geometry" args={[500, 60, 40]} />
      <meshBasicMaterial
        attach="material"
        map={texture}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

export default Skybox;
