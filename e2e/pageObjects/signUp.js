import { load } from './index'

export const load_signup = async () => {
  await load()
  await page.waitForSelector('#sign-up')
  await page.click('#sign-up', {
    waitUntil: "networkidle0",
    timeout: 10000
  });
  await page.waitForSelector('input[name=email]')
};

