import {load, waitForNavigation} from './index'
import {fill_form, click_submit_button} from "./forms";


const access = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1OTA5NTk1NTcsImV4cCI6MTYyMjQ5NTU1NywiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.p2LvatOtvnZ42WBsSP0jb2OXtX_5gkbbzqyRMZMUE8k'
const refresh = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1OTA5NTk1NTcsImV4cCI6MTYyMjQ5NTU1NywiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.3J6JVkEL8Sv0MJlV4bkKtmHZ7WNjz5-F8h_VvOwRHng'
export const tokens = {accessToken: access, refreshToken: refresh}


export const goToSignin = async () => {
  await page.click('#sign-in', {
    waitUntil: "networkidle0",
    timeout: 10000
  });
}


export const load_signin = async () => {
  await load();
  await goToSignin();
};

export const load_signup_via_signin = async () => {
  await page.click('#sign-up2', {
    waitUntil: "networkidle0",
    timeout: 10000
  });
};


export const signedIn = async () => {
  await load()
  if (await page.$('#sign-in') !== null) {
    await goToSignin();
    await fill_form({email: 'a@a.com', password: 'x1y@4f!21a'})
    await Promise.all([click_submit_button(), waitForNavigation()])
  }
};


export const getLocalStorageTokens = async () => await page.evaluate(() => JSON.parse(localStorage.getItem('auth-tokens-development')))