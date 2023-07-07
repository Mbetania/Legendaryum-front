import { usePlane } from "@react-three/cannon";
import { useTexture } from "@react-three/drei";

function Wall({ position, rotation }: any) {
  const texture = useTexture("/src/assets/wall_texture.jpg"); // Reemplaza por la ruta a tu textura
  const [ref] = usePlane(() => ({
    position,
    rotation,
  }));

  return (
    <mesh ref={ref}>
      <planeGeometry attach="geometry" args={[90, 45]} />
      <meshToonMaterial attach="material" map={texture} />
    </mesh>
  );
}

export default Wall;
