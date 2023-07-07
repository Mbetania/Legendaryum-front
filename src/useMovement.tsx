import { useEffect, useState } from "react";

interface Position {
  x: number;
  y: number;
  z: number;
}

export const useMovement = (initialPosition: Position) => {
  const [position, setPosition] = useState(initialPosition);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          setPosition((prev) => ({ ...prev, z: prev.z + 1 }));
          break;
        case "ArrowDown":
          setPosition((prev) => ({ ...prev, z: prev.z - 1 }));
          break;
        case "ArrowLeft":
          setPosition((prev) => ({ ...prev, x: prev.x - 1 }));
          break;
        case "ArrowRight":
          setPosition((prev) => ({ ...prev, x: prev.x + 1 }));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return position;
};
