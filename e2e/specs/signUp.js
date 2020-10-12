import { url, getSuccessMessageText, sleep } from "../pageObjects/index"
import {fillForm, clickSubmitButton, getFieldErrorText, clickSwitch, getSubmitErrorText} from "../pageObjects/forms";
import { loadSignup, getSignUpAPIRequestData } from "../pageObjects/signUp";


const successMessages = ["We have sent an email with a confirmation link to your email address. In order to complete the sign-up process, please click the confirmation link.\n" +
          "\n" +
          "If you do not receive a confirmation email, please check your spam folder. Also, please verify that you entered a valid email address in our sign-up form."]


describe("test signup view", () => {
  beforeEach(async () => {
    await loadSignup();
  });

  it("should show the signup page", async () => {
    expect(await url()).toBe(URL + "/sign-up");
  });

  it("should sign up with all values, submit, go home and show success message", async () => {
    expect(await getFieldErrorText()).toEqual([]);
    await fillForm({email: 'testuser@example.com', password: 'x1y@4f!21a', password_confirm: 'x1y@4f!21a', first_name: 'New', last_name: 'User'})
    await clickSwitch('privacy');
    await clickSwitch('terms');
    expect(await getFieldErrorText()).toEqual([]);
    await clickSubmitButton()
    expect(await url()).toBe(URL + "/");
    expect(await getSuccessMessageText()).toEqual(successMessages);
    expect(await getSignUpAPIRequestData()).toEqual({
      email: 'testuser@example.com',
      password: 'x1y@4f!21a',
      password_confirm: 'x1y@4f!21a',
      first_name: 'New',
      last_name: 'User',
      mailing_list: true,
      privacy: true,
      terms: true
    })
  });

    it("should sign up with all values, disable mailing list, submit, go home and show success message", async () => {
    expect(await getFieldErrorText()).toEqual([]);
    await fillForm({email: 'testuser@example.com', password: 'x1y@4f!21a', password_confirm: 'x1y@4f!21a', first_name: 'New', last_name: 'User'})
    await clickSwitch('mailing_list');
    await clickSwitch('privacy');
    await clickSwitch('terms');
    expect(await getFieldErrorText()).toEqual([]);
    await clickSubmitButton()
    expect(await url()).toBe(URL + "/");
    expect(await getSuccessMessageText()).toEqual(successMessages);
    expect(await getSignUpAPIRequestData()).toEqual({
      email: 'testuser@example.com',
      password: 'x1y@4f!21a',
      password_confirm: 'x1y@4f!21a',
      first_name: 'New',
      last_name: 'User',
      mailing_list: false,
      privacy: true,
      terms: true
    })
  });

  it("should show email validation error", async () => {
    expect(await getFieldErrorText()).toEqual([]);
    await fillForm({email: 'testuser@example', password: 'x1y@4f!21a', password_confirm: 'x1y@4f!21a', first_name: 'test', last_name: 'user'})
    expect(await getFieldErrorText()).toEqual(["Invalid email"]);
    await clickSwitch('privacy');
    await clickSwitch('terms');
    expect(await getFieldErrorText()).toEqual(["Invalid email"]);
    await clickSubmitButton();
    expect(await url()).toEqual(URL + "/sign-up");
    expect(await getFieldErrorText()).toEqual(["Invalid email"]);
    await fillForm({email: '.com'})
    expect(await getFieldErrorText()).toEqual([]);
  });

  it("should show password not match", async () => {
    expect(await getFieldErrorText()).toEqual([]);
    await clickSwitch('privacy');
    await clickSwitch('terms');
    expect(await getFieldErrorText()).toEqual([]);
    await fillForm({email: 'testuser@example.com', password: 'x1y@4f!21a', password_confirm: 'x1y@4f!21', first_name: 'test', last_name: 'user'})
    expect(await getFieldErrorText()).toEqual(['Passwords do not match']);
    await clickSubmitButton();
    expect(await url()).toEqual(URL + "/sign-up");
    expect(await getFieldErrorText()).toEqual(['Passwords do not match']);
    await fillForm({password_confirm: 'a'})
    expect(await getFieldErrorText()).toEqual([]);
  });

  it("should say user already exists", async () => {
    expect(await getFieldErrorText()).toEqual([]);
    await fillForm({email: 'c@a.com', password: 'x1y@4f!21a', password_confirm: 'x1y@4f!21a', first_name: 'test', last_name: 'user'})
    await clickSwitch('privacy');
    await clickSwitch('terms');
    expect(await getFieldErrorText()).toEqual([]);
    await clickSubmitButton();
    expect(await url()).toEqual(URL + "/sign-up");
    expect(await getFieldErrorText()).toEqual(['User with this email address already exists.']);
    await fillForm({email: '.com'})
    expect(await getFieldErrorText()).toEqual(['User with this email address already exists.']);
    await clickSubmitButton();
    expect(await url()).toBe(URL + "/");
    expect(await getSuccessMessageText()).toEqual(successMessages);
  });

  it("should say privacy has not been selected", async () => {
    expect(await getFieldErrorText()).toEqual([]);
    await fillForm({email: 'testuser@example.com', password: 'x1y@4f!21a', password_confirm: 'x1y@4f!21a',
      first_name: 'test', last_name: 'user'})
    await clickSwitch('terms');
    expect(await getFieldErrorText()).toEqual([]);
    await clickSubmitButton();
    expect(await getSignUpAPIRequestData()).toEqual({
      email: 'testuser@example.com',
      password: 'x1y@4f!21a',
      password_confirm: 'x1y@4f!21a',
      first_name: 'test',
      last_name: 'user',
      mailing_list: true,
      terms: true,
    })
    expect(await url()).toEqual(URL + "/sign-up");
    expect(await getSubmitErrorText()).toEqual(['You must accept the privacy policy before registering']);
    expect(await getFieldErrorText()).toEqual(['You must accept the privacy policy before registering']);
    await clickSwitch('privacy');
    await clickSubmitButton();
    expect(await url()).toBe(URL + "/");
    expect(await getSuccessMessageText()).toEqual(successMessages);
  });

  it("should say terms has not been selected", async () => {
    expect(await getFieldErrorText()).toEqual([]);
    await fillForm({email: 'testuser@example.com', password: 'x1y@4f!21a', password_confirm: 'x1y@4f!21a',
      first_name: 'test', last_name: 'user'})
    await clickSwitch('privacy');
    expect(await getFieldErrorText()).toEqual([]);
    await clickSubmitButton();
    expect(await getSignUpAPIRequestData()).toEqual({
      email: 'testuser@example.com',
      password: 'x1y@4f!21a',
      password_confirm: 'x1y@4f!21a',
      first_name: 'test',
      last_name: 'user',
      mailing_list: true,
      privacy: true,
    })
    expect(await url()).toEqual(URL + "/sign-up");
    expect(await getSubmitErrorText()).toEqual(['You must accept the terms and conditions before registering']);
    expect(await getFieldErrorText()).toEqual(['You must accept the terms and conditions before registering']);
    await clickSwitch('terms');
    await clickSubmitButton();
    expect(await url()).toBe(URL + "/");
    expect(await getSuccessMessageText()).toEqual(successMessages);
  });

  it("signup view should say password is not strong enough", async () => {
    expect(await getFieldErrorText()).toEqual([]);
    await fillForm({email: 'testuser@example.com', password: 'x', password_confirm: 'x', first_name: 'test', last_name: 'user'})
    await clickSwitch('privacy');
    await clickSwitch('terms');
    expect(await getFieldErrorText()).toEqual([]);
    await clickSubmitButton();
    expect(await url()).toEqual(URL + "/sign-up");
    expect(await getFieldErrorText()).toEqual(['This password is too short. It must contain at least 8 characters.']);
    await fillForm({password: '1y@4f!21a', password_confirm: '1y@4f!21a'})
    expect(await getFieldErrorText()).toEqual(['This password is too short. It must contain at least 8 characters.']);
    await clickSubmitButton();
    expect(await url()).toBe(URL + "/");
    expect(await getSuccessMessageText()).toEqual(successMessages);
  });
});