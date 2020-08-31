import { load } from './index'
import { click} from "./index";

export const loadSignup = async () => {
  await load();
  await click('#sign-up');
};

