import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import socket from "./socket";
import Floor from "./Floor";
import Skybox from "./Sky";
import Character from "./Character";
import { Physics } from "@react-three/cannon";
import Wall from "./Wall";
import { v4 as uuidv4 } from "uuid";
import Coin from "./Coin";

export interface Position {
  x: number;
  y: number;
  z: number;
}

interface Player {
  id: string;
  position: Position;
  playerType: number;
}

interface Coin {
  id: string;
  position: Position;
}

function Game() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [clientId, setClientId] = useState("");
  const [coins, setCoins] = useState<Coin[]>([]);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    let clientId = uuidv4();
    console.log("Generated client ID:", clientId);
    setClientId(clientId);

    const player = { x: 0, y: 0, id: clientId }; // esto es nuevo
    socket.on("connect", () => {
      console.log("Connected to server");
      console.log("Sending authenticate event with client ID:", clientId);
      socket.emit("authenticate", { clientId });

      socket.on("player joined", (newPlayer) => {
        setPlayers((players) => [...players, newPlayer]);
      });
      socket.on("authenticated", (data) => {
        console.log("Received authenticated event with data:", data);
        console.log("Authenticated:", data);
        clientId = data.clientId;
      });

      socket.on("new player", (newPlayer) => {
        setPlayers((players) => [...players, newPlayer]);
      });

      socket.on("room created", (data) => {
        console.log(data.id, "aca");
        const { id } = data;
        navigator.clipboard.writeText(id);
        setRoomId(id);
      });
      socket.on("coins generated", (data) => {
        setCoins(data.coins);
      });

      socket.on("coin grabbed", (grabbedCoinId) => {
        setCoins((coins) => coins.filter((c) => c.id !== grabbedCoinId));
      });

      socket.on("player left", (leftPlayerId) => {
        setPlayers((players) => players.filter((p) => p.id !== leftPlayerId));
      });
      socket.on("update positions", (playersPositions) => {
        const newPlayers = [...players];
        for (let i = 0; i < newPlayers.length; i++) {
          const playerId = newPlayers[i].id;
          if (playersPositions[playerId]) {
            newPlayers[i].position = playersPositions[playerId];
          }
        }
        setPlayers(newPlayers);
      });
      socket.on("joined room", (data) => {
        console.log(data);
        console.log("Joined room with data:", data);
        console.log("Current client ID:", clientId);
        setJoined(true);
      });

      return () => {
        socket.off("connect");
        socket.off("authenticated");
        socket.off("new player");
        socket.off("room created");
        socket.off("coins generated");
        socket.off("coin grabbed");
        socket.off("player left");
        socket.off("update positions");
        socket.off("joined room");
      };
    });
  }, []);

  useEffect(() => {
    if (joined) {
      socket.emit("join room", {
        roomId,
        clientId,
        player: { ...position, id: clientId }, // Envía la posición actual del jugador al unirse a la sala.
      });
    }
  }, [joined, roomId, clientId, position]);

  useEffect(() => {
    if(clientId !== "" && !(position.x === 0 && position.y === 0 && position.z === 0)) {
      socket.emit("update position", { clientId, position });
    }
}, [position, clientId]);

  const handleCreateRoom = () => {
    socket.emit("create room", {
      name: "testroom",
      password: "testpassword",
    });
  };

  const handleJoinRoom = () => {
    socket.emit("join room", {
      roomId,
      clientId,
      player: { ...position, id: clientId },
    });
  };


  return (
    <div id="canvas-container">
      <Canvas
        camera={{
          position: [2, 17.5, 25],
          rotation: [-Math.PI / 4, 0, 0],
          fov: 120,
        }}
      >
        <ambientLight />
        {!joined && (
          <Html position={[0, -1, 0]}>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Room ID"
            />
            <button onClick={handleCreateRoom}>Create Room</button>
            <button onClick={handleJoinRoom}>Join Room</button>
          </Html>
        )}
        <Physics>
          <Floor />
          <Skybox />

          {players.map((player) => (
            <Character
              key={player.id}
              position={player.position}
              playerType={player.playerType}
            />
          ))}

          {coins.map((coin) => (
            <Coin key={coin.id} position={coin.position} />
          ))}

          <Wall position={[-45, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
          <Wall position={[45, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
          <Wall position={[0, 0, -45]} rotation={[0, 0, 0]} />
          <Wall position={[0, 0, 45]} rotation={[0, Math.PI, 0]} />
        </Physics>
      </Canvas>
    </div>
  );
}

export default Game;
