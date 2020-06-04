const rootSelector = '#root';

export const root = async () => await page.$(rootSelector);

export const load = async () => {
  await page.goto(URL, {
    waitUntil: "networkidle0",
    timeout: 60000
  });
};

export const getTitle = async () => await page.title();

export const clearLocalStorage = async () => await page.evaluate(() => localStorage.clear())
export const getLocalStorageAccessToken = async () => await page.evaluate(() => localStorage.getItem('access'))
export const getLocalStorageRefreshToken = async () => await page.evaluate(() => localStorage.getItem('refresh'))

export const sleep = async (seconds) => await page.waitFor(seconds * 1000);

export const url = async () => await page.url();