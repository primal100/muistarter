import { load, url } from "./index";


export const loadVerifyEmailUrl = async (params) => {
  await load("/verify-email?" + params);
}


export const goToVerifyEmailUrl = async (params) => {
    await page.goto(URL + "/verify-email?" + params, {
    waitUntil: "networkidle0",
    timeout: 60000
  });
}
