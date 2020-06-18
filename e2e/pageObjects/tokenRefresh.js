import * as jwt from 'jsonwebtoken'
import { load_once } from "./index";

export const generateToken = (expire_seconds) => {
    return jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (expire_seconds),
      data: 'foobar'
    }, 'secret');
};


const setTokens = async (accessToken, refreshToken) => {
    await load_once();
    const tokens = JSON.stringify({accessToken: accessToken, refreshToken: refreshToken});
    await page.evaluate((tokens) => localStorage.setItem('auth-tokens-development', tokens), tokens);
}

export const setShortLivedAccessToken = async (expire_seconds) => {
    const accessToken = generateToken(expire_seconds);
    const refreshToken = generateToken(60 * 60 * 24);
    await setTokens(accessToken, refreshToken);
}

export const setShortLivedRefreshToken = async (expire_seconds) => {
    const accessToken = generateToken(expire_seconds);
    const refreshToken = generateToken(expire_seconds);
    await setTokens(accessToken, refreshToken);
}




