import {load, getTitle, getSuccessMessageText, url} from "../pageObjects/index";


describe("test index", () => {
  it("should be titled 'React App'", async () => {
    await load();
    expect(await url()).toBe(URL + "/");
    expect(await getTitle()).toBe("React App");
    expect(await getSuccessMessageText()).toEqual([]);
  });
});