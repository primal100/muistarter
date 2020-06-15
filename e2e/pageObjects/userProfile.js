import { signedIn } from "./signIn";

export const loadUserProfile = async () => {
  await signedIn();
  await page.waitForSelector('#profile')
  await page.click('#profile', {
    waitUntil: "domcontentloaded",
    timeout: 10000
  });
  await page.waitForSelector('input[name=first_name]')
  await page.waitForSelector('#enable-first_name')
};


export const loadUserProfileNotLoggedIn = async () => {
  await page.goto(URL + '/profile', {
    waitUntil: "networkidle0",
    timeout: 60000
  });
};
