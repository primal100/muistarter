import { load } from './index'

export const load_send_reset_password_url = async () => {
  await load()
  await page.click('#sign-in', {
    waitUntil: "networkidle0",
    timeout: 10000
  });
  await page.click('#send_reset_password_link', {
    waitUntil: "networkidle0",
    timeout: 10000
  });
  await page.click('#send_reset_password_link', {
    waitUntil: "networkidle0",
    timeout: 10000
  });
};

