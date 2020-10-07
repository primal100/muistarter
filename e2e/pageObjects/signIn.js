import {load, clickAndWaitNavigation} from './index'
import { fillForm, clickSubmitButton } from "./forms";


const access = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxOTE1NDUyOTYzLCJqdGkiOiJiYTQxZWJkZGMwMGQ0ODhhOTQ1NWM4NzhkNmI1NjJiNiIsInVzZXJfaWQiOjEsImVtYWlsIjoidGVzdHVzZXJAZXhhbXBsZS5jb20iLCJmaXJzdF9uYW1lIjoidGVzdCIsImxhc3RfbmFtZSI6InVzZXIiLCJpc19zdGFmZiI6ZmFsc2UsImlzX3N1cGVydXNlciI6ZmFsc2V9.RF8h_R2KYjV7-0-BYpu7xaWXKei9i99SVHGTEHeUAE0'
const refresh = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTk0Njk4ODk2MywianRpIjoiODg0ZmVhYWFkN2FjNGM5Mjg2ZDIxOTllMDljNjI4MzEiLCJ1c2VyX2lkIjoxLCJlbWFpbCI6InRlc3R1c2VyQGV4YW1wbGUuY29tIiwiZmlyc3RfbmFtZSI6InRlc3QiLCJsYXN0X25hbWUiOiJ1c2VyIiwiaXNfc3RhZmYiOmZhbHNlLCJpc19zdXBlcnVzZXIiOmZhbHNlfQ.mYEs7Swy-7rJ9iWd1l3xNkIcE-2KO9KKR5ZZR-OHNc0'
export const tokens = {accessToken: access, refreshToken: refresh}
const staffAccess = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxOTE1NDUzMTIzLCJqdGkiOiJlYzdjMTFkMGE0OWY0NjBhYWVkNDg4NmE1YWEzZDU2MyIsInVzZXJfaWQiOjIsImVtYWlsIjoic3RhZmZAYWRtaW4uY29tIiwiZmlyc3RfbmFtZSI6IkFkbWluIiwibGFzdF9uYW1lIjoiU3RhZmYiLCJpc19zdGFmZiI6dHJ1ZSwiaXNfc3VwZXJ1c2VyIjpmYWxzZX0.JL1y_0SUL1EW6A_neJH2MRc6BLLGaszgQJH5cgIvCKc'
const staffRefresh = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTk0Njk4OTEyMywianRpIjoiZDQ1OGY4NzM0MTY0NDVjMGI4YWY0NTJkNTQ4Mzc2YzciLCJ1c2VyX2lkIjoyLCJlbWFpbCI6InN0YWZmQGFkbWluLmNvbSIsImZpcnN0X25hbWUiOiJBZG1pbiIsImxhc3RfbmFtZSI6IlN0YWZmIiwiaXNfc3RhZmYiOnRydWUsImlzX3N1cGVydXNlciI6ZmFsc2V9.5vkDMA_7lRMZoY0kJeoHbEKcp6tQibhzfQsSkbIiae0'
export const staffTokens = {accessToken: staffAccess, refreshToken: staffRefresh}


export const goToSignIn = async () => {
  await page.waitForSelector('#sign-in',{
        timeout: 5000
      });
  await clickAndWaitNavigation('#sign-in');
  await page.waitForSelector('#sign-in-form',{
       timeout: 5000
  });
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


export const getLocalStorageTokens = async () => await page.evaluate(() => JSON.parse(localStorage.getItem('auth-tokens-development')));

export const adminLinkExists = async () => await page.$('#admin');