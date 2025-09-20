import { flow } from 'effect';
import { decode as safeDecode, encode as safeEncode } from 'url-safe-base64';

const encodeBase64IntoSafe = (s: string): string =>
    s
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('');

const decodeBase64IntoSafe = (s: string): string =>
    s.replace(/%([0-9A-F]{2})/g, (_match, p1: string) => String.fromCharCode(parseInt('0x' + p1, 16)));

const removeBase64Appendix = (s: string): string => s.replace(/={0,2}$/g, '');

export const decode = flow(safeDecode, atob, encodeBase64IntoSafe, decodeURIComponent);
export const encode = flow(encodeURIComponent, decodeBase64IntoSafe, btoa, safeEncode, removeBase64Appendix);
