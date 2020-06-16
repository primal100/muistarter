import {clearLocalStorage, url} from "../pageObjects/index";
import {getLocalStorageTokens, signedIn, tokens} from "../pageObjects/signIn";
import { clickSignOut } from "../pageObjects/signOut"
import { goToUserProfile} from "../pageObjects/userProfile";


describe("test sign out", () => {
  beforeEach(async () => {
    await signedIn();
    expect(await getLocalStorageTokens()).toEqual(tokens);
  });

  afterEach(async () => {
    await clearLocalStorage();
  });

  it("should sign out from home page, remove access tokens and go to home page", async () => {
    console.log('starting test');
    expect(await url()).toBe(URL + "/");
    await clickSignOut();
    expect(await url()).toBe(URL + "/");
    expect(await getLocalStorageTokens()).toBeNull();
  });

  it("should sign out from user profile page, remove access tokens and go to home page", async () => {
    await goToUserProfile();
    expect(await url()).toBe(URL + "/profile");
    await clickSignOut();
    expect(await url()).toBe(URL + "/");
    expect(await getLocalStorageTokens()).toBeNull();
  });
});
