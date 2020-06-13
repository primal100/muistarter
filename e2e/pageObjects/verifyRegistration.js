export const load_verify_registration_url = async (params) => {
  await page.goto(URL + "/sign-up-verify-email?" + params, {
    waitUntil: "networkidle0",
    timeout: 60000
  });
}
