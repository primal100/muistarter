import { load } from "./index";

export const loadVerifyRegistrationUrl = async (params) => {
  await load("/sign-up-verify-email?" + params);
}
