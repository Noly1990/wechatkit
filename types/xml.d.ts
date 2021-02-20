import * as convert from 'xml-js';
export declare function json2xml(json: string): string;
export declare function obj2xml(obj: convert.Element | convert.ElementCompact): string;
export declare function xml2obj(xml: string): any;
export declare function xml2json(xml: string): string;
