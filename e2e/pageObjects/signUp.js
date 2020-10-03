import { load } from './index'
import { click} from "./index";

export const loadSignup = async () => {
  await load();
  await click('#sign-up');
  await page.waitForSelector("#sign-up-form", {timeout: 5000});
};

