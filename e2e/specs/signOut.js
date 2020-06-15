import { url } from "../pageObjects/index";
import {getLocalStorageTokens, signedIn, tokens} from "../pageObjects/signIn";
import { clickSignOutAndWait } from "../pageObjects/signOut"
import { loadUserProfile} from "../pageObjects/userProfile";


describe("test sign out", () => {
  beforeEach(async () => {
    await signedIn();
    expect(await getLocalStorageTokens()).toEqual(tokens);
  });

  it("should sign out from home page, remove access tokens and go to home page'", async () => {
     await signedIn();
    expect(await url()).toBe(URL + "/");
    await clickSignOutAndWait();
    expect(await url()).toBe(URL + "/");
    expect(await getLocalStorageTokens()).toBeNull();
  });

  it("should sign out from user profile page, remove access tokens and go to home page'", async () => {
    await loadUserProfile();
    expect(await url()).toBe(URL + "/profile");
    await clickSignOutAndWait();
    expect(await url()).toBe(URL + "/");
    expect(await getLocalStorageTokens()).toBeNull();
  });
});
