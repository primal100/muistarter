import { load } from './index'

export const load_signin = async () => {
  await load()
  await page.click('#sign-in', {
    waitUntil: "networkidle0",
    timeout: 10000
  });
};

export const load_signup_via_signin = async () => {
  await page.click('#sign-up2', {
    waitUntil: "networkidle0",
    timeout: 10000
  });
};



