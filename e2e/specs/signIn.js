import { waitForNavigation, clearLocalStorage, url } from "../pageObjects/index"
import { fill_form, submit_form_enter, click_submit_button, getSubmitErrorText, getFieldErrorText } from "../pageObjects/forms";
import { load_signin, load_signup_via_signin, getLocalStorageTokens, tokens } from "../pageObjects/signIn";


describe("test signin view", () => {
  beforeEach(async () => {
    await load_signin();
    expect(await getLocalStorageTokens()).toBeNull();
  });

  afterEach(async () => {
    await clearLocalStorage();
    expect(await getLocalStorageTokens()).toBeNull();
  });

  it("should show the sign-in page", async () => {
    expect(await url()).toBe(URL + "/sign-in");
  });

  it("should show the sign-up page", async () => {
    await load_signup_via_signin()
    expect(await url()).toBe(URL + "/sign-up");
  });

  it("should login with enter, store tokens and refresh to home", async () => {
    expect(await getFieldErrorText()).toEqual([]);
    await fill_form({email: 'a@a.com', password: 'x1y@4f!21a'})
    expect(await getFieldErrorText()).toEqual([]);
    await Promise.all([submit_form_enter(), waitForNavigation()])
    expect(await url()).toBe(URL + "/");
    expect(await getLocalStorageTokens()).toEqual(tokens);
  });

  it("should login with submit button, store tokens and refresh to home", async () => {
    expect(await getFieldErrorText()).toEqual([]);
    await fill_form({email: 'a@a.com', password: 'x1y@4f!21a'})
    expect(await getFieldErrorText()).toEqual([]);
    await Promise.all([click_submit_button(), waitForNavigation()])
    expect(await url()).toBe(URL + "/");
    expect(await getLocalStorageTokens()).toEqual(tokens);
  });

  it("should show email validation error", async () => {
    expect(await getFieldErrorText()).toEqual([]);
    await fill_form({email: 'a@a', password: 'b'})
    expect(await getFieldErrorText()).toEqual(["Invalid email"]);
    await submit_form_enter();
    expect(await url()).toEqual(URL + "/sign-in");
    expect(await getFieldErrorText()).toEqual(["Invalid email"]);
    await fill_form({email: '.com'})
    expect(await getFieldErrorText()).toEqual([]);
  });

  it("should show failed login error", async () => {
    expect(await getSubmitErrorText()).toEqual([]);
    await fill_form({email: 'a@a.com', password: 'b'})
    expect(await getSubmitErrorText()).toEqual([]);
    await submit_form_enter();
    expect(await url()).toEqual(URL + "/sign-in");
    expect(await getSubmitErrorText()).toEqual(["Login or password invalid."]);
    expect(await getLocalStorageTokens()).toBeNull();
    await fill_form({password: 'x'})
    expect(await getSubmitErrorText()).toEqual(["Login or password invalid."]);
    await Promise.all([click_submit_button(), waitForNavigation()])
    expect(await url()).toEqual(URL + "/");
    expect(await getLocalStorageTokens()).toEqual(tokens);
  });

  it("should show failed login error for non-verified user", async () => {
    expect(await getSubmitErrorText()).toEqual([]);
    await fill_form({email: 'c@a.com', password: 'b'})
    expect(await getSubmitErrorText()).toEqual([]);
    await submit_form_enter();
    expect(await url()).toEqual(URL + "/sign-in");
    expect(await getSubmitErrorText()).toEqual(['No active account found with the given credentials']);
    expect(await getLocalStorageTokens()).toBeNull();
  });

});