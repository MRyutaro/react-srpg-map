import { useState, useEffect } from "react";

interface Tile {
    children?: React.ReactNode;
    backgroundColor?: string;
}

interface MapProps {
    viewRows?: number;
    viewCols?: number;
    tileSize?: number;
}

export function Map({ viewRows = 10, viewCols = 10, tileSize = 50 }: MapProps): JSX.Element {
    const [viewport, setViewport] = useState({ startX: 0, startY: 0 });
    const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
    const [tiles, setTiles] = useState<Tile[][]>(Array.from({ length: 100 }, () => Array.from({ length: 100 }, () => ({})))); // 大きなタイルデータの初期化

    useEffect(() => {
        // ビューポートが変更されてもタイルの背景色は保持される
        setTiles((prev) =>
            prev.map((row, x) =>
                row.map((tile, y) => ({
                    children: <div>{x}, {y}</div>,
                    backgroundColor: tile.backgroundColor // 現在の背景色を保持
                }))
            )
        );
    }, [viewport.startX, viewport.startY]);

    const updateTile = (x: number, y: number) => {
        console.log(`update at ${x}, ${y}`);
        setTiles((prev) =>
            prev.map((row, rowIndex) =>
                row.map((tile, colIndex) => {
                    if (rowIndex === x && colIndex === y) {
                        return { ...tile, backgroundColor: "red" }; // 赤に更新
                    }
                    return tile;
                })
            )
        );
    };

    const adjustViewport = (x: number, y: number) => {
        setViewport((prev) => {
            let newStartX = prev.startX;
            let newStartY = prev.startY;

            if (x < prev.startX) {
                newStartX = x;
            } else if (x >= prev.startX + viewRows) {
                newStartX = x - viewRows + 1;
            }

            if (y < prev.startY) {
                newStartY = y;
            } else if (y >= prev.startY + viewCols) {
                newStartY = y - viewCols + 1;
            }

            return { startX: newStartX, startY: newStartY };
        });
    };

    const moveCurrentPosition = (dx: number, dy: number) => {
        setCurrentPosition((prev) => {
            const newX = prev.x + dx;
            const newY = prev.y + dy;
            adjustViewport(newX, newY);
            return { x: newX, y: newY };
        });
    };

    const moveViewport = (dx: number, dy: number) => {
        setViewport((prev) => ({
            startX: prev.startX + dx,
            startY: prev.startY + dy,
        }));
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isCtrlPressed = e.ctrlKey;

            if (isCtrlPressed) {
                switch (e.key) {
                    case "ArrowUp":
                        moveViewport(-1, 0);
                        break;
                    case "ArrowDown":
                        moveViewport(1, 0);
                        break;
                    case "ArrowLeft":
                        moveViewport(0, -1);
                        break;
                    case "ArrowRight":
                        moveViewport(0, 1);
                        break;
                    default:
                        break;
                }
            } else {
                switch (e.key) {
                    case "ArrowUp":
                        moveCurrentPosition(-1, 0);
                        break;
                    case "ArrowDown":
                        moveCurrentPosition(1, 0);
                        break;
                    case "ArrowLeft":
                        moveCurrentPosition(0, -1);
                        break;
                    case "ArrowRight":
                        moveCurrentPosition(0, 1);
                        break;
                    default:
                        break;
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${viewCols}, ${tileSize}px)`,
                    transform: "rotateX(60deg) rotateZ(45deg)",
                }}
            >
                {Array.from({ length: viewRows }).map((_, rowIndex) =>
                    Array.from({ length: viewCols }).map((_, colIndex) => {
                        const x = viewport.startX + rowIndex;
                        const y = viewport.startY + colIndex;
                        const tile = tiles[x][y]; // tilesデータからタイルを取得
                        const isCurrentPosition = x === currentPosition.x && y === currentPosition.y;

                        return (
                            <div
                                key={`${x}-${y}`}
                                onClick={() => {
                                    setCurrentPosition({ x, y });
                                    updateTile(x, y);
                                }}
                                style={{
                                    width: `${tileSize}px`,
                                    height: `${tileSize}px`,
                                    backgroundColor: tile.backgroundColor || "white",
                                    border: isCurrentPosition ? "1px solid red" : "1px solid black",
                                    transform: isCurrentPosition ? "translateY(-3px) translateX(-5px)" : "none",
                                    boxShadow: isCurrentPosition ? "0px 0px 10px rgba(255, 0, 0, 0.5)" : "0px 2px 5px rgba(0, 0, 0, 0.2)",
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                }}
                            >
                                {tile.children}
                            </div>
                        );
                    })
                )}
            </div>

            <div style={{ marginTop: "10px" }}>
                Current Position: {currentPosition.x}, {currentPosition.y}
            </div>
        </div>
    );
}
