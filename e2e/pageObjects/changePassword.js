import { loadUserProfile } from "./userProfile";
import {click} from "./index";


export const loadChangePasswordUrl = async () => {
  await loadUserProfile();
  await click('#change_password_link')
  await page.waitForSelector('input[name=old_password]',{
        timeout: 1000
  })
  await page.waitForSelector('form button',{
        timeout: 1000
  })
};
