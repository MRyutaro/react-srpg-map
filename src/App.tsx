import { Map } from "./components/Map";
import { Perspective } from "./components/Perspective";

export default function App() {
    return (
        <div style={{ textAlign: "center" }}>
            <h1>SRPG Map</h1>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Map /> {/* ここで tileSize を指定 */}
            </div>
        </div>
    );
}
