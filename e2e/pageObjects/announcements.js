export const addAnnouncement = async() => await page.evaluate(() => addAnnouncement());
export const getAnnouncementKey = async () => await page.evaluate(() => JSON.parse(localStorage.getItem('announcementId')));
export const setAnnouncementKey = async () => await page.evaluate(() => localStorage.setItem("announcementId", 1));