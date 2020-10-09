import {load, getTitle, getSuccessMessageText, url, getMockHistoryVisits} from "../pageObjects/index";

describe("test index", () => {
  it("should be titled 'React App'", async () => {
    await load();
    expect(await url()).toBe(URL + "/");
    expect(await getTitle()).toBe("React App");
    expect(await getSuccessMessageText()).toEqual([]);
    const visits = await getMockHistoryVisits();
    expect(visits.length).toEqual(1);
    expect(JSON.parse(visits[0].data)).toEqual({
      url: 'http://localhost:3000/',
      referrer: "",
      cookies_accepted: null,
      analytics_enabled: false
    })
  });
});