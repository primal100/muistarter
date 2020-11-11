import { setShortLivedAccessToken, setShortLivedRefreshToken, newTokens } from "../pageObjects/tokenRefresh";
import {clearLocalStorage, url, sleep, load_once } from "../pageObjects";
import {getFormIsDisabled, getFormValues} from "../pageObjects/forms";
import {clickUserProfileIfExists, goToUserProfile} from "../pageObjects/userProfile";
import {getLocalStorageTokens, signedIn} from "../pageObjects/signIn";


describe("test refresh access token ok", () => {
    beforeEach(async () => {
        await signedIn();
        await setShortLivedAccessToken(2);
        await sleep(4);
        await goToUserProfile();
    });

    afterEach(async () => {
        await clearLocalStorage();
    });

    it("should show the user profile page after refreshing the expired access token", async () => {
        expect(await url()).toBe(URL + "/profile");
        expect(await getFormValues(['first_name', 'last_name', 'email'])).toEqual(['test', 'user', 'testuser@example.com']);
        expect(await getFormIsDisabled(['first_name', 'last_name', 'email'])).toEqual([true, true, true]);
        expect(await getLocalStorageTokens()).toMatchObject(newTokens);
    });
})


describe("test refresh token expired", () => {
    beforeEach(async () => {
        await signedIn();
        await setShortLivedRefreshToken(2);
        await sleep(5);
        await clickUserProfileIfExists();
    });

    afterEach(async () => {
        await clearLocalStorage();
    });

    it("should go to sign-in page with tokens cleared", async () => {
        expect(await url()).toBe(URL + "/sign-in");
        expect(await getLocalStorageTokens()).toBeNull();
    });
})