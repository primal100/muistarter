import { waitForNavigation, url, getSuccessMessageText, getErrorMessageText } from "../pageObjects/index"
import { loadVerifyRegistrationUrl } from "../pageObjects/verifyRegistration";


const successMessages = ["Your e-mail address has been verified. Please sign in."];
const errorMessages = ['Invalid signature. Please check again the link in the email you received.']


describe("test verify registration view", () => {
  it("should verify registration, redirect to sign-in and show success message", async () => {
    await Promise.all([loadVerifyRegistrationUrl("user_id=1&timestamp=1589819019&signature=1235"), waitForNavigation()])
    expect(await url()).toBe(URL + "/sign-in");
    expect(await getSuccessMessageText()).toEqual(successMessages);
  });

  it("should fail to verify registration with wrong signature", async () => {
    await Promise.all([loadVerifyRegistrationUrl("user_id=1&timestamp=1589819019&signature=1234"), waitForNavigation()])
    expect(await url()).toBe(URL + "/sign-in");
    expect(await getErrorMessageText()).toEqual(errorMessages);
  });
});
