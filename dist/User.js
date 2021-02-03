"use strict";
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
exports.__esModule = true;
exports.User = void 0;
var crypto_1 = require("crypto");
var url_1 = require("url");
var node_fetch_1 = require("node-fetch");
var TweetStream_1 = require("./TweetStream");
var User = /** @class */ (function () {
    function User(_a) {
        var consumerKey = _a.consumerKey, consumerSecret = _a.consumerSecret, accessToken = _a.accessToken, accessTokenSecret = _a.accessTokenSecret;
        var allPresent = [
            consumerKey,
            consumerSecret,
            accessToken,
            accessTokenSecret
        ].every(function (key) { return key; });
        if (!allPresent) {
            throw new Error('All keys have to be provided.');
        }
        Object.assign(this, {
            consumerKey: consumerKey,
            consumerSecret: consumerSecret,
            accessToken: accessToken,
            accessTokenSecret: accessTokenSecret
        });
    }
    User.prototype.get = function (endpoint, opts) {
        var url = new url_1.URL("https://api.twitter.com/1.1/" + endpoint + ".json");
        if (opts.params)
            url.search = new url_1.URLSearchParams(opts.params).toString();
        return this.request(url, opts);
    };
    User.prototype.post = function (endpoint, opts) {
        var url = new url_1.URL("https://api.twitter.com/1.1/" + endpoint + ".json");
        if (opts.params)
            url.search = new url_1.URLSearchParams(opts.params).toString();
        return this.request(url, __assign(__assign({}, opts), { method: 'POST' }));
    };
    User.prototype["delete"] = function (endpoint, opts) {
        var url = new url_1.URL("https://api.twitter.com/1.1/" + endpoint + ".json");
        if (opts.params)
            url.search = new url_1.URLSearchParams(opts.params).toString();
        return this.request(url, __assign(__assign({}, opts), { method: 'DELETE' }));
    };
    User.prototype.stream = function (endpoint, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var url, loader;
            return __generator(this, function (_a) {
                url = new url_1.URL("https://stream.twitter.com/1.1/" + endpoint + ".json");
                if (opts.params)
                    url.search = new url_1.URLSearchParams(opts.params).toString();
                loader = new TweetStream_1.TweetStream();
                loader.run(url, {
                    method: opts.method || 'POST',
                    headers: [
                        ['User-Agent', 'twitterer.js'],
                        ['Authorization', this.getAuth(opts.method || 'POST', url)]
                    ]
                });
                return [2 /*return*/, loader];
            });
        });
    };
    // Internal request method
    User.prototype.request = function (url, opts) {
        if (opts === void 0) { opts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, node_fetch_1["default"](url.href, {
                            method: opts.method,
                            headers: [
                                ['User-Agent', 'twitterer.js'],
                                ['Authorization', this.getAuth(opts.method || 'GET', url)]
                            ]
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        if (!response.ok)
                            throw data.error;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    User.prototype.getAuth = function (method, url) {
        var oauthBase = {
            oauth_consumer_key: this.consumerKey,
            oauth_nonce: Array.from({ length: 32 }, function () { return Math.floor(Math.random() * 36).toString(36); }).join(''),
            oauth_signature_method: 'HMAC-SHA1',
            oauth_timestamp: Math.floor(Date.now() / 1000),
            oauth_token: this.accessToken,
            oauth_version: '1.0'
        };
        var encodedParams = new url_1.URLSearchParams(url.searchParams);
        for (var _i = 0, _a = Object.entries(oauthBase); _i < _a.length; _i++) {
            var _b = _a[_i], key_1 = _b[0], value = _b[1];
            encodedParams.append(key_1, value.toString());
        }
        var base = [method, url.href.split('?')[0], encodedParams.toString()].map(encodeURIComponent).join('&');
        var key = [this.consumerSecret, this.accessTokenSecret].map(encodeURIComponent).join('&');
        var oauth_signature = crypto_1.createHmac('sha1', key)
            .update(base)
            .digest('base64');
        return "OAuth " + Object.entries(__assign(__assign({}, oauthBase), { oauth_signature: oauth_signature })).map(function (r) { return r.map(encodeURIComponent).join('='); }).join(', ');
    };
    return User;
}());
exports.User = User;
//# sourceMappingURL=User.js.map