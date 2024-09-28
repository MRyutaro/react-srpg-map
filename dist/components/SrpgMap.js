var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
export function SrpgMap(_a) {
    var _b = _a.viewRows, viewRows = _b === void 0 ? 30 : _b, _c = _a.viewCols, viewCols = _c === void 0 ? 30 : _c, _d = _a.tileSize, tileSize = _d === void 0 ? 100 : _d, _e = _a.rotateX, rotateX = _e === void 0 ? 60 : _e, _f = _a.rotateZ, rotateZ = _f === void 0 ? 45 : _f, defaultTiles = _a.defaultTiles, onClick = _a.onClick, tiles = _a.tiles, setTiles = _a.setTiles;
    var _g = useState({ startX: 0, startY: 0 }), viewport = _g[0], setViewport = _g[1];
    var _h = useState({ x: 0, y: 0 }), currentPosition = _h[0], setCurrentPosition = _h[1];
    var _j = useState({}), localTiles = _j[0], setLocalTiles = _j[1];
    var _tiles = tiles || localTiles;
    var _setTiles = setTiles || setLocalTiles;
    // タイルの初期化
    useEffect(function () {
        var initialTiles = {};
        for (var x = 0; x < viewRows; x++) {
            for (var y = 0; y < viewCols; y++) {
                initialTiles["".concat(x, ",").concat(y)] = {};
            }
        }
        _setTiles(initialTiles);
    }, []);
    // デフォルトタイルの設定
    useEffect(function () {
        _setTiles(function (prev) {
            var updatedTiles = __assign({}, prev);
            for (var key in defaultTiles) {
                var _a = key.split(",").map(Number), x = _a[0], y = _a[1];
                updatedTiles["".concat(x, ",").concat(y)] = defaultTiles[key];
            }
            return updatedTiles;
        });
    }, [defaultTiles]);
    // タイルが更新されたときに呼ばれる
    useEffect(function () {
        _setTiles(function (prev) {
            var updatedTiles = __assign({}, prev);
            for (var x = viewport.startX; x < viewport.startX + viewRows; x++) {
                for (var y = viewport.startY; y < viewport.startY + viewCols; y++) {
                    if (!updatedTiles["".concat(x, ",").concat(y)]) {
                        updatedTiles["".concat(x, ",").concat(y)] = {};
                    }
                }
            }
            return updatedTiles;
        });
    }, [viewport.startX, viewport.startY]);
    var _onClick = function (x, y) {
        if (onClick) {
            onClick(x, y);
        }
        else {
            _setTiles(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a["".concat(x, ",").concat(y)] = __assign(__assign({}, prev["".concat(x, ",").concat(y)]), { backgroundColor: "red" }), _a)));
            });
        }
    };
    var moveViewport = function (dx, dy) {
        setViewport(function (prev) { return ({
            startX: prev.startX + dx,
            startY: prev.startY + dy,
        }); });
    };
    var handleScroll = function (e) {
        var isShiftPressed = e.shiftKey;
        var scrollDirection = e.deltaY > 0 ? "down" : "up";
        if (isShiftPressed) {
            // Shift + スクロール
            if (scrollDirection === "down") {
                // カメラが右へ移動するので、見えている物体は左に移動する
                moveViewport(-1, 1);
            }
            else if (scrollDirection === "up") {
                // カメラが左へ移動するので、見えている物体は右に移動する
                moveViewport(1, -1);
            }
        }
        else {
            // 通常のスクロール
            if (scrollDirection === "down") {
                // カメラが下へ移動するので、見えている物体は上に移動する
                moveViewport(1, 1);
            }
            else if (scrollDirection === "up") {
                // カメラが上へ移動するので、見えている物体は下に移動する
                moveViewport(-1, -1);
            }
        }
    };
    useEffect(function () {
        window.addEventListener("wheel", handleScroll);
        return function () { return window.removeEventListener("wheel", handleScroll); };
    }, []);
    return (_jsx("div", __assign({ style: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            overflow: "hidden",
        } }, { children: _jsx("div", __assign({ style: {
                display: "grid",
                gridTemplateColumns: "repeat(".concat(viewCols, ", ").concat(tileSize, "px)"),
                transform: "rotateX(".concat(rotateX, "deg) rotateZ(").concat(rotateZ, "deg)"),
            } }, { children: Array.from({ length: viewRows }).map(function (_, rowIndex) {
                return Array.from({ length: viewCols }).map(function (_, colIndex) {
                    var x = viewport.startX + rowIndex;
                    var y = viewport.startY + colIndex;
                    var tile = _tiles["".concat(x, ",").concat(y)];
                    var isCurrentPosition = x === currentPosition.x && y === currentPosition.y;
                    return (_jsx("div", __assign({ onClick: function () {
                            setCurrentPosition({ x: x, y: y });
                            _onClick(x, y);
                        }, style: {
                            width: "".concat(tileSize, "px"),
                            height: "".concat(tileSize, "px"),
                            backgroundColor: (tile === null || tile === void 0 ? void 0 : tile.backgroundColor) || "white",
                            border: isCurrentPosition ? "1px solid red" : "1px solid black",
                            transform: isCurrentPosition ? "translateY(-3px) translateX(-5px)" : "none",
                            boxShadow: isCurrentPosition ? "0px 0px 10px rgba(255, 0, 0, 0.5)" : "0px 2px 5px rgba(0, 0, 0, 0.2)",
                            transition: "transform 0.2s, box-shadow 0.2s",
                            position: "relative",
                        } }, { children: tile === null || tile === void 0 ? void 0 : tile.children }), "".concat(x, "-").concat(y)));
                });
            }) })) })));
}
