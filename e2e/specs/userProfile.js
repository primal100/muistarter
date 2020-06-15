import {clearLocalStorage, getSuccessMessageText, url,} from "../pageObjects";
import { loadUserProfile, loadUserProfileNotLoggedIn } from "../pageObjects/userProfile"
import { getFormValues, getFormIsDisabled, click_enable_editable_field_button, fill_form, submit_field_tab, submit_form_enter } from "../pageObjects/forms"


const successMessages = ["Your details have been updated"]
const changeEmailSuccessMessages = ["A verification e-mail has been sent to the newly configured e-mail address. Please click the link in that e-mail to update your e-mail address."]


describe("test user profile view", () => {
    beforeEach(async () => {
        await loadUserProfile();
    });

    afterEach(async () => {
        await clearLocalStorage();
    });

    it("should show the user profile page, correct initial form values and fields disabled", async () => {
        expect(await url()).toBe(URL + "/profile");
        expect(await getFormValues(['first_name', 'last_name', 'email'])).toEqual(['test', 'user', 'a@a.com']);
        expect(await getFormIsDisabled(['first_name', 'last_name', 'email'])).toEqual([true, true, true]);
    });

    it("should enable the first name form field, edit and submit values with tab, and disable the form field", async () => {
        await click_enable_editable_field_button('first_name');
        expect(await getFormIsDisabled(['first_name', 'last_name', 'email'])).toEqual([false, true, true]);
        await fill_form({first_name: 'Jane'}, true);
        await submit_field_tab();
        expect(await getFormValues(['first_name', 'last_name', 'email'])).toEqual(['Jane', 'user', 'a@a.com']);
        expect(await getFormIsDisabled(['first_name', 'last_name', 'email'])).toEqual([true, true, true]);
        expect(await getSuccessMessageText()).toEqual(successMessages);
    });

    it("should enable the last name form field, edit and submit values with enter, simulate first name being modified elsewhere, and disable the form fields", async () => {
        await click_enable_editable_field_button('last_name');
        expect(await getFormIsDisabled(['first_name', 'last_name', 'email'])).toEqual([true, false, true]);
        await fill_form({last_name: 'Doe'}, true);
        await submit_form_enter();
        expect(await getFormIsDisabled(['first_name', 'last_name', 'email'])).toEqual([true, true, true]);
        expect(await getFormValues(['first_name', 'last_name', 'email'])).toEqual(['Jane', 'Doe', 'a@a.com']);
        expect(await getSuccessMessageText()).toEqual(successMessages);
    });

    it("should enable the email form field, edit and submit, disable the form field, and show success message", async () => {
        await click_enable_editable_field_button('email');
        expect(await getFormIsDisabled(['first_name', 'last_name', 'email'])).toEqual([true, true, false]);
        await fill_form({email: 'a@c.com'}, true);
        await submit_field_tab();
        expect(await getFormValues(['first_name', 'last_name', 'email'])).toEqual(['test', 'user', 'a@c.com']);
        expect(await getFormIsDisabled(['first_name', 'last_name', 'email'])).toEqual([true, true, true]);
        expect(await getSuccessMessageText()).toEqual(changeEmailSuccessMessages);
    });
})


describe("test not logged in user profile view", () => {
    beforeEach(async () => {
        await loadUserProfileNotLoggedIn();
    });

    it("should redirect to sign-in page", async () => {
        expect(await url()).toBe(URL + "/sign-in");
    });
});