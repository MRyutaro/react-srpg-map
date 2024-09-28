/// <reference types="react" />
export interface Tile {
    children?: React.ReactNode;
    backgroundColor?: string;
}
export interface MapProps {
    viewRows?: number;
    viewCols?: number;
    tileSize?: number;
    rotateX?: number;
    rotateZ?: number;
    defaultTiles?: {
        [key: string]: Tile;
    };
    onClick?: (x: number, y: number) => void;
    tiles?: {
        [key: string]: Tile;
    };
    setTiles?: React.Dispatch<React.SetStateAction<{
        [key: string]: Tile;
    }>>;
}
export declare function SrpgMap({ viewRows, viewCols, tileSize, rotateX, rotateZ, defaultTiles, onClick, tiles, setTiles }: MapProps): import("react/jsx-runtime").JSX.Element;
