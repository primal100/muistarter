import { waitForNavigation, clearLocalStorage, sleep, url } from "../pageObjects/index"
import { fillForm, submitFormEnter, clickSubmitButton, getSubmitErrorText, getFieldErrorText, getTextContent } from "../pageObjects/forms";
import { loadSignIn, loadSignUpViaSignIn, getLocalStorageTokens, tokens, staffTokens } from "../pageObjects/signIn";
import * as jwt from 'jsonwebtoken'


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

  it("should decode jwt access token", async () => {
    expect(jwt.decode(tokens.accessToken)).toMatchObject({
       "email": "testuser@example.com",
       "exp": 1915452963,
       "first_name": "test",
       "is_staff": false,
       "is_superuser": false,
       "jti": "ba41ebddc00d488a9455c878d6b562b6",
       "last_name": "user",
       "token_type": "access",
       "user_id": 1,
    });
  });

  it("should decode jwt refresh token", async () => {
    expect(jwt.decode(tokens.refreshToken)).toMatchObject({
       "email": "testuser@example.com",
       "exp": 1946988963,
       "first_name": "test",
       "is_staff": false,
       "is_superuser": false,
       "jti": "884feaaad7ac4c9286d2199e09c62831",
       "last_name": "user",
       "token_type": "refresh",
       "user_id": 1,
    });
  });

  it("should decode staff jwt access token", async () => {
    expect(jwt.decode(staffTokens.accessToken)).toMatchObject({
       "email": "staff@admin.com",
       "exp": 1915453123,
       "first_name": "Admin",
       "is_staff": true,
       "is_superuser": false,
       "jti": "ec7c11d0a49f460aaed4886a5aa3d563",
       "last_name": "Staff",
       "token_type": "access",
       "user_id": 2,
    });
  });

  it("should decode staff jwt refresh token", async () => {
    expect(jwt.decode(staffTokens.refreshToken)).toMatchObject({
       "email": "staff@admin.com",
       "exp": 1946989123,
       "first_name": "Admin",
       "is_staff": true,
       "is_superuser": false,
       "jti": "d458f873416445c0b8af452d548376c7",
       "last_name": "Staff",
       "token_type": "refresh",
       "user_id": 2,
    });
  });

  it("should login with enter, store tokens and refresh to home", async () => {
    expect(await getFieldErrorText()).toEqual([]);
    await fillForm({email: 'testuser@example.com', password: 'x1y@4f!21a'})
    expect(await getFieldErrorText()).toEqual([]);
    await Promise.all([submitFormEnter(), waitForNavigation()])
    expect(await url()).toBe(URL + "/");
    expect(await getLocalStorageTokens()).toEqual(tokens);
    await sleep(1);
    expect(await getTextContent("#username")).toEqual(["test user testuser@example.com"]);
    expect(await getTextContent("#is-staff")).toEqual([]);
  });

  it("should login with submit button, store tokens and refresh to home", async () => {
    expect(await getFieldErrorText()).toEqual([]);
    await fillForm({email: 'testuser@example.com', password: 'x1y@4f!21a'})
    expect(await getFieldErrorText()).toEqual([]);
    await clickSubmitButton();
    expect(await url()).toBe(URL + "/");
    expect(await getLocalStorageTokens()).toEqual(tokens)
    await sleep(1);
    expect(await getTextContent("#username")).toEqual(["test user testuser@example.com"]);
    expect(await getTextContent("#is-staff")).toEqual([]);
  });

  it("should login as staff and show staff account chip", async () => {
    expect(await getFieldErrorText()).toEqual([]);
    await fillForm({email: 'staff@admin.com', password: 'b'})
    expect(await getFieldErrorText()).toEqual([]);
    await Promise.all([submitFormEnter(), waitForNavigation()])
    expect(await url()).toBe(URL + "/");
    expect(await getLocalStorageTokens()).toEqual(staffTokens);
    await sleep(1);
    expect(await getTextContent("#is-staff")).toEqual(["Staff Account"]);
  });

  it("should show email validation error on signin", async () => {
    expect(await getFieldErrorText()).toEqual([]);
    await fillForm({email: 'testuser@example', password: 'b'})
    expect(await getFieldErrorText()).toEqual(["Invalid email"]);
    await clickSubmitButton();
    expect(await url()).toEqual(URL + "/sign-in");
    expect(await getFieldErrorText()).toEqual(["Invalid email"]);
    await fillForm({email: '.com'})
    expect(await getFieldErrorText()).toEqual([]);
  });

  it("should show failed login error", async () => {
    expect(await getSubmitErrorText()).toEqual([]);
    await fillForm({email: 'testuser@example.com', password: 'b'})
    expect(await getSubmitErrorText()).toEqual([]);
    await clickSubmitButton();
    expect(await url()).toEqual(URL + "/sign-in");
    expect(await getSubmitErrorText()).toEqual(['No active account found with the given credentials']);
    expect(await getLocalStorageTokens()).toBeNull();
    await fillForm({password: 'x'})
    expect(await getSubmitErrorText()).toEqual(['No active account found with the given credentials']);
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