import { TweetStream } from './TweetStream';
export declare class User {
    private consumerKey;
    private consumerSecret;
    private accessToken;
    private accessTokenSecret;
    constructor({ consumerKey, consumerSecret, accessToken, accessTokenSecret }: UserOptions);
    get(endpoint: string, opts: RequestOptions): Promise<any>;
    post(endpoint: string, opts: RequestOptions): Promise<any>;
    delete(endpoint: string, opts: RequestOptions): Promise<any>;
    stream(endpoint: string, opts: RequestOptions): Promise<TweetStream>;
    private request;
    private getAuth;
}
interface RequestOptions {
    method?: string;
    params?: Record<string, string>;
}
interface UserOptions {
    consumerKey: string;
    consumerSecret: string;
    accessToken: string;
    accessTokenSecret: string;
}
export {};
