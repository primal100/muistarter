import {load, getTitle, url} from "../pageObjects/index";

describe("React App", () => {
  it("should be titled 'React App'", async () => {
    await load();
    expect(await url()).toBe(URL + "/");
    expect(await getTitle()).toBe("React App");
  });
});