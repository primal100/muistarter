export const load_verify_email_url = async (params) => {
  await page.goto(URL + "/verify-email?" + params, {
    waitUntil: "networkidle0",
    timeout: 60000
  });
}
