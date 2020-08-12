import { waitForNavigation, url, getSuccessMessageText, getErrorMessageText } from "../pageObjects/index"
import { loadVerifyEmailUrl, goToVerifyEmailUrl } from "../pageObjects/verifyEmail";
import {getTextContent} from "../pageObjects/forms";
import {loadUserProfile} from "../pageObjects/userProfile";
import {getLocalStorageTokens, signedIn, tokens} from "../pageObjects/signIn";


const successMessages = ["Email verified successfully",];
const errorMessages = ['Invalid signature. Please check again the link in the email you received.']


describe("test verify email view", () => {
  it("should verify email, redirect to home and show success message", async () => {
    await Promise.all([loadVerifyEmailUrl("user_id=1&timestamp=1589819019&signature=1235&email=a@c.com"), waitForNavigation()])
    expect(await url()).toBe(URL + "/");
    expect(await getSuccessMessageText()).toEqual(successMessages);
  });

  it("should fail to verify email with wrong signature", async () => {
    await Promise.all([loadVerifyEmailUrl("user_id=1&timestamp=1589819019&signature=1234&email=a@c.com"), waitForNavigation()])
    expect(await url()).toBe(URL + "/");
    expect(await getErrorMessageText()).toEqual(errorMessages);
  });
});

describe("test verify email view signed in", () => {
   beforeEach(async () => {
        await signedIn();
        await page.waitForSelector('#username',{
          timeout: 5000
        })
   });

   it("should sign in, verify email, redirect to home and show success message", async () => {
    expect(await getLocalStorageTokens()).toEqual(tokens);
    expect(await getTextContent("#username")).toEqual(["test user a@a.com"]);
    await Promise.all([goToVerifyEmailUrl("user_id=1&timestamp=1589819019&signature=1235&email=a@c.com"), waitForNavigation()])
    expect(await url()).toBe(URL + "/");
    expect(await getSuccessMessageText()).toEqual(successMessages);
  });

  it("should sign in, fail to verify email with wrong signature", async () => {
    expect(await getLocalStorageTokens()).toEqual(tokens);
    expect(await getTextContent("#username")).toEqual(["test user a@a.com"]);
    await Promise.all([goToVerifyEmailUrl("user_id=1&timestamp=1589819019&signature=1234&email=a@c.com"), waitForNavigation()])
    expect(await url()).toBe(URL + "/");
    expect(await getErrorMessageText()).toEqual(errorMessages);
  });
});