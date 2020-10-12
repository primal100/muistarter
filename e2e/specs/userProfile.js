import {clearLocalStorage, getSuccessMessageText, sleep, url} from "../pageObjects";
import { loadUserProfile, loadUserProfileNotLoggedIn } from "../pageObjects/userProfile"
import {
    getFormValues,
    getFormIsDisabled,
    clickEnableEditableFieldButton,
    fillForm,
    submitFieldTab,
    submitFormEnter,
    getTextContent,
    clickSwitch,
    inputIsChecked
} from "../pageObjects/forms"


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
        expect(await getFormValues(['first_name', 'last_name', 'email'])).toEqual(['test', 'user', 'testuser@example.com']);
        expect(await inputIsChecked('mailing_list')).toBeTruthy();
        expect(await getFormIsDisabled(['first_name', 'last_name', 'email'])).toEqual([true, true, true]);
        expect(await getTextContent("#username")).toEqual(["test user testuser@example.com"]);
    });

    it("should enable the first name form field, edit and submit values with tab, and disable the form field", async () => {
        await clickEnableEditableFieldButton('first_name');
        expect(await getFormIsDisabled(['first_name', 'last_name', 'email'])).toEqual([false, true, true]);
        await fillForm({first_name: 'Jane'}, true);
        await submitFieldTab();
        expect(await getFormValues(['first_name', 'last_name', 'email'])).toEqual(['Jane', 'user', 'testuser@example.com']);
        expect(await getFormIsDisabled(['first_name', 'last_name', 'email'])).toEqual([true, true, true]);
        expect(await getSuccessMessageText()).toEqual(successMessages);
         expect(await getTextContent("#username")).toEqual(["Jane user testuser@example.com"]);
    });

    it("should enable the last name form field, edit and submit values with enter, and disable the form fields", async () => {
        await clickEnableEditableFieldButton('last_name');
        expect(await getFormIsDisabled(['first_name', 'last_name', 'email'])).toEqual([true, false, true]);
        await fillForm({last_name: 'Doe'}, true);
        await submitFormEnter();
        expect(await getFormIsDisabled(['first_name', 'last_name', 'email'])).toEqual([true, true, true]);
        expect(await getFormValues(['first_name', 'last_name', 'email'])).toEqual(['test', 'Doe', 'testuser@example.com']);
        expect(await getSuccessMessageText()).toEqual(successMessages);
        expect(await getTextContent("#username")).toEqual(["test Doe testuser@example.com"]);
    });

    it("should disable and enable the mailing list switch", async () => {
        await clickSwitch('mailing_list');
        expect(await getFormValues(['first_name', 'last_name', 'email'])).toEqual(['test', 'user', 'testuser@example.com']);
        expect(await inputIsChecked('mailing_list')).toBeFalsy();
        expect(await getSuccessMessageText()).toEqual(successMessages);
        await clickSwitch('mailing_list');
        expect(await getFormValues(['first_name', 'last_name', 'email'])).toEqual(['test', 'user', 'testuser@example.com']);
        expect(await inputIsChecked('mailing_list')).toBeTruthy();
        expect(await getSuccessMessageText()).toEqual(successMessages);
    });

    it("should enable the email form field, edit and submit, disable the form field, and show success message", async () => {
        await clickEnableEditableFieldButton('email');
        expect(await getFormIsDisabled(['first_name', 'last_name', 'email'])).toEqual([true, true, false]);
        await fillForm({email: 'a@c.com'}, true);
        await submitFieldTab();
        expect(await getFormValues(['first_name', 'last_name', 'email'])).toEqual(['test', 'user', 'a@c.com']);
        expect(await getFormIsDisabled(['first_name', 'last_name', 'email'])).toEqual([true, true, true]);
        expect(await getSuccessMessageText()).toEqual(changeEmailSuccessMessages);
        expect(await getTextContent("#username")).toEqual(["test user testuser@example.com"]);
    });

    it("should submit first name, last name and email fields", async () => {
        await clickEnableEditableFieldButton('first_name');
        expect(await getFormIsDisabled(['first_name', 'last_name', 'email'])).toEqual([false, true, true]);
        await fillForm({first_name: 'Jane'}, true);
        await submitFieldTab();
        expect(await getTextContent("#username")).toEqual(["Jane user testuser@example.com"]);
        expect(await getFormValues(['first_name', 'last_name', 'email'])).toEqual(['Jane', 'user', 'testuser@example.com']);
        expect(await getFormIsDisabled(['first_name', 'last_name', 'email'])).toEqual([true, true, true]);
        expect(await getSuccessMessageText()).toEqual(successMessages);
        await clickEnableEditableFieldButton('last_name');
        expect(await getFormIsDisabled(['first_name', 'last_name', 'email'])).toEqual([true, false, true]);
        await fillForm({last_name: 'Doe'}, true);
        await submitFormEnter();
        expect(await getTextContent("#username")).toEqual(["Jane Doe testuser@example.com"]);
        expect(await getFormIsDisabled(['first_name', 'last_name', 'email'])).toEqual([true, true, true]);
        expect(await getFormValues(['first_name', 'last_name', 'email'])).toEqual(['Jane', 'Doe', 'testuser@example.com']);
        expect(await getSuccessMessageText()).toEqual(successMessages);
        await clickEnableEditableFieldButton('email');
        expect(await getFormIsDisabled(['first_name', 'last_name', 'email'])).toEqual([true, true, false]);
        await fillForm({email: 'a@c.com'}, true);
        await submitFieldTab();
        expect(await getFormValues(['first_name', 'last_name', 'email'])).toEqual(['Jane', 'Doe', 'a@c.com']);
        expect(await getFormIsDisabled(['first_name', 'last_name', 'email'])).toEqual([true, true, true]);
        expect(await getSuccessMessageText()).toEqual(successMessages.concat(changeEmailSuccessMessages));
        await sleep(1)
        expect(await getTextContent("#username")).toEqual(["Jane Doe testuser@example.com"]);
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