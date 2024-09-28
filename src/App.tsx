import { Map } from "./components/Map";

export default function App() {
    return (
        <div style={{ textAlign: "center" }}>
            <h1>SRPG Map</h1>
            <Map/> {/* ここで tileSize を指定 */}
        </div>
    );
}
