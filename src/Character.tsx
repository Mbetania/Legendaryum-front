import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useSphere } from "@react-three/cannon";
import Model from "./Model";
import * as THREE from "three";
import { useEffect, useState } from "react";

function Character({
  position,
  characterType,
}: {
  position: any;
  characterType: number;
}) {
  const [ref, api] = useSphere(() => ({ mass: 1, position: [0, 10, 0] }));
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });

  const colors = ["#FF00FF", "#00FFFF", "#FFFF00", "#FF0000"];
  const color = new THREE.Color(colors[characterType]);

  useEffect(() => {
    if (ref.current) {
      ref.current.traverse(
        (node: { isMesh: any; material: { color: any } }) => {
          if (node.isMesh) {
            node.material.color = color;
          }
        }
      );
    }
  }, [ref, color]);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "w":
          setMovement((m) => ({ ...m, forward: true }));
          break;
        case "s":
          setMovement((m) => ({ ...m, backward: true }));
          break;
        case "a":
          setMovement((m) => ({ ...m, left: true }));
          break;
        case "d":
          setMovement((m) => ({ ...m, right: true }));
          break;
        case " ":
          setMovement((m) => ({ ...m, jump: true }));
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key) {
        case "w":
          setMovement((m) => ({ ...m, forward: false }));
          break;
        case "s":
          setMovement((m) => ({ ...m, backward: false }));
          break;
        case "a":
          setMovement((m) => ({ ...m, left: false }));
          break;
        case "d":
          setMovement((m) => ({ ...m, right: false }));
          break;
        case " ":
          setMovement((m) => ({ ...m, jump: false }));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (movement.forward) {
      api.applyForce([0, 0, -100], [0, 0, 0]);
    }
    if (movement.backward) {
      api.applyForce([0, 0, 100], [0, 0, 0]);
    }
    if (movement.left) {
      api.applyForce([-100, 0, 0], [0, 0, 0]);
    }
    if (movement.right) {
      api.applyForce([100, 0, 0], [0, 0, 0]);
    }
    if (movement.jump) {
      api.applyForce([0, 200, 0], [0, 0, 0]);
      setMovement((m) => ({ ...m, jump: false }));
    }
  }, [movement, api]);
  const texture = useLoader(
    THREE.TextureLoader,
    "/src/assets/models/puffy/octopus_toy_texture.png"
  );

  const gltf = useLoader(
    GLTFLoader,
    "/src/assets/models/puffy/octopus_toy_texture.glb"
  );
  const mesh = gltf.scene.children[0];
  mesh.material = new THREE.MeshStandardMaterial({ map: texture });
  return <Model gltf={gltf} ref={ref} />;
}

export default Character;
