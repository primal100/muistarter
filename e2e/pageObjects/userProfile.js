import { signedIn } from "./signIn";
import { click, load } from "./index";


export const clickUserProfile = async () => {
   await page.waitForSelector('#profile', {
        timeout: 10000
      });
  await click('#profile');
}


export const clickUserProfileIfExists = async () => {
  if (await page.$('#profile') !== null) await click('#profile');
}


export const goToUserProfile = async () => {
  await clickUserProfile();
  await page.waitForSelector('#enable-first_name',{
        timeout: 10000
  })
}

export const loadUserProfile = async () => {
  await signedIn();
  await goToUserProfile();
  await page.waitForSelector('input[name=first_name]',{
        timeout: 10000
  })
};


export const loadUserProfileNotLoggedIn = async () => {
  await load('/profile');
};
