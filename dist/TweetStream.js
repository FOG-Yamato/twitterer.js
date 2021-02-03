"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
exports.__esModule = true;
exports.TweetStream = void 0;
var events_1 = require("events");
var abort_controller_1 = require("abort-controller");
var node_fetch_1 = require("node-fetch");
var TweetStream = /** @class */ (function (_super) {
    __extends(TweetStream, _super);
    function TweetStream() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.controller = null;
        _this.timeout = null;
        _this.flag = false;
        _this.collector = '';
        return _this;
    }
    TweetStream.prototype.run = function (url, opts) {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function () {
            var res, _b, _c, payload, initial, processed, e_1_1, e_2;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        this.controller = new abort_controller_1.AbortController();
                        return [4 /*yield*/, node_fetch_1["default"](url.href, __assign(__assign({}, opts), { signal: this.controller.signal }))];
                    case 1:
                        res = _d.sent();
                        if (res.status === 404)
                            throw res.statusText;
                        if (res.status === 401)
                            return [2 /*return*/, this.run(url, opts)];
                        if (!!res.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, res.text()];
                    case 2: throw _d.sent();
                    case 3:
                        this.emit('ready');
                        this.timeout = setTimeout(function () {
                            _this.flag = true;
                            _this.end();
                        }, 60000);
                        _d.label = 4;
                    case 4:
                        _d.trys.push([4, 17, , 18]);
                        _d.label = 5;
                    case 5:
                        _d.trys.push([5, 10, 11, 16]);
                        _b = __asyncValues(res.body);
                        _d.label = 6;
                    case 6: return [4 /*yield*/, _b.next()];
                    case 7:
                        if (!(_c = _d.sent(), !_c.done)) return [3 /*break*/, 9];
                        payload = _c.value;
                        clearTimeout(this.timeout);
                        initial = payload.toString('utf8');
                        if (/^\s+$/.test(initial)) {
                            this.emit('heartbeat');
                        }
                        else {
                            this.collector += initial;
                            if (this.collector.endsWith('\r\n')) {
                                processed = JSON.parse(this.collector);
                                if (processed["delete"])
                                    this.emit('deleteTweet', processed["delete"]);
                                else if (processed.retweeted_status)
                                    this.emit('retweet', processed);
                                else if (processed.in_reply_to_status_id)
                                    this.emit('reply', processed);
                                else
                                    this.emit('tweet', processed);
                                this.collector = '';
                            }
                        }
                        this.timeout = setTimeout(function () {
                            _this.flag = true;
                            _this.end();
                        }, 60000);
                        _d.label = 8;
                    case 8: return [3 /*break*/, 6];
                    case 9: return [3 /*break*/, 16];
                    case 10:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 16];
                    case 11:
                        _d.trys.push([11, , 14, 15]);
                        if (!(_c && !_c.done && (_a = _b["return"]))) return [3 /*break*/, 13];
                        return [4 /*yield*/, _a.call(_b)];
                    case 12:
                        _d.sent();
                        _d.label = 13;
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 15: return [7 /*endfinally*/];
                    case 16: return [2 /*return*/, this.run(url, opts)];
                    case 17:
                        e_2 = _d.sent();
                        if (this.flag && e_2.type === 'aborted')
                            this.run(url, opts);
                        return [3 /*break*/, 18];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    TweetStream.prototype.end = function () {
        if (this.timeout !== null) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        if (this.controller) {
            this.controller.abort();
            this.emit('end');
        }
    };
    return TweetStream;
}(events_1.EventEmitter));
exports.TweetStream = TweetStream;
//# sourceMappingURL=TweetStream.js.map