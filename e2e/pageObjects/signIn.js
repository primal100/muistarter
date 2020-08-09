import {load, clickAndWaitNavigation} from './index'
import { fillForm, clickSubmitButton } from "./forms";


const access = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxOTk1MzQxNzQ3LCJqdGkiOiI5NGEyZTBiZWRkZjI0NjZiOTdiOGI3YzEwMjk0NTU1ZCIsInVzZXJfaWQiOjF9.l29e1XOpGTtE7aLIG0uLFnUBOu7sEXR6VGhUOwG7qE0'
const refresh = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTk5NjgzMDE0NywianRpIjoiMDIzYTJiZjE3YTIyNDVjZWJiZjFiNjNhN2E2MmNmZGUiLCJ1c2VyX2lkIjoxfQ.Y-TFsZfIT28FtCLmzLhtE0eZrduZ6ImEFu1Dd9k0Dfg'
export const tokens = {accessToken: access, refreshToken: refresh}
const staffAccess = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxOTk1MzQxNzQ3LCJqdGkiOiI5NGEyZTBiZWRkZjI0NjZiOTdiOGI3YzEwMjk0NTU1ZCIsInVzZXJfaWQiOjJ9.Hqr8HHXNYgShkWNiQ6dkbtGyl7o-RPjYszWxxz3-tQs'
const staffRefresh = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTk5NjgzMDE0NywianRpIjoiMDIzYTJiZjE3YTIyNDVjZWJiZjFiNjNhN2E2MmNmZGUiLCJ1c2VyX2lkIjoyfQ.9kwlRLSYN2qVf5BWZWJFQYiSanE_DDc4RxKvf8x6iac'
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
  await fillForm({login: 'a@a.com', password: 'x1y@4f!21a'});
  await clickSubmitButton();
};

export const getLocalStorageTokens = async () => await page.evaluate(() => JSON.parse(localStorage.getItem('auth-tokens-development')))