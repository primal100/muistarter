import { loadUserProfile } from "./userProfile";


export const loadChangePasswordUrl = async () => {
  await loadUserProfile();
  await page.click('#change_password_link', {
    waitUntil: "domcontentloaded",
    timeout: 10000
  });
};
