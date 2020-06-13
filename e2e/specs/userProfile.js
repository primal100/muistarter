import { clearLocalStorage, url, } from "../pageObjects";
import { loadUserProfile } from "../pageObjects/userProfile"
import { getFormValues, getFormIsDisabled, click_enable_editable_field_button, fill_form, submit_field_tab, submit_form_enter } from "../pageObjects/forms"


describe("test user profile view", () => {
    beforeEach(async () => {
        await loadUserProfile();
    });

    afterEach(async () => {
        await clearLocalStorage();
    });

    it("should show the user profile page, correct initial form values and fields disabled", async () => {
        expect(await url()).toBe(URL + "/profile");
        expect(await getFormValues(['first_name', 'last_name'])).toEqual(['test', 'user']);
        expect(await getFormIsDisabled(['first_name', 'last_name'])).toEqual([true, true]);
    });

    it("should enable the first name form field, edit and submit values with tab, and disable the form field", async () => {
        await click_enable_editable_field_button('first_name');
        expect(await getFormIsDisabled(['first_name', 'last_name'])).toEqual([false, true]);
        await fill_form({first_name: 'Jane'}, true);
        await submit_field_tab();
        expect(await getFormValues(['first_name', 'last_name'])).toEqual(['Jane', 'user']);
        expect(await getFormIsDisabled(['first_name', 'last_name'])).toEqual([true, true]);
    });

    it("should enable the last name form field, edit and submit values with enter, simulate first name being modified elsewhere, and disable the form fields", async () => {
        await click_enable_editable_field_button('last_name');
        expect(await getFormIsDisabled(['first_name', 'last_name'])).toEqual([true, false]);
        await fill_form({last_name: 'Doe'}, true);
        await submit_form_enter();
        expect(await getFormIsDisabled(['first_name', 'last_name'])).toEqual([true, true]);
        expect(await getFormValues(['first_name', 'last_name'])).toEqual(['Jane', 'Doe']);
    });
})