import { Map } from "./components/Map";

export default function App() {
    return (
        <div style={{ textAlign: "center" }}>
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
