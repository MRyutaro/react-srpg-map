import { useState, useEffect } from "react";

interface Tile {
    children?: React.ReactNode;
    backgroundColor?: string;
}

interface MapProps {
    viewRows?: number;
    viewCols?: number;
    tileSize?: number;
    rotateX?: number;
    rotateZ?: number;
    updateTile?: (x: number, y: number) => void;
}

export function SrpgMap({ viewRows = 30, viewCols = 30, tileSize = 100, rotateX = 60, rotateZ = 45, updateTile }: MapProps): JSX.Element {
    const [viewport, setViewport] = useState({ startX: 0, startY: 0 });
    const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
    const [tiles, setTiles] = useState<{ [key: string]: Tile }>({});

    useEffect(() => {
        const initialTiles: { [key: string]: Tile } = {};
        for (let x = 0; x < viewRows; x++) {
            for (let y = 0; y < viewCols; y++) {
                initialTiles[`${x},${y}`] = {};
            }
        }
        setTiles(initialTiles);
    }, []);

    useEffect(() => {
        setTiles((prev) => {
            const updatedTiles = { ...prev };
            for (let x = viewport.startX; x < viewport.startX + viewRows; x++) {
                for (let y = viewport.startY; y < viewport.startY + viewCols; y++) {
                    if (!updatedTiles[`${x},${y}`]) {
                        updatedTiles[`${x},${y}`] = {};
                    }
                }
            }
            return updatedTiles;
        });
    }, [viewport.startX, viewport.startY]);

    const _updateTile = (x: number, y: number) => {
        if (updateTile) {
            updateTile(x, y);
        } else {
            setTiles((prev) => ({
                ...prev,
                [`${x},${y}`]: { ...prev[`${x},${y}`], backgroundColor: "red" },
            }));
        }
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

    const handleScroll = (e: WheelEvent) => {
        const isShiftPressed = e.shiftKey;
        const scrollDirection = e.deltaY > 0 ? "down" : "up";

        if (isShiftPressed) {
            // Shift + スクロール
            if (scrollDirection === "down") {
                // カメラが右へ移動するので、見えている物体は左に移動する
                moveViewport(-1, 1);
            } else if (scrollDirection === "up") {
                // カメラが左へ移動するので、見えている物体は右に移動する
                moveViewport(1, -1);
            }
        } else {
            // 通常のスクロール
            if (scrollDirection === "down") {
                // カメラが下へ移動するので、見えている物体は上に移動する
                moveViewport(1, 1);
            } else if (scrollDirection === "up") {
                // カメラが上へ移動するので、見えている物体は下に移動する
                moveViewport(-1, -1);
            }
        }
    };

    useEffect(() => {
        window.addEventListener("wheel", handleScroll);
        return () => window.removeEventListener("wheel", handleScroll);
    }, []);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${viewCols}, ${tileSize}px)`,
                    transform: `rotateX(${rotateX}deg) rotateZ(${rotateZ}deg)`,
                }}
            >
                {Array.from({ length: viewRows }).map((_, rowIndex) =>
                    Array.from({ length: viewCols }).map((_, colIndex) => {
                        const x = viewport.startX + rowIndex;
                        const y = viewport.startY + colIndex;
                        const tile = tiles[`${x},${y}`];
                        const isCurrentPosition = x === currentPosition.x && y === currentPosition.y;

                        return (
                            <div
                                key={`${x}-${y}`}
                                onClick={() => {
                                    setCurrentPosition({ x, y });
                                    _updateTile(x, y);
                                }}
                                style={{
                                    width: `${tileSize}px`,
                                    height: `${tileSize}px`,
                                    backgroundColor: tile?.backgroundColor || "white",
                                    border: isCurrentPosition ? "1px solid red" : "1px solid black",
                                    transform: isCurrentPosition ? "translateY(-3px) translateX(-5px)" : "none",
                                    boxShadow: isCurrentPosition ? "0px 0px 10px rgba(255, 0, 0, 0.5)" : "0px 2px 5px rgba(0, 0, 0, 0.2)",
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                }}
                            >
                                {tile?.children}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
