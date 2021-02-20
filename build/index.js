"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const wxSign_1 = require("./wxSign");
const xml_1 = require("./xml");
const constants_1 = require("./constants");
const store_1 = require("./store");
const utils_1 = require("./utils");
class WechatKit {
    constructor(options) {
        this.options = options;
        this.store = new store_1.default();
        this.signType = options.signType ? options.signType : 'MD5';
        switch (options.area) {
            case 'HK':
                this.url = constants_1.WechatUrl.hk;
                break;
            case 'SH':
                this.url = constants_1.WechatUrl.sh;
                break;
            case 'SZ':
                this.url = constants_1.WechatUrl.sz;
                break;
            default:
                this.url = constants_1.WechatUrl.default;
                break;
        }
        this.axios = axios_1.default.create({
            url: 'https://' + this.url,
            timeout: 5000,
        });
    }
    static checkWX(signature, token, timestamp, nonce) {
        const str = [token, timestamp, nonce].sort().join('');
        console.log('token is ->', token);
        const newStr = utils_1.signSHA1(str);
        if (newStr === signature)
            return true;
        return false;
    }
    static buildValiMid(token, type) {
        if (type.toLowerCase() === 'post') {
            return async function postSign(ctx, next) {
                if (!ctx.query || !ctx.query.signature || !ctx.query.timestamp || !ctx.query.nonce)
                    return;
                const { signature, timestamp, nonce, } = ctx.query;
                if (WechatKit.checkWX(signature, token, timestamp, nonce)) {
                    await next();
                }
                return;
            };
        }
        else if (type.toLowerCase() === 'get') {
            return async function getVali(ctx) {
                if (!ctx.query || !ctx.query.signature || !ctx.query.timestamp || !ctx.query.nonce)
                    return;
                const { signature, timestamp, nonce, } = ctx.query;
                if (WechatKit.checkWX(signature, token, timestamp, nonce)) {
                    ctx.body = ctx.query.echostr;
                }
                else {
                    return;
                }
            };
        }
    }
    static async wxMessageParser(ctx, next) {
        if (ctx.method === 'POST' && ctx.is('text/xml')) {
            const messageInfos = await new Promise(function (resolve) {
                let xml = '';
                ctx.req.setEncoding('utf8');
                ctx.req.on('data', (chunk) => {
                    xml += chunk;
                });
                ctx.req.on('end', () => {
                    ctx.xml = xml;
                    const returnObj = xml_1.xml2obj(xml);
                    resolve(returnObj);
                });
            });
            ctx.MsgInfos = messageInfos.xml;
        }
        await next();
    }
    async getAccessToken() {
        if (this.store.checkExpire()) {
            await this.refreshToken();
        }
        return this.store.gh_access_token;
    }
    async refreshToken() {
        const { appId, appSecret, } = this.options;
        const aimUrl = `/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
        const tokenRes = await this.axios.get(aimUrl).catch(err => {
            console.error('refreshToken error', err);
            return null;
        });
        if (!tokenRes || tokenRes.data.errcode && parseInt(tokenRes.data.errcode, 10) !== 0) {
            throw new Error('重要：刷新access_token错误');
        }
        else {
            this.store.setAccessToken(tokenRes.data.access_token);
        }
    }
    createOAuth2Url(redirect_uri, scope_type) {
        const timestamp = Date.now();
        const urlStr = decodeURIComponent(redirect_uri);
        let url;
        try {
            url = new URL(urlStr);
        }
        catch (err) {
            return '';
        }
        if (url.search.length > 0) {
            url.search = `${url.search}&timestamp=${timestamp}`;
        }
        else {
            url.search = `?timestamp=${timestamp}`;
        }
        const convertedUri = encodeURIComponent(url.toString());
        return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.options.appId}&redirect_uri=${convertedUri}&response_type=code&scope=snsapi_${scope_type}&state=${scope_type}#wechat_redirect`;
    }
    async getUserTokenByCode(code) {
        const { appId, appSecret, } = this.options;
        const aimUrl = `/sns/oauth2/access_token?appid=${appId}&secret=${appSecret}&code=${code}&grant_type=authorization_code`;
        const tokenRes = await this.axios.get(aimUrl).catch(err => {
            console.error('get user Auth token err', err);
            return null;
        });
        return tokenRes ? tokenRes.data : null;
    }
    async refreshUserToken(user_refresh_token) {
        const { appId, } = this.options;
        const aimUrl = `/sns/oauth2/refresh_token?appid=${appId}&grant_type=refresh_token&refresh_token=${user_refresh_token}`;
        const refreshTokenRes = await this.axios.get(aimUrl).catch(err => {
            console.error('refreshUserToken err', err);
            return null;
        });
        return refreshTokenRes ? refreshTokenRes.data : null;
    }
    async checkUserToken(openId, access_token) {
        const aimUrl = `/sns/auth?access_token=${access_token}&openid=${openId}`;
        const checkTokenRes = await this.axios.get(aimUrl).catch(err => {
            console.error('checkUserToken err', err);
            return null;
        });
        return checkTokenRes ? checkTokenRes.data : null;
    }
    async getUserInfoByToken(openId, userToken) {
        const aimUrl = `/sns/userinfo?access_token=${openId}&openid=${userToken}&lang=zh_CN`;
        const infoRes = await this.axios.get(aimUrl).catch(err => {
            console.error('get User Info err', err);
            return null;
        });
        return infoRes ? infoRes.data : null;
    }
    async getMenu() {
        const gh_access_token = await this.getAccessToken();
        const aimUrl = `/cgi-bin/menu/get?access_token=${gh_access_token}`;
        const menuRes = await this.axios.get(aimUrl).catch(err => {
            console.error('wechatkit queryMenu err', err);
            return null;
        });
        return menuRes ? menuRes.data : null;
    }
    async setMenu(menuObj) {
        const gh_access_token = await this.getAccessToken();
        const aimUrl = `/cgi-bin/menu/create?access_token=${gh_access_token}`;
        const menuRes = await this.axios.post(aimUrl, menuObj).catch(err => {
            console.error('wechatkit setMenu err', err);
            return null;
        });
        return menuRes ? menuRes.data : menuRes;
    }
    async deleteMenu() {
        const gh_access_token = await this.getAccessToken();
        const menuRes = await axios_1.default.get(`/cgi-bin/menu/delete?access_token=${gh_access_token}`).catch(err => {
            console.error('wechatkit deleteMenu err', err);
            return null;
        });
        return menuRes ? menuRes.data : null;
    }
    async createUnifiedOrder(orderInfos) {
        if (!this.options.mchId)
            throw new Error('重要错误：未配置商户信息！');
        const aimUrl = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
        const serverInfos = {
            appid: this.options.appId,
            mch_id: this.options.mchId,
            notify_url: this.options.notifyUrl,
            sign_type: this.signType,
        };
        const newObj = Object.assign(orderInfos, serverInfos);
        const signedXML = wxSign_1.normalSigh(newObj, this.options.mchKey || '');
        const prepayRes = await axios_1.default.post(aimUrl, signedXML).catch(err => {
            console.error('createUnifiedOrder error', err);
            return null;
        });
        if (!prepayRes)
            return;
        const returnXML = prepayRes.data;
        const returnObj = xml_1.xml2obj(returnXML).xml;
        const returnInfo = {};
        switch (orderInfos.trade_type) {
            case 'JSAPI':
                returnInfo.prepay_id = returnObj.prepay_id;
                break;
            case 'APP':
                returnInfo.prepay_id = returnObj.prepay_id;
                break;
            case 'MWEB':
                returnInfo.prepay_id = returnObj.prepay_id;
                break;
            case 'NATIVE':
                returnInfo.prepay_id = returnObj.prepay_id;
                returnInfo.code_url = returnObj.code_url;
                break;
            default:
                returnInfo.prepay_id = returnObj.prepay_id;
                break;
        }
        return returnInfo;
    }
    async createClientWXPayInfos(orderInfos) {
        const prepay_id = (await this.createUnifiedOrder(orderInfos)).prepay_id;
        return wxSign_1.signWXPay(prepay_id, this.options.appId, this.options.mchKey || '');
    }
    async createAppWXPayInfos(orderInfos) {
        const prepay_id = (await this.createUnifiedOrder(orderInfos)).prepay_id;
        return wxSign_1.signAppPay(prepay_id, this.options.appId, this.options.mchId || '', this.options.mchKey || '');
    }
    async checkWXPayment(transaction_id) {
        const aimUrl = 'https://api.mch.weixin.qq.com/pay/orderquery';
        const signInfos = {
            appid: this.options.appId,
            mch_id: this.options.mchId,
            transaction_id,
        };
        const signedXML = wxSign_1.normalSigh(signInfos, this.options.mchKey || '');
        const checkRes = await axios_1.default.post(aimUrl, signedXML);
        return checkRes.data;
    }
}
exports.default = WechatKit;
//# sourceMappingURL=index.js.map