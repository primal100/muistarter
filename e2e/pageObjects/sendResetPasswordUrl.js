import { load } from './index'
import {click} from "./index";

export const loadSendResetPasswordURL = async () => {
  await load()
  await click('#sign-in');
  await click('#send_reset_password_link');
  await page.waitForSelector('#send-reset-password-url-form', {timeout: 5000})
};

