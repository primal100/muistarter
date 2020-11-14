export const addAnnouncement = async() => await page.evaluate(() => addAnnouncement());
export const getAnnouncementKey = async () => await page.evaluate(() => localStorage.getItem('announcement'));
export const setAnnouncementKey = async () => await page.evaluate(() => localStorage.setItem("announcement", "this-is-a-test-announcement"));