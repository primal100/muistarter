import { clickAndWaitNavigation } from "./index";

export const clickSignOut = async () => {
  await page.waitForSelector('#sign-out');
  await clickAndWaitNavigation('#sign-out');
};