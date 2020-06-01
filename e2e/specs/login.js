import { load_login, url } from "../pageObjects/login";

describe("React App", () => {
  beforeEach(async () => {
    await load_login();
  });

  it("should show the login page", async () => {
    expect(await url()).toBe(URL + "/sign-in");
  });

  //it("should show the correct link", async () => {
  //  expect(await getLinkText()).toBe("Learn React");
  //});
});