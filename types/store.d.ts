export default class TokenStore {
    gh_access_token: string;
    gh_access_token_time: number;
    checkExpire(): boolean;
    setAccessToken(token: string): void;
}
