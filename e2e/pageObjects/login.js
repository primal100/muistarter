import { load } from './index'

export const load_login = async () => {
  await load()
  await page.click('#sign-in', {
    waitUntil: "networkidle0",
    timeout: 60000
  });
};


