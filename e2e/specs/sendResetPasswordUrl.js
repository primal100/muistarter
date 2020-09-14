import {
  url,
  getSuccessMessageText
} from "../pageObjects/index"
import { fillForm, clickSubmitButton, getSubmitErrorText, getFieldErrorText } from "../pageObjects/forms";
import { loadSendResetPasswordURL } from "../pageObjects/sendResetPasswordUrl";

const successMessages = ["A link to reset your password has been sent to your e-mail address."];


describe("test send reset password url view", () => {
  beforeEach(async () => {
    await loadSendResetPasswordURL();
  });

  it("should show the send reset password page", async () => {
    expect(await url()).toBe(URL + "/send-reset-password-url");
  })

  it("should submit send password reset url form successfully and redirect to home with success message", async () => {
    expect(await getFieldErrorText()).toEqual([]);
    await fillForm({login: 'testuser@example.com'})
    expect(await getFieldErrorText()).toEqual([]);
    await clickSubmitButton();
    expect(await url()).toBe(URL + "/");
    expect(await getSuccessMessageText()).toEqual(successMessages);
  });

  it("should show email validation error on password reset form", async () => {
    expect(await getFieldErrorText()).toEqual([]);
    await fillForm({login: 'a@a'})
    await clickSubmitButton();
    expect(await url()).toEqual(URL + "/send-reset-password-url");
    expect(await getFieldErrorText()).toEqual(["Invalid email"]);
    await fillForm({login: '.com'})
    expect(await getFieldErrorText()).toEqual([]);
  });

  it("should say the user does not exist", async () => {
    expect(await getSubmitErrorText()).toEqual([]);
    await fillForm({login: 'b@a.com'})
    expect(await getSubmitErrorText()).toEqual([]);
    await clickSubmitButton();
    expect(await url()).toEqual(URL + "/send-reset-password-url");
    expect(await getSubmitErrorText()).toEqual(['User not found']);
    await fillForm({login: '.com'})
    expect(await getSubmitErrorText()).toEqual(['User not found']);
    await clickSubmitButton()
    expect(await url()).toBe(URL + "/");
    expect(await getSuccessMessageText()).toEqual(successMessages);
  });

});