"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function encodeAndJoin(obj, separator = '&') {
    if (Array.isArray(obj)) {
        return obj.map(encodeURIComponent).join(separator);
    }
    return Object.entries(obj)
        .map(pair => pair.map(encodeURIComponent).join('='))
        .join(separator);
}
exports.encodeAndJoin = encodeAndJoin;
//# sourceMappingURL=Util.js.map