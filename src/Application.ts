import fetch from 'node-fetch';
import { URL, URLSearchParams } from 'url';

export class Application {

	private consumerKey!: string;
	private consumerSecret!: string;
	private accessToken!: string;

	public constructor({ consumerKey, consumerSecret, accessToken }: ApplicationOptions) {
		Object.assign(this, { consumerKey, consumerSecret, accessToken });
	}

	public get(endpoint: string, opts: RequestOptions) {
		return this.request(endpoint, opts);
	}

	public post(endpoint: string, opts: RequestOptions) {
		return this.request(endpoint, { ...opts, method: 'POST' });
	}

	public delete(endpoint: string, opts: RequestOptions) {
		return this.request(endpoint, { ...opts, method: 'DELETE' });
	}

	// Internal request method
	private async request(endpoint: string, opts: RequestOptions = {}) {
		if (!this.accessToken) {
			await this.auth();
		}

		const url = new URL(`https://api.twitter.com/1.1/${endpoint}.json`);
		if (opts.params) url.search = new URLSearchParams(opts.params).toString();

		const response = await fetch(url.href, {
			method: opts.method,
			headers: [
				['User-Agent', 'twitterer.js'],
				['Authorization', `Bearer ${this.accessToken}`]
			]
		});
		const data = await response.json();
		if (!response.ok) throw data.error;
		return data;
	}

	// OAuth 2.0 authentication method
	private async auth() {
		const encoded = Buffer.from(
			[this.consumerKey, this.consumerSecret].join(':')
		).toString('base64');

		const response = await fetch('https://api.twitter.com/oauth2/token', {
			method: 'POST',
			body: 'grant_type=client_credentials',
			headers: [
				['User-Agent', 'twitterer.js'],
				['Authorization', `Basic ${encoded}`],
				['Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8.']
			]
		});
		const data = await response.json();
		if (!response.ok) throw data.errors[0].message;

		this.accessToken = data.access_token;
		return this;
	}

}

interface ApplicationOptions {
	consumerKey: string;
	consumerSecret: string;
	accessToken: string;
}

interface RequestOptions {
	[x: string]: any;
}
