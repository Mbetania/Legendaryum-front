import * as THREE from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { forwardRef, useEffect } from "react";
import { useLoader } from "@react-three/fiber";

interface ModelProps {
  gltf: GLTF;
}

const Model = forwardRef(({ gltf }: ModelProps, ref) => {
  return <primitive ref={ref} object={gltf.scene} />;
});

export default Model;
