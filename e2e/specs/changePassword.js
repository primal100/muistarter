import {waitForNavigation, url, getSuccessMessageText} from "../pageObjects/index"
import {fill_form, submit_form_enter, getFieldErrorText, getSubmitErrorText} from "../pageObjects/forms";
import { loadChangePasswordUrl } from "../pageObjects/changePassword";


const successMessages = ["Password changed successfully"]


describe("test change password view", () => {
  beforeEach(async () => {
    await loadChangePasswordUrl();
  });

  it("should show the change password page", async () => {
    console.log('Checking')
    expect(await url()).toBe(URL + "/change-password");
    console.log('Checked')
  });

  it("should fill the change password form, submit, go to profile page and show success message", async () => {
    await fill_form({old_password: 'x1y@4f!21a', password: 'z1y@4f!21a', password_confirm: 'z1y@4f!21a'})
    expect(await getFieldErrorText()).toEqual([]);
    await Promise.all([submit_form_enter(), waitForNavigation()])
    expect(await url()).toBe(URL + "/profile");
    expect(await getSuccessMessageText()).toEqual(successMessages);
  });

  it("should show passwords not match in the change password form", async () => {
    expect(await getFieldErrorText()).toEqual([]);
    await fill_form({old_password: 'x1y@4f!21a', password: 'z1y@4f!21a', password_confirm: 'z1y@4f!21'})
    await submit_form_enter();
    expect(await getFieldErrorText()).toEqual(['Passwords do not match']);
    await fill_form({password_confirm: 'a'})
    expect(await getFieldErrorText()).toEqual([]);
  });

  it("should say password is not strong enough in the change password form", async () => {
    await fill_form({old_password: 'x1y@4f!21a', password: 'z', password_confirm: 'z'})
    expect(await getFieldErrorText()).toEqual([]);
    await submit_form_enter();
    expect(await url()).toBe(URL + "/change-password");
    expect(await getFieldErrorText()).toEqual(['This password is too short. It must contain at least 8 characters.']);
    await fill_form({password: '1y@4f!21a', password_confirm: '1y@4f!21a'})
    expect(await getFieldErrorText()).toEqual(['This password is too short. It must contain at least 8 characters.']);
    await submit_form_enter()
    expect(await url()).toBe(URL + "/profile");
    expect(await getSuccessMessageText()).toEqual(successMessages);
  });

  it("should say the old password is wrong", async () => {
    await fill_form({old_password: 'a', password: 'z00g5r32!', password_confirm: 'z00g5r32!'})
    expect(await getFieldErrorText()).toEqual([]);
    await submit_form_enter();
    expect(await url()).toBe(URL + "/change-password");
    expect(await getFieldErrorText()).toEqual(['Old password is not correct']);
    await fill_form({old_password: '1y@4f!21a'})
    expect(await getFieldErrorText()).toEqual(['Old password is not correct']);
    await submit_form_enter()
    expect(await url()).toBe(URL + "/profile");
    expect(await getSuccessMessageText()).toEqual(successMessages);
  });
});
