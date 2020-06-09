import { waitForNavigation, url, getSuccessMessageText } from "../pageObjects/index"
import {fill_form, submit_form_enter, getFieldErrorText, getSubmitErrorText} from "../pageObjects/forms";
import { load_verify_registration_url } from "../pageObjects/verify_registration";


const successMessages = ['User verified successfully']
const errorMessages = ['Invalid signature']


describe("test verify registration view", () => {
  beforeEach(async () => {
    await load_verify_registration_url();
  });

  it("should verify registration, redirect to sign-in and show success message", async () => {
    await Promise.all([load_verify_registration_url("user_id=1&timestamp=1589819019&signature=1235"), waitForNavigation()])
    const params = new URLSearchParams();
    expect(params.user_id === '1');
    expect(params.timestamp === '1589819019');
    expect(params.signature === '1235');
  });

  it("should go to sign-in page and show success message", async () => {
    await waitForNavigation();
    expect(await url()).toBe(URL + "/sign-in");
    expect(await getSuccessMessageText()).toEqual(successMessages);
  });
});


describe("test verify registration view with wrong signature", () => {
  beforeEach(async () => {
    await load_reset_password_url("user_id=1&timestamp=1589819019&signature=1234");
  });

  it("should show the reset password page with the incorrect signature", async () => {
    expect(await url()).toBe(URL + "/sign-up-verify-email?user_id=1&timestamp=1589819019&signature=1234");
    const params = new URLSearchParams();
    expect(params.user_id === '1');
    expect(params.timestamp === '1589819019');
    expect(params.signature === '1234');
  });

  it("should say the signature is wrong", async () => {
    await waitForNavigation();
    expect(await url()).toBe(URL + "/sign-in");
    expect(await getErrorMessageText()).toEqual(errorMessages);
  });
});