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
import { useState } from "react";
import { SrpgMap } from "./components/SrpgMap";
var defaultTiles = {
    "0,0": { backgroundColor: "red", children: _jsx("div", { children: "0,0" }) },
    "1,1": { backgroundColor: "blue" },
    "2,2": { backgroundColor: "green" },
};
export default function App() {
    var _a = useState({}), tiles = _a[0], setTiles = _a[1];
    var onClick = function (x, y) {
        // タイルの更新処理
        setTiles(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a["".concat(x, ",").concat(y)] = __assign(__assign({}, prev["".concat(x, ",").concat(y)]), { backgroundColor: "red", children: _jsx("div", { children: "".concat(x, ",").concat(y) }) }), _a)));
        });
    };
    return (_jsx("div", __assign({ style: {
            height: "100vh",
            width: "100vw",
        } }, { children: _jsx(SrpgMap, { defaultTiles: defaultTiles, onClick: onClick, tiles: tiles, setTiles: setTiles }) })));
}
