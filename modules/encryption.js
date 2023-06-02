import CryptoJS from 'crypto-js';

const encrypt = (text) => {
  let encrypted = CryptoJS.AES.encrypt(text, process.env.ENCRYPTION_KEY);
  return encrypted.toString();
}

const decrypt = (text) => {
  return CryptoJS.AES.decrypt(text, process.env.ENCRYPTION_KEY).toString(
    CryptoJS.enc.Utf8
  );
}

export { decrypt, encrypt };
