import { load } from './index'

export const load_signup = async () => {
  await load()
  await page.click('#sign-up', {
    waitUntil: "networkidle0",
    timeout: 10000
  });
};

