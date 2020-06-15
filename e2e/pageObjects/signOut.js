import {waitForNavigation} from "./index";


export const clickSignOut = async () => {
  await page.click('#sign-out', {
    waitUntil: "networkidle0",
    timeout: 10000
  });
};

export const clickSignOutAndWait = async () => {
  await Promise.all([clickSignOut(), waitForNavigation()]);
}
