import { useState } from "react";
import { SrpgMap } from "./components/SrpgMap";
import { Tile } from "./components/SrpgMap";

const defaultTiles: { [key: string]: Tile } = {
    "0,0": { backgroundColor: "red", children: <div>0,0</div> },
    "1,1": { backgroundColor: "blue" },
    "2,2": { backgroundColor: "green" },
};

export default function App() {
    const [tiles, setTiles] = useState<{ [key: string]: Tile }>({});

    const onClick = (x: number, y: number) => {
        // タイルの更新処理
        setTiles((prev) => ({
            ...prev,
            [`${x},${y}`]: { ...prev[`${x},${y}`], backgroundColor: "red", children: <div>{`${x},${y}`}</div> },
        }));
    };

    return (
        <div
            style={{
                height: "100vh",
                width: "100vw",
            }}
        >
            <SrpgMap defaultTiles={defaultTiles} onClick={onClick} tiles={tiles} setTiles={setTiles} />
        </div>
    );
}
