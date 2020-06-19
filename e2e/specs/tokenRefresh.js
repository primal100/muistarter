import { setShortLivedAccessToken, setShortLivedRefreshToken} from "../pageObjects/tokenRefresh";
import {clearLocalStorage, url, sleep, load_once } from "../pageObjects";
import {getFormIsDisabled, getFormValues} from "../pageObjects/forms";
import { goToUserProfile} from "../pageObjects/userProfile";
import { getLocalStorageTokens } from "../pageObjects/signIn";


describe("test refresh access token ok", () => {
    beforeEach(async () => {
        await setShortLivedAccessToken(2);
        await load_once();
        await sleep(4);
        await goToUserProfile();
    });

    afterEach(async () => {
        await clearLocalStorage();
    });

    it("should show the user profile page after refreshing the expired access token", async () => {
        expect(await url()).toBe(URL + "/profile");
        expect(await getFormValues(['first_name', 'last_name', 'email'])).toEqual(['test', 'user', 'a@a.com']);
        expect(await getFormIsDisabled(['first_name', 'last_name', 'email'])).toEqual([true, true, true]);
    });
})


describe("test refresh token expired", () => {
    beforeEach(async () => {
        await setShortLivedRefreshToken(2);
        await sleep(4);
        await load_once("/profile/");
    });

    afterEach(async () => {
        await clearLocalStorage();
    });

    it("should go to sign-in page with tokens cleared", async () => {
        expect(await url()).toBe(URL + "/sign-in");
        expect(await getLocalStorageTokens()).toBeNull();
    });
})