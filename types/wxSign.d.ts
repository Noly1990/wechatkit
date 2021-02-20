export declare function normalSigh(signInfos: any, mchKey: string): string;
export declare function signWXPay(prepay_id: string, appId: string, mchKey: string): {
    nonceStr: string;
    timestamp: string;
    package: string;
    signType: string;
    paySign: string;
};
export declare function signAppPay(prepay_id: string, appId: string, mchId: string, mchKey: string): {
    appid: string;
    noncestr: string;
    timestamp: string;
    sign: string;
    package: string;
    partnerid: string;
    prepayid: string;
};
