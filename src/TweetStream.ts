import { EventEmitter } from 'events';

export class TweetStream extends EventEmitter {

	private stream: any;

	public constructor(stream: any) {
		super();
		this.stream = stream;
		this.listen();
	}

	public listen() {
		let payload = '';

		this.stream
			// TODO(FOG): What type is this?
			.on('data', (data: any) => {
				if (/^\s+$/.test(data)) return; // Skip heartbeats
				payload += data.toString();

				if (payload.endsWith('\r\n')) {
					this.emit('tweet', JSON.parse(payload));
					payload = '';
				}
			})
			.once('end', () => this.emit('end'));
	}

	public end() {
		this.stream.removeAllListeners();
		this.emit('end');
	}

}
