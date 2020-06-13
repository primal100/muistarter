import { signedIn } from "./signin";

export const loadUserProfile = async () => {
  await signedIn();
  await page.click('#profile', {
    waitUntil: "domcontentloaded",
    timeout: 10000
  });
  await page.waitForSelector('input[name=first_name]')
};

