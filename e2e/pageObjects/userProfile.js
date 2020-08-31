import { signedIn } from "./signIn";
import { click, load } from "./index";


export const clickUserProfile = async () => {
   await page.waitForSelector('#profile', {
        timeout: 5000
      });
  await click('#profile');
}

export const goToUserProfile = async () => {
  await clickUserProfile();
  await page.waitForSelector('#enable-first_name',{
        timeout: 5000
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
