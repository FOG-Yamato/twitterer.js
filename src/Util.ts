import { URL } from 'url';
import { Headers } from 'node-fetch';
const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function shuffleArray(array: readonly unknown[]) {
	const clone = [...array]; // Copy the array

	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[clone[i], clone[j]] = [clone[j], clone[i]];
	}

	return array;
}

export function randomString(length: number = 10) {
	return shuffleArray(CHARS.split(''))
		.slice(0, length)
		.join('');
}

export function sortByKeys<T extends Record<string, any>>(obj: T): T {
	const result = {} as unknown as T;

	// @ts-ignore
	for (const key of Object.keys(obj).sort()) result[key] = obj[key];
	return result;
}

export function encodeAndJoin(obj: readonly unknown[] | object, separator: string = '&') {
	if (Array.isArray(obj)) {
		return obj.map(encodeURIComponent).join(separator);
	}

	return Object.entries(obj)
		.map(pair => pair.map(encodeURIComponent).join('='))
		.join(separator);
}

export function rawURL(url: string, base?: string | URL) {
	return new URL(url.split('?')[0], base).toString();
}

export function createAPI(baseURL: string, opts: APIRequestOptions = {}) {
	const headers = new Headers([
		['user-agent', 'twitter.js']
	]);
	if (opts.token) headers.set('authorization', `Bearer ${opts.token}`);
	// TODO(FOG): Rewrite this to node-fetch
	// return axios.create({ ...opts, baseURL, headers });
	return { request() {} };
}

interface APIRequestOptions extends Record<string, unknown> {
	token?: string;
}
