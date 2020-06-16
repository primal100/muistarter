import { url, getSuccessMessageText } from "../pageObjects/index"
import {fillForm, clickSubmitButton, getFieldErrorText, getSubmitErrorText} from "../pageObjects/forms";
import { loadResetPasswordUrl } from "../pageObjects/resetPassword";


const successMessages = ["Reset password successful. Please sign in with the new password."]


describe("test reset password view", () => {
  beforeEach(async () => {
    await loadResetPasswordUrl("user_id=1&timestamp=1589819019&signature=1235");
  });

  it("should show the reset password page with the correct params", async () => {
    expect(await url()).toBe(URL + "/reset-password?user_id=1&timestamp=1589819019&signature=1235");
    const params = new URLSearchParams();
    expect(params.user_id === '1');
    expect(params.timestamp === '1589819019');
    expect(params.signature === '1235');
  });

  it("should enter the password, submit, go to sign-in page and show success message", async () => {
    await fillForm({password: 'x1y@4f!21a', password_confirm: 'x1y@4f!21a'})
    expect(await getFieldErrorText()).toEqual([]);
    await clickSubmitButton();
    expect(await url()).toBe(URL + "/sign-in");
    expect(await getSuccessMessageText()).toEqual(successMessages);
  });

  it("should show password not match", async () => {
    expect(await getFieldErrorText()).toEqual([]);
    await fillForm({password: 'x1y@4f!21a', password_confirm: 'x1y@4f!21'})
    await clickSubmitButton();
    expect(await getFieldErrorText()).toEqual(['Passwords do not match']);
    await fillForm({password_confirm: 'a'})
    expect(await getFieldErrorText()).toEqual([]);
  });

  it("should say password is not strong enough", async () => {
    await fillForm({password: 'x', password_confirm: 'x'})
    expect(await getFieldErrorText()).toEqual([]);
    await clickSubmitButton();
    expect(await url()).toBe(URL + "/reset-password?user_id=1&timestamp=1589819019&signature=1235");
    expect(await getFieldErrorText()).toEqual(['This password is too short. It must contain at least 8 characters.']);
    await fillForm({password: '1y@4f!21a', password_confirm: '1y@4f!21a'})
    expect(await getFieldErrorText()).toEqual(['This password is too short. It must contain at least 8 characters.']);
    await clickSubmitButton()
    expect(await url()).toBe(URL + "/sign-in");
    expect(await getSuccessMessageText()).toEqual(successMessages);
  });
});


describe("test reset password view with wrong signature", () => {
  beforeEach(async () => {
    await loadResetPasswordUrl("user_id=1&timestamp=1589819019&signature=1234");
  });

  it("should show the reset password page with the incorrect signature", async () => {
    expect(await url()).toBe(URL + "/reset-password?user_id=1&timestamp=1589819019&signature=1234");
    const params = new URLSearchParams();
    expect(params.user_id === '1');
    expect(params.timestamp === '1589819019');
    expect(params.signature === '1234');
  });

  it("should say the signature is wrong", async () => {
    await fillForm({password: 'x1y@4f!21a', password_confirm: 'x1y@4f!21a'})
    expect(await getSubmitErrorText()).toEqual([]);
    await clickSubmitButton();
    expect(await url()).toBe(URL + "/reset-password?user_id=1&timestamp=1589819019&signature=1234");
    expect(await getSubmitErrorText()).toEqual(["Invalid signature. Please check again the link in the email you received."]);
  });
});