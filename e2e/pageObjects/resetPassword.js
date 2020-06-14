import {clearLocalStorage} from "./index";

export const load_reset_password_url = async (params) => {
  await page.goto(URL + "/reset-password?" + params, {
    waitUntil: "networkidle0",
    timeout: 60000
  });
  await clearLocalStorage();
  await page.goto(URL + "/reset-password?" + params, {
    waitUntil: "networkidle0",
    timeout: 60000
  });
}
