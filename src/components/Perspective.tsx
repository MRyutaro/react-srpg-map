export function Perspective(): JSX.Element {
    return (
        // 四角形を描画
        <div
            style={{
                width: "50px",
                height: "50px",
                backgroundColor: "gray",
                transform: "rotateX(60deg) rotateZ(45deg)",
            }}
        />
    );
}
