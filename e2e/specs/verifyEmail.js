import { waitForNavigation, url, getSuccessMessageText, getErrorMessageText } from "../pageObjects/index"
import { load_verify_email_url } from "../pageObjects/verifyEmail";


const successMessages = ["Email verified successfully",];
const errorMessages = ['Invalid signature. Please check again the link in the email you received.']


describe("test verify email view", () => {
  it("should verify email, redirect to home and show success message", async () => {
    await Promise.all([load_verify_email_url("user_id=1&timestamp=1589819019&signature=1235&email=a@c.com"), waitForNavigation()])
    expect(await url()).toBe(URL + "/");
    expect(await getSuccessMessageText()).toEqual(successMessages);
  });

  it("should fail to verify email with wrong signature", async () => {
    await Promise.all([load_verify_email_url("user_id=1&timestamp=1589819019&signature=1234&email=a@c.com"), waitForNavigation()])
    expect(await url()).toBe(URL + "/");
    expect(await getErrorMessageText()).toEqual(errorMessages);
  });
});