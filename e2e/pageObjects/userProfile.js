import { signedIn } from "./signIn";
import { click, load } from "./index";


export const goToUserProfile = async () => {
  await page.waitForSelector('#profile', {
        timeout: 1000
      });
  await click('#profile');
  await page.waitForSelector('#enable-first_name',{
        timeout: 1000
  })
}

export const loadUserProfile = async () => {
  await signedIn();
  await goToUserProfile();
  await page.waitForSelector('input[name=first_name]',{
        timeout: 1000
  })
};


export const loadUserProfileNotLoggedIn = async () => {
  await load('/profile');
};
