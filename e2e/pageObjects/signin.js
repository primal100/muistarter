import {load, waitForNavigation} from './index'
import {fill_form, click_submit_button} from "./forms";
import { isLoggedIn } from "axios-jwt";
import {logout} from "../../src/modules/api";


export const goToSignin = async () => {
  await page.click('#sign-in', {
    waitUntil: "networkidle0",
    timeout: 10000
  });
}


export const load_signin = async () => {
  await load();
  await goToSignin();
};

export const load_signup_via_signin = async () => {
  await page.click('#sign-up2', {
    waitUntil: "networkidle0",
    timeout: 10000
  });
};


export const signedIn = async () => {
  await load()
  if (await page.$('#sign-in') !== null) {
    await goToSignin();
    await fill_form({email: 'a@a.com', password: 'x1y@4f!21a'})
    await Promise.all([click_submit_button(), waitForNavigation()])
  }
};



