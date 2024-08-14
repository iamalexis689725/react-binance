// utils/crypto.js
import CryptoJS from 'crypto-js';

export const stringToSha1 = str => {
    return CryptoJS.SHA1(str).toString(CryptoJS.enc.Hex);
};
