import { createAPI } from './Util';
import fetch from 'node-fetch';

export class Application {

	private consumerKey!: string;
	private consumerSecret!: string;
	private accessToken!: string;
	// TODO(kyranet): Check the correct type for this
	private api: any;

	public constructor({ consumerKey, consumerSecret, accessToken }: ApplicationOptions) {
		Object.assign(this, { consumerKey, consumerSecret, accessToken });
		this.api = this.accessToken && Application.createAPI(this.accessToken);
	}

	public get(url: string, opts: RequestOptions) {
		return this.request(url, opts);
	}

	public post(url: string, opts: RequestOptions) {
		return this.request(url, { ...opts, method: 'POST' });
	}

	public delete(url: string, opts: RequestOptions) {
		return this.request(url, { ...opts, method: 'DELETE' });
	}

	// Internal request method
	private async request(url: string, opts: RequestOptions = {}) {
		if (!this.api) {
			await this.auth();
		}

		if (!url.endsWith('.json')) url += '.json';
		try {
			const { data } = await this.api.request({ ...opts, url });
			return data;
		} catch (err) {
			return Promise.reject(err.response.data.errors[0].message);
		}
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
				['Authorization', `Basic ${encoded}`],
				['Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8.']
			]
		});
		const data = await response.json();
		if (!response.ok) throw data.errors[0].message;

		this.accessToken = data.access_token;
		this.api = Application.createAPI(this.accessToken);
		return this;
	}

	private static createAPI(token: string) {
		return createAPI('https://api.twitter.com/1.1/', { token });
	}

}

interface ApplicationOptions {
	consumerKey: string;
	consumerSecret: string;
	accessToken: string;
}

interface RequestOptions {}
