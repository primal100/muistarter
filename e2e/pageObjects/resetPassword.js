import { load} from "./index";

export const loadResetPasswordUrl = async (params) => {
  await load("/reset-password?" + params);
}
