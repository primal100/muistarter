import { waitForNavigation, clearLocalStorage, sleep, url } from "../pageObjects/index"
import { fillForm, submitFormEnter, clickSubmitButton, getSubmitErrorText, getFieldErrorText, getTextContent } from "../pageObjects/forms";
import { loadSignIn, loadSignUpViaSignIn, getLocalStorageTokens, tokens, staffTokens } from "../pageObjects/signIn";


describe("test signin view", () => {
  beforeEach(async () => {
    await loadSignIn();
    expect(await getLocalStorageTokens()).toBeNull();
  });

  afterEach(async () => {
    await clearLocalStorage();
  });

  it("should show the sign-in page", async () => {
    expect(await url()).toBe(URL + "/sign-in");
    expect(await getTextContent("#username")).toEqual([]);
  });

  it("should show the sign-up page", async () => {
    await loadSignUpViaSignIn()
    expect(await url()).toBe(URL + "/sign-up");
  });

  it("should login with enter, store tokens and refresh to home", async () => {
    expect(await getFieldErrorText()).toEqual([]);
    await fillForm({email: 'a@a.com', password: 'x1y@4f!21a'})
    expect(await getFieldErrorText()).toEqual([]);
    await Promise.all([submitFormEnter(), waitForNavigation()])
    expect(await url()).toBe(URL + "/");
    expect(await getLocalStorageTokens()).toEqual(tokens);
    await sleep(1);
    expect(await getTextContent("#username")).toEqual(["test user a@a.com"]);
    expect(await getTextContent("#is-staff")).toEqual([]);
  });

  it("should login with submit button, store tokens and refresh to home", async () => {
    expect(await getFieldErrorText()).toEqual([]);
    await fillForm({email: 'a@a.com', password: 'x1y@4f!21a'})
    expect(await getFieldErrorText()).toEqual([]);
    await clickSubmitButton();
    expect(await url()).toBe(URL + "/");
    expect(await getLocalStorageTokens()).toEqual(tokens)
    await sleep(1);
    expect(await getTextContent("#username")).toEqual(["test user a@a.com"]);
    expect(await getTextContent("#is-staff")).toEqual([]);
  });

  it("should login as staff and show staff account chip", async () => {
    expect(await getFieldErrorText()).toEqual([]);
    await fillForm({email: 'a@staff.com', password: 'b'})
    expect(await getFieldErrorText()).toEqual([]);
    await Promise.all([submitFormEnter(), waitForNavigation()])
    expect(await url()).toBe(URL + "/");
    expect(await getLocalStorageTokens()).toEqual(staffTokens);
    await sleep(1);
    expect(await getTextContent("#is-staff")).toEqual(["Staff Account"]);
  });

  it("should show email validation error on signin", async () => {
    expect(await getFieldErrorText()).toEqual([]);
    await fillForm({email: 'a@a', password: 'b'})
    expect(await getFieldErrorText()).toEqual(["Invalid email"]);
    await clickSubmitButton();
    expect(await url()).toEqual(URL + "/sign-in");
    expect(await getFieldErrorText()).toEqual(["Invalid email"]);
    await fillForm({email: '.com'})
    expect(await getFieldErrorText()).toEqual([]);
  });

  it("should show failed login error", async () => {
    expect(await getSubmitErrorText()).toEqual([]);
    await fillForm({email: 'a@a.com', password: 'b'})
    expect(await getSubmitErrorText()).toEqual([]);
    await clickSubmitButton();
    expect(await url()).toEqual(URL + "/sign-in");
    expect(await getSubmitErrorText()).toEqual(["Login or password invalid."]);
    expect(await getLocalStorageTokens()).toBeNull();
    await fillForm({password: 'x'})
    expect(await getSubmitErrorText()).toEqual(["Login or password invalid."]);
    await clickSubmitButton();
    expect(await url()).toEqual(URL + "/");
    expect(await getLocalStorageTokens()).toEqual(tokens);
  });

  it("should show failed login error for non-verified user", async () => {
    expect(await getSubmitErrorText()).toEqual([]);
    await fillForm({email: 'c@a.com', password: 'b'})
    expect(await getSubmitErrorText()).toEqual([]);
    await clickSubmitButton();
    expect(await url()).toEqual(URL + "/sign-in");
    expect(await getSubmitErrorText()).toEqual(['No active account found with the given credentials']);
    expect(await getLocalStorageTokens()).toBeNull();
  });

});