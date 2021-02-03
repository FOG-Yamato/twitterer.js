export declare class Application {
    private consumerKey;
    private consumerSecret;
    private accessToken;
    constructor({ consumerKey, consumerSecret, accessToken }: ApplicationOptions);
    get(endpoint: string, opts: RequestOptions): Promise<any>;
    post(endpoint: string, opts: RequestOptions): Promise<any>;
    delete(endpoint: string, opts: RequestOptions): Promise<any>;
    private request;
    private auth;
}
interface ApplicationOptions {
    consumerKey: string;
    consumerSecret: string;
    accessToken: string;
}
interface RequestOptions {
    [x: string]: any;
}
export {};
