"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TokenStore {
    constructor() {
        this.gh_access_token = '';
        this.gh_access_token_time = 0;
    }
    checkExpire() {
        if (!this.gh_access_token)
            return true;
        return Math.floor(Date.now() / 1000) - this.gh_access_token_time > 7000;
    }
    setAccessToken(token) {
        this.gh_access_token = token;
        this.gh_access_token_time = Date.now();
    }
}
exports.default = TokenStore;
//# sourceMappingURL=store.js.map