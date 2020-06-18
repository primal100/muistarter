import { load } from "./index";


export const loadVerifyEmailUrl = async (params) => {
  await load("/verify-email?" + params);
}
