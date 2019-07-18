"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const url_1 = require("url");
class Application {
    constructor({ consumerKey, consumerSecret, accessToken }) {
        Object.assign(this, { consumerKey, consumerSecret, accessToken });
    }
    get(endpoint, opts) {
        return this.request(endpoint, opts);
    }
    post(endpoint, opts) {
        return this.request(endpoint, { ...opts, method: 'POST' });
    }
    delete(endpoint, opts) {
        return this.request(endpoint, { ...opts, method: 'DELETE' });
    }
    // Internal request method
    async request(endpoint, opts = {}) {
        if (!this.accessToken) {
            await this.auth();
        }
        const url = new url_1.URL(`https://api.twitter.com/1.1/${endpoint}.json`);
        if (opts.params)
            url.search = new url_1.URLSearchParams(opts.params).toString();
        const response = await node_fetch_1.default(url.href, {
            method: opts.method,
            headers: [
                ['User-Agent', 'twitterer.js'],
                ['Authorization', `Bearer ${this.accessToken}`]
            ]
        });
        const data = await response.json();
        if (!response.ok)
            throw data.error;
        return data;
    }
    // OAuth 2.0 authentication method
    async auth() {
        const encoded = Buffer.from([this.consumerKey, this.consumerSecret].join(':')).toString('base64');
        const response = await node_fetch_1.default('https://api.twitter.com/oauth2/token', {
            method: 'POST',
            body: 'grant_type=client_credentials',
            headers: [
                ['User-Agent', 'twitterer.js'],
                ['Authorization', `Basic ${encoded}`],
                ['Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8.']
            ]
        });
        const data = await response.json();
        if (!response.ok)
            throw data.errors[0].message;
        this.accessToken = data.access_token;
        return this;
    }
}
exports.Application = Application;
//# sourceMappingURL=Application.js.map