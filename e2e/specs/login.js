import { load, clearLocalStorage, getLocalStorageAccessToken, getLocalStorageRefreshToken, url } from "../pageObjects/index"
import { fill_form, submit_form_enter, click_submit_button, getErrors, getFieldErrorText } from "../pageObjects/forms";
import { load_login, } from "../pageObjects/login";


const access = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1OTA5NTk1NTcsImV4cCI6MTYyMjQ5NTU1NywiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.p2LvatOtvnZ42WBsSP0jb2OXtX_5gkbbzqyRMZMUE8k'
const refresh = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1OTA5NTk1NTcsImV4cCI6MTYyMjQ5NTU1NywiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.3J6JVkEL8Sv0MJlV4bkKtmHZ7WNjz5-F8h_VvOwRHng'


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


describe("test login view", () => {
  beforeEach(async () => {
    await load_login();
    await clearLocalStorage();
  });

  it("should show the login page", async () => {
    expect(await url()).toBe(URL + "/sign-in");
  });

  it("should login with enter, store tokens and refresh to home", async () => {
    expect(await getLocalStorageAccessToken()).toBe(null);
    expect(await getLocalStorageRefreshToken()).toBe(null);
    //expect(await getErrors()).toBe([]);
    await fill_form({email: 'a@a.com', password: 'x1y@4f!21a'})
    //expect(await getErrors()).toBe([]);
    await submit_form_enter()
    await load()
    expect(await url()).toBe(URL + "/");
    expect(await getLocalStorageAccessToken()).toBe(access);
    expect(await getLocalStorageRefreshToken()).toBe(refresh);
  });

  it("should login with submit button, store tokens and refresh to home", async () => {
    expect(await getLocalStorageAccessToken()).toBe(null);
    expect(await getLocalStorageRefreshToken()).toBe(null);
    //expect(await getErrors()).toBe([]);
    await fill_form({email: 'a@a.com', password: 'x1y@4f!21a'})
    //expect(await getErrors()).toBe([]);
    await click_submit_button()
    await load()
    expect(await url()).toBe(URL + "/");
    expect(await getLocalStorageAccessToken()).toBe(access);
    expect(await getLocalStorageRefreshToken()).toBe(refresh);
  });

  it("should show email validation error", async () => {
    expect(await getFieldErrorText()).toEqual([]);
    await fill_form({email: 'a@a', password: 'x1y@4f!21a'})
    expect(await getFieldErrorText()).toEqual(["Invalid email"]);
    await submit_form_enter();
    expect(await url()).toEqual(URL + "/sign-in");
    expect(await getFieldErrorText()).toEqual(["Invalid email"]);
    await fill_form({email: '.com'})
    expect(await getFieldErrorText()).toEqual([]);
  });


});