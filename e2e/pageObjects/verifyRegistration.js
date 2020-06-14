import {clearLocalStorage} from "./index";

export const load_verify_registration_url = async (params) => {
  await page.goto(URL + "/sign-up-verify-email?" + params, {
    waitUntil: "networkidle0",
    timeout: 60000
  });
  await clearLocalStorage();
  await page.goto(URL + "/sign-up-verify-email?" + params, {
    waitUntil: "networkidle0",
    timeout: 60000
  });
}
