import {clickAndWaitNavigation, load, url} from "../pageObjects";
import {getTextContent} from "../pageObjects/forms";

describe("test non-existing url gives 404", () => {
  beforeEach(async () => {
    await load('/x');
  });

  it("should show 404", async () => {
      expect(await url()).toBe(URL + "/x");
      expect(await getTextContent("#error-404")).toEqual(["That page does not existSorry about that. Click here to return home."])
  });

  it("should click home and go home", async () => {
      await clickAndWaitNavigation('#home-link')
      expect(await url()).toBe(URL + "/");
  });
});