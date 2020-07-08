import {load, clickAndWaitNavigation} from './index'
import { fillForm, clickSubmitButton } from "./forms";


const access = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1OTA5NTk1NTcsImV4cCI6MTYyMjQ5NTU1NywiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.p2LvatOtvnZ42WBsSP0jb2OXtX_5gkbbzqyRMZMUE8k'
const refresh = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1OTA5NTk1NTcsImV4cCI6MTYyMjQ5NTU1NywiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.3J6JVkEL8Sv0MJlV4bkKtmHZ7WNjz5-F8h_VvOwRHng'
export const tokens = {accessToken: access, refreshToken: refresh}
const staffAccess = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTk0MjQxNzQ3LCJqdGkiOiI5NGEyZTBiZWRkZjI0NjZiOTdiOGI3YzEwMjk0NTU1ZCIsInVzZXJfaWQiOjF9.7F1vvvd62ToxoMaJ1CVvXsSBAlquR9LfNjryczrsHVU'
const staffRefresh = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTU5NjgzMDE0NywianRpIjoiMDIzYTJiZjE3YTIyNDVjZWJiZjFiNjNhN2E2MmNmZGUiLCJ1c2VyX2lkIjoxfQ.mJ0ibXGcQDIMtwUwlMdFR25OqssO3pzGoKyfQD0lrnQ'
export const staffTokens = {accessToken: staffAccess, refreshToken: staffRefresh}


export const goToSignIn = async () => {
  await page.waitForSelector('#sign-in',{
        timeout: 5000
      });
  await clickAndWaitNavigation('#sign-in');
}

export const loadSignIn = async () => {
  await load();
  await goToSignIn();
};

export const loadSignUpViaSignIn = async () => {
  await clickAndWaitNavigation('#sign-up2');
};

export const signedIn = async () => {
  await loadSignIn();
  await fillForm({email: 'a@a.com', password: 'x1y@4f!21a'});
  await clickSubmitButton();
};

export const getLocalStorageTokens = async () => await page.evaluate(() => JSON.parse(localStorage.getItem('auth-tokens-development')))