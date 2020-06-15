import { waitForNavigation, url, getSuccessMessageText } from "../pageObjects/index"
import {fill_form, submit_form_enter, getFieldErrorText} from "../pageObjects/forms";
import { load_signup } from "../pageObjects/signUp";


const successMessages = ["We have sent an email with a confirmation link to your email address. In order to complete the sign-up process, please click the confirmation link.\n" +
          "\n" +
          "If you do not receive a confirmation email, please check your spam folder. Also, please verify that you entered a valid email address in our sign-up form."]


describe("test signup view", () => {
  beforeEach(async () => {
    await load_signup();
  });

  it("should show the signup page", async () => {
    expect(await url()).toBe(URL + "/sign-up");
  });

  it("should sign_up with all values, submit, go home and show success message", async () => {
    expect(await getFieldErrorText()).toEqual([]);
    await fill_form({email: 'a@a.com', password: 'x1y@4f!21a', password_confirm: 'x1y@4f!21a', first_name: 'test', last_name: 'user'})
    expect(await getFieldErrorText()).toEqual([]);
    await Promise.all([submit_form_enter(), waitForNavigation()])
    expect(await url()).toBe(URL + "/");
    expect(await getSuccessMessageText()).toEqual(successMessages);
  });

  it("should show email validation error", async () => {
    expect(await getFieldErrorText()).toEqual([]);
    await fill_form({email: 'a@a', password: 'x1y@4f!21a', password_confirm: 'x1y@4f!21a', first_name: 'test', last_name: 'user'})
    expect(await getFieldErrorText()).toEqual(["Invalid email"]);
    await submit_form_enter();
    expect(await url()).toEqual(URL + "/sign-up");
    expect(await getFieldErrorText()).toEqual(["Invalid email"]);
    await fill_form({email: '.com'})
    expect(await getFieldErrorText()).toEqual([]);
  });

  it("should show password not match", async () => {
    expect(await getFieldErrorText()).toEqual([]);
    await fill_form({email: 'a@a.com', password: 'x1y@4f!21a', password_confirm: 'x1y@4f!21', first_name: 'test', last_name: 'user'})
    expect(await getFieldErrorText()).toEqual(['Passwords do not match']);
    await submit_form_enter();
    expect(await url()).toEqual(URL + "/sign-up");
    expect(await getFieldErrorText()).toEqual(['Passwords do not match']);
    await fill_form({password_confirm: 'a'})
    expect(await getFieldErrorText()).toEqual([]);
  });

  it("should say user already exists", async () => {
    expect(await getFieldErrorText()).toEqual([]);
    await fill_form({email: 'c@a.com', password: 'x1y@4f!21a', password_confirm: 'x1y@4f!21a', first_name: 'test', last_name: 'user'})
    expect(await getFieldErrorText()).toEqual([]);
    await submit_form_enter();
    expect(await url()).toEqual(URL + "/sign-up");
    expect(await getFieldErrorText()).toEqual(['User with this email address already exists.']);
    await fill_form({email: '.com'})
    expect(await getFieldErrorText()).toEqual(['User with this email address already exists.']);
    await submit_form_enter()
    expect(await url()).toBe(URL + "/");
    expect(await getSuccessMessageText()).toEqual(successMessages);
  });

  it("signup view should say password is not strong enough", async () => {
    expect(await getFieldErrorText()).toEqual([]);
    await fill_form({email: 'a@a.com', password: 'x', password_confirm: 'x', first_name: 'test', last_name: 'user'})
    expect(await getFieldErrorText()).toEqual([]);
    await submit_form_enter();
    expect(await url()).toEqual(URL + "/sign-up");
    expect(await getFieldErrorText()).toEqual(['This password is too short. It must contain at least 8 characters.']);
    await fill_form({password: '1y@4f!21a', password_confirm: '1y@4f!21a'})
    expect(await getFieldErrorText()).toEqual(['This password is too short. It must contain at least 8 characters.']);
    await submit_form_enter()
    expect(await url()).toBe(URL + "/");
    expect(await getSuccessMessageText()).toEqual(successMessages);
  });
});