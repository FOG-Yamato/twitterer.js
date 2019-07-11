import { createHmac } from 'crypto';
import { createAPI, encodeAndJoin, randomString, rawURL, sortByKeys } from './Util';
// import { TweetStream } from './TweetStream';

const baseAPI = createAPI('https://api.twitter.com/1.1/');
// const streamAPI = createAPI('https://stream.twitter.com/1.1/');

export class User {

	private consumerKey!: string;
	private consumerSecret!: string;
	private accessToken!: string;
	private accessTokenSecret!: string;

	public constructor({ consumerKey, consumerSecret, accessToken, accessTokenSecret }: UserOptions) {
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

	public get(url: string, opts: object) {
		return this.request(url, opts);
	}

	public post(url: string, opts: object) {
		return this.request(url, { ...opts, method: 'POST' });
	}

	public delete(url: string, opts: object) {
		return this.request(url, { ...opts, method: 'DELETE' });
	}

	// Internal request method
	private async request(url: string, opts: RequestOptions = {}) {
		const api = opts.api || baseAPI;

		if (!url.endsWith('.json')) url += '.json';
		// TODO(FOG): Rewrite this
		// const rawUrl = rawURL(url, api.defaults.baseURL);
		const rawUrl = rawURL(url);
		const headers = {
			...opts.headers,
			authorization: this.getAuth(opts.method || 'GET', rawUrl, opts.params)
		};

		try {
			const { data } = await api.request({ ...opts, headers, url });
			return data;
		} catch (err) {
			return Promise.reject(err.response.data.errors[0].message);
		}
	}

	private getAuth(method: string, url: string, params = {}) {
		const oauthBase = {
			oauth_consumer_key: this.consumerKey,
			oauth_nonce: randomString(32),
			oauth_signature_method: 'HMAC-SHA1',
			oauth_timestamp: Math.floor(Date.now() / 1000),
			oauth_token: this.accessToken,
			oauth_version: '1.0'
		};

		params = { ...params, ...oauthBase };
		const encodedParams = encodeAndJoin(sortByKeys(params));
		const base = encodeAndJoin([method, url, encodedParams]);
		const key = encodeAndJoin([
			this.consumerSecret,
			this.accessTokenSecret
		]);

		const oauth_signature = createHmac('sha1', key)
			.update(base)
			.digest('base64');

		const result = encodeAndJoin({ ...oauthBase, oauth_signature }, ', ');

		return `OAuth ${result}`;
	}

	// TODO(FOG): This is shadowed up, what should I do? Also, public or private?
	// TODO(kyranet): Set the proper options interface for this
	// private async stream(endpoint: string, opts: any) {
	// 	const res = await this.post(endpoint, {
	// 		...opts,
	// 		responseType: 'stream',
	// 		api: streamAPI
	// 	});

	// 	return new TweetStream(res);
	// }

}

interface RequestOptions {
	// TODO(kyranet): Define a better type
	api?: any;
	headers?: Record<string, string>;
	method?: string;
	params?: Record<string, string>;
}

interface UserOptions {
	consumerKey: string;
	consumerSecret: string;
	accessToken: string;
	accessTokenSecret: string;
}
