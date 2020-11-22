import { clickAndWaitNavigation, url} from "../pageObjects";
import { load } from "../pageObjects";
import { loadSignIn } from "../pageObjects/signIn";

describe("test home", () => {
  beforeEach(async () => {
    await loadSignIn();
    expect(await url()).toBe(URL + "/sign-in");
  });

  it("should click home icon and go home", async () => {
      await clickAndWaitNavigation('#home')
      expect(await url()).toBe(URL + "/");
  });
});
