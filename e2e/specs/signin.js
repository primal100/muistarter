import { waitForNavigation, clearLocalStorage, getLocalStorageAccessToken, getLocalStorageRefreshToken, url } from "../pageObjects/index"
import { fill_form, submit_form_enter, click_submit_button, getSubmitErrorText, getFieldErrorText } from "../pageObjects/forms";
import { load_signin, load_signup_via_signin } from "../pageObjects/signin";


const access = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1OTA5NTk1NTcsImV4cCI6MTYyMjQ5NTU1NywiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.p2LvatOtvnZ42WBsSP0jb2OXtX_5gkbbzqyRMZMUE8k'
const refresh = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1OTA5NTk1NTcsImV4cCI6MTYyMjQ5NTU1NywiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.3J6JVkEL8Sv0MJlV4bkKtmHZ7WNjz5-F8h_VvOwRHng'


describe("test signin view", () => {
  beforeEach(async () => {
    await load_signin();
  });

  afterEach(async () => {
    await clearLocalStorage();
  });

  it("should show the sign-in page", async () => {
    expect(await url()).toBe(URL + "/sign-in");
  });

  it("should show the sign-up page", async () => {
    await load_signup_via_signin()
    expect(await url()).toBe(URL + "/sign-up");
  });

  it("should login with enter, store tokens and refresh to home", async () => {
    expect(await getLocalStorageAccessToken()).toBe(null);
    expect(await getLocalStorageRefreshToken()).toBe(null);
    expect(await getFieldErrorText()).toEqual([]);
    await fill_form({email: 'a@a.com', password: 'x1y@4f!21a'})
    expect(await getFieldErrorText()).toEqual([]);
    await Promise.all([submit_form_enter(), waitForNavigation()])
    expect(await url()).toBe(URL + "/");
    expect(await getLocalStorageAccessToken()).toBe(access);
    expect(await getLocalStorageRefreshToken()).toBe(refresh);
  });

  it("should login with submit button, store tokens and refresh to home", async () => {
    expect(await getLocalStorageAccessToken()).toBe(null);
    expect(await getLocalStorageRefreshToken()).toBe(null);
    expect(await getFieldErrorText()).toEqual([]);
    await fill_form({email: 'a@a.com', password: 'x1y@4f!21a'})
    expect(await getFieldErrorText()).toEqual([]);
    await Promise.all([click_submit_button(), waitForNavigation()])
    expect(await url()).toBe(URL + "/");
    expect(await getLocalStorageAccessToken()).toBe(access);
    expect(await getLocalStorageRefreshToken()).toBe(refresh);
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
    await fill_form({password: 'x'})
    expect(await getSubmitErrorText()).toEqual(["Login or password invalid."]);
    await Promise.all([click_submit_button(), waitForNavigation()])
    expect(await url()).toEqual(URL + "/");
    expect(await getLocalStorageAccessToken()).toBe(access);
    expect(await getLocalStorageRefreshToken()).toBe(refresh);
  });

});