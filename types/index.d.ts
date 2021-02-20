import { AxiosInstance } from 'axios';
import TokenStore from './store';
export interface WechatOptions {
    appId: string;
    appSecret: string;
    token: string;
    signType?: 'MD5' | 'SHA1';
    area?: 'SH' | 'SZ' | 'HK';
    mchId?: string;
    mchKey?: string;
    notifyUrl?: string;
}
export default class WechatKit {
    options: WechatOptions;
    url: string;
    store: TokenStore;
    signType: 'MD5' | 'SHA1';
    axios: AxiosInstance;
    constructor(options: WechatOptions);
    static checkWX(signature: string, token: string, timestamp: number, nonce: string): boolean;
    static buildValiMid(token: string, type: string): ((ctx: any, next: Function) => Promise<void>) | undefined;
    static wxMessageParser(ctx: any, next: Function): Promise<void>;
    getAccessToken(): Promise<string>;
    refreshToken(): Promise<void>;
    createOAuth2Url(redirect_uri: string, scope_type: 'base' | 'userinfo'): string;
    getUserTokenByCode(code: string): Promise<any>;
    refreshUserToken(user_refresh_token: string): Promise<any>;
    checkUserToken(openId: string, access_token: string): Promise<any>;
    getUserInfoByToken(openId: string, userToken: string): Promise<any>;
    getMenu(): Promise<any>;
    setMenu(menuObj: any): Promise<any>;
    deleteMenu(): Promise<any>;
    createUnifiedOrder(orderInfos: {
        trade_type: any;
    }): Promise<any>;
    createClientWXPayInfos(orderInfos: {
        trade_type: any;
    }): Promise<{
        nonceStr: string;
        timestamp: string;
        package: string;
        signType: string;
        paySign: string;
    }>;
    createAppWXPayInfos(orderInfos: {
        trade_type: any;
    }): Promise<{
        appid: string;
        noncestr: string;
        timestamp: string;
        sign: string;
        package: string;
        partnerid: string;
        prepayid: string;
    }>;
    checkWXPayment(transaction_id: any): Promise<any>;
}
