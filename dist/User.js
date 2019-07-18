"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const url_1 = require("url");
const node_fetch_1 = require("node-fetch");
const TweetStream_1 = require("./TweetStream");
class User {
    constructor({ consumerKey, consumerSecret, accessToken, accessTokenSecret }) {
        const allPresent = [
            consumerKey,
            consumerSecret,
            accessToken,
            accessTokenSecret
        ].every(key => key);
        if (!allPresent) {
            throw new Error('All keys have to be provided.');
        }
        Object.assign(this, {
            consumerKey,
            consumerSecret,
            accessToken,
            accessTokenSecret
        });
    }
    get(endpoint, opts) {
        const url = new url_1.URL(`https://api.twitter.com/1.1/${endpoint}.json`);
        if (opts.params)
            url.search = new url_1.URLSearchParams(opts.params).toString();
        return this.request(url, opts);
    }
    post(endpoint, opts) {
        const url = new url_1.URL(`https://api.twitter.com/1.1/${endpoint}.json`);
        if (opts.params)
            url.search = new url_1.URLSearchParams(opts.params).toString();
        return this.request(url, { ...opts, method: 'POST' });
    }
    delete(endpoint, opts) {
        const url = new url_1.URL(`https://api.twitter.com/1.1/${endpoint}.json`);
        if (opts.params)
            url.search = new url_1.URLSearchParams(opts.params).toString();
        return this.request(url, { ...opts, method: 'DELETE' });
    }
    async stream(endpoint, opts) {
        const url = new url_1.URL(`https://stream.twitter.com/1.1/${endpoint}.json`);
        if (opts.params)
            url.search = new url_1.URLSearchParams(opts.params).toString();
        const loader = new TweetStream_1.TweetStream();
        loader.run(url, {
            method: opts.method || 'POST',
            headers: [
                ['User-Agent', 'twitterer.js'],
                ['Authorization', this.getAuth(opts.method || 'POST', url)]
            ]
        });
        return loader;
    }
    // Internal request method
    async request(url, opts = {}) {
        const response = await node_fetch_1.default(url.href, {
            method: opts.method,
            headers: [
                ['User-Agent', 'twitterer.js'],
                ['Authorization', this.getAuth(opts.method || 'GET', url)]
            ]
        });
        const data = await response.json();
        if (!response.ok)
            throw data.error;
        return data;
    }
    getAuth(method, url) {
        const oauthBase = {
            oauth_consumer_key: this.consumerKey,
            oauth_nonce: Array.from({ length: 32 }, () => Math.floor(Math.random() * 36).toString(36)).join(''),
            oauth_signature_method: 'HMAC-SHA1',
            oauth_timestamp: Math.floor(Date.now() / 1000),
            oauth_token: this.accessToken,
            oauth_version: '1.0'
        };
        const encodedParams = new url_1.URLSearchParams(url.searchParams);
        for (const [key, value] of Object.entries(oauthBase))
            encodedParams.append(key, value.toString());
        const base = [method, url.href.split('?')[0], encodedParams.toString()].map(encodeURIComponent).join('&');
        const key = [this.consumerSecret, this.accessTokenSecret].map(encodeURIComponent).join('&');
        const oauth_signature = crypto_1.createHmac('sha1', key)
            .update(base)
            .digest('base64');
        return `OAuth ${Object.entries({ ...oauthBase, oauth_signature }).map(r => r.map(encodeURIComponent).join('=')).join(', ')}`;
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map