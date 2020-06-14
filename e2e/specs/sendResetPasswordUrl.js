import {
  waitForNavigation,
  url,
  getSuccessMessageText
} from "../pageObjects/index"
import { fill_form, submit_form_enter, getSubmitErrorText, getFieldErrorText } from "../pageObjects/forms";
import { load_send_reset_password_url } from "../pageObjects/sendResetPasswordUrl";

const successMessages = ["A link to reset your password has been sent to your e-mail address."];


describe("test send reset password url view", () => {
  beforeEach(async () => {
    await load_send_reset_password_url();
  });

  it("should show the send reset password page", async () => {
    expect(await url()).toBe(URL + "/send-reset-password-url");
  })

  it("should submit send password reset url form successfully and redirect to home with success message", async () => {
    expect(await getFieldErrorText()).toEqual([]);
    await fill_form({login: 'a@a.com'})
    expect(await getFieldErrorText()).toEqual([]);
    await Promise.all([submit_form_enter(), waitForNavigation()])
    expect(await url()).toBe(URL + "/");
    expect(await getSuccessMessageText()).toEqual(successMessages);
  });

  it("should show email validation error on password reset form", async () => {
    expect(await getFieldErrorText()).toEqual([]);
    await fill_form({login: 'a@a'})
    await submit_form_enter();
    expect(await url()).toEqual(URL + "/send-reset-password-url");
    expect(await getFieldErrorText()).toEqual(["Invalid email"]);
    await fill_form({login: '.com'})
    expect(await getFieldErrorText()).toEqual([]);
  });

  it("should say the user does not exist", async () => {
    expect(await getSubmitErrorText()).toEqual([]);
    await fill_form({login: 'b@a.com'})
    expect(await getSubmitErrorText()).toEqual([]);
    await submit_form_enter();
    expect(await url()).toEqual(URL + "/send-reset-password-url");
    expect(await getSubmitErrorText()).toEqual(['User not found']);
    await fill_form({login: '.com'})
    expect(await getSubmitErrorText()).toEqual(['User not found']);
    await submit_form_enter()
    expect(await url()).toBe(URL + "/");
    expect(await getSuccessMessageText()).toEqual(successMessages);
  });

});