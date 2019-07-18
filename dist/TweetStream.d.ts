/// <reference types="node" />
import { EventEmitter } from 'events';
import { URL } from 'url';
export declare class TweetStream extends EventEmitter {
    private controller;
    private timeout;
    private flag;
    run(url: URL, opts: any): Promise<void>;
    end(): void;
}
