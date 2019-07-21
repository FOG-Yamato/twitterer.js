import { EventEmitter } from 'events';
import { AbortController } from 'abort-controller';
import { URL } from 'url';
import fetch from 'node-fetch';

export class TweetStream extends EventEmitter {

	private controller: AbortController | null = null;
	private timeout: NodeJS.Timeout | null = null;
	private flag: boolean = false;
	private collector: string = '';

	public async run(url: URL, opts: any): Promise<void> {
		this.controller = new AbortController();
		const res = await fetch(url.href, { ...opts, signal: this.controller.signal });
		if (res.status === 404) throw res.statusText;
		if (!res.ok && res.status !== 401) throw await res.text();
		if (res.status === 401) return this.run(url, opts);
		this.emit('ready');
		this.timeout = setTimeout(() => {
			this.flag = true;
			this.end();
		}, 60000);
		try {
			for await (const payload of res.body) {
				clearTimeout(this.timeout);
				const initial = payload.toString('utf8');
				if (/^\s+$/.test(initial)) {
					this.emit('heartbeat');
				} else {
					this.collector += initial;
					if (this.collector.endsWith('\r\n')) {
						const processed = JSON.parse(this.collector);
						if (processed.delete) this.emit('deleteTweet', processed.delete);
						else if (processed.retweeted_status) this.emit('retweet', processed);
						else if (processed.in_reply_to_status_id) this.emit('reply', processed);
						else this.emit('tweet', processed);
						this.collector = '';
					}
				}
				this.timeout = setTimeout(() => {
					this.flag = true;
					this.end();
				}, 60000);
			}
			return this.run(url, opts);
		} catch (e) {
			if (this.flag && e.type === 'aborted') this.run(url, opts);
		}
	}

	public end() {
		if (this.controller) {
			this.controller.abort();
			this.emit('end');
		}
	}

}
