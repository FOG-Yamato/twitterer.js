import { createHmac } from 'crypto';
import { URL, URLSearchParams } from 'url';
import fetch from 'node-fetch';
import { TweetStream } from './TweetStream';

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

	public get(endpoint: string, opts: RequestOptions) {
		const url = new URL(`https://api.twitter.com/1.1/${endpoint}.json`);
		if (opts.params) url.search = new URLSearchParams(opts.params).toString();
		return this.request(url, opts);
	}

	public post(endpoint: string, opts: RequestOptions) {
		const url = new URL(`https://api.twitter.com/1.1/${endpoint}.json`);
		if (opts.params) url.search = new URLSearchParams(opts.params).toString();
		return this.request(url, { ...opts, method: 'POST' });
	}

	public delete(endpoint: string, opts: RequestOptions) {
		const url = new URL(`https://api.twitter.com/1.1/${endpoint}.json`);
		if (opts.params) url.search = new URLSearchParams(opts.params).toString();
		return this.request(url, { ...opts, method: 'DELETE' });
	}

	public async stream(endpoint: string, opts: RequestOptions) {
		const url = new URL(`https://stream.twitter.com/1.1/${endpoint}.json`);
		if (opts.params) url.search = new URLSearchParams(opts.params).toString();
		const loader = new TweetStream();
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
	private async request(url: URL, opts: RequestOptions = {}) {

		const response = await fetch(url.href, {
			method: opts.method,
			headers: [
				['User-Agent', 'twitterer.js'],
				['Authorization', this.getAuth(opts.method || 'GET', url)]
			]
		});
		const data = await response.json();
		if (!response.ok) throw data.error;
		return data;
	}

	private getAuth(method: string, url: URL) {
		const oauthBase = {
			oauth_consumer_key: this.consumerKey,
			oauth_nonce: Array.from({ length: 32 }, () => Math.floor(Math.random() * 36).toString(36)).join(''),
			oauth_signature_method: 'HMAC-SHA1',
			oauth_timestamp: Math.floor(Date.now() / 1000),
			oauth_token: this.accessToken,
			oauth_version: '1.0'
		};

		const encodedParams = new URLSearchParams(url.searchParams);
		for (const [key, value] of Object.entries(oauthBase)) encodedParams.append(key, value.toString());
		const base = [method, url.href.split('?')[0], encodedParams.toString()].map(encodeURIComponent).join('&');
		const key = [this.consumerSecret, this.accessTokenSecret].map(encodeURIComponent).join('&');
		const oauth_signature = createHmac('sha1', key)
			.update(base)
			.digest('base64');

		return `OAuth ${Object.entries({ ...oauthBase, oauth_signature }).map(r => r.map(encodeURIComponent).join('=')).join(', ')}`;
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
