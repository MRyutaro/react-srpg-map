import { useState, useEffect } from "react";

interface Tile {
    // 子要素のdiv
    children?: React.ReactNode;
    // 背景色
    backgroundColor?: string;
}

interface MapProps {
    viewRows?: number;
    viewCols?: number;
    tileSize?: number; // タイルサイズを外部から指定できるように追加
}

export function Map({ viewRows = 10, viewCols = 10, tileSize = 50 }: MapProps): JSX.Element {
    const [viewport, setViewport] = useState({ startX: 0, startY: 0 });
    const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 }); // 現在の位置を追跡
    const [tiles, setTiles] = useState<Tile[][]>(Array.from({ length: viewRows }, () => Array.from({ length: viewCols }, () => ({})))); // タイルデータの状態管理
    // tiles配列の長さをconsole.log
    console.log(tiles.length);

    useEffect(() => {
        // タイルデータを初期化
        setTiles((prev) =>
            prev.map((row, x) =>
                row.map((_, y) => ({
                    children: (
                        <div>
                            {x + viewport.startX}, {y + viewport.startY}
                        </div>
                    ),
                }))
            )
        );
    }, [viewport.startX, viewport.startY]);

    const updateTile = (x: number, y: number) => {
        console.log(`update at ${x}, ${y}`);

        setTiles((prev) =>
            prev.map((row, rowIndex) =>
                row.map((tile, colIndex) => {
                    console.log(`rowIndex: ${rowIndex}, colIndex: ${colIndex}`);
                    if (rowIndex === x && colIndex === y) {
                        console.log("update tile");
                        return { ...tile, backgroundColor: "red" };
                    }
                    return tile;
                })
            )
        );
    };

    // ビューポートを更新して、現在位置が範囲外に出ないように調整
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

    // 現在位置の移動（矢印キーで移動）
    const moveCurrentPosition = (dx: number, dy: number) => {
        setCurrentPosition((prev) => {
            const newX = prev.x + dx;
            const newY = prev.y + dy;

            adjustViewport(newX, newY); // 現在位置が範囲外に出ないようにビューポートを調整

            return { x: newX, y: newY };
        });
    };

    // ビューポートの移動（Ctrl + 矢印キーでマップ移動）
    const moveViewport = (dx: number, dy: number) => {
        setViewport((prev) => ({
            startX: prev.startX + dx,
            startY: prev.startY + dy,
        }));
    };

    // キーボードイベント
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isCtrlPressed = e.ctrlKey;

            if (isCtrlPressed) {
                // Ctrl + 矢印キーでマップ移動
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
                // 矢印キーで現在位置を移動
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
                    gridTemplateColumns: `repeat(${viewCols}, ${tileSize}px)`, // tileSize幅のタイルをviewCols個並べる
                    transform: "rotateX(60deg) rotateZ(45deg)", // パースペクティブ効果を追加
                }}
            >
                {Array.from({ length: viewRows }).map((_, rowIndex) =>
                    Array.from({ length: viewCols }).map((_, colIndex) => {
                        const x = viewport.startX + rowIndex;
                        const y = viewport.startY + colIndex;
                        const tile = tiles[rowIndex][colIndex]; // tilesデータからタイルを取得
                        const isCurrentPosition = x === currentPosition.x && y === currentPosition.y;

                        return (
                            <div
                                key={`${x}-${y}`}
                                onClick={() => {
                                    setCurrentPosition({ x, y }); // タイルクリックで現在位置を更新
                                    updateTile(x, y); // タイルクリックでタイルデータを更新
                                }}
                                style={{
                                    width: `${tileSize}px`,
                                    height: `${tileSize}px`,
                                    backgroundColor: tile.backgroundColor || "white",
                                    border: isCurrentPosition ? "1px solid red" : "1px solid black", // 現在位置を赤枠で表示
                                    transform: isCurrentPosition ? "translateY(-3px) translateX(-5px)" : "none", // 現在位置のタイルを持ち上げる
                                    boxShadow: isCurrentPosition ? "0px 0px 10px rgba(255, 0, 0, 0.5)" : "0px 2px 5px rgba(0, 0, 0, 0.2)", // 影を追加
                                    transition: "transform 0.2s, box-shadow 0.2s", // スムーズなアニメーションを追加
                                }}
                            >
                                {tile.children}
                            </div>
                        );
                    })
                )}
            </div>

            {/* 現在の位置を表示 */}
            <div style={{ marginTop: "10px" }}>
                Current Position: {currentPosition.x}, {currentPosition.y}
            </div>
        </div>
    );
}
