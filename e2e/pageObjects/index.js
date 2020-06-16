const rootSelector = '#root';

export const root = async () => await page.$(rootSelector);

export const load = async (url='') => {
  await page.goto(URL, {
    waitUntil: "networkidle0",
    timeout: 60000
  });
  await clearLocalStorage();
  await page.goto(URL + url, {
    waitUntil: "networkidle0",
    timeout: 60000
  });
};

export const waitForNavigation = async () => {
  await page.waitForNavigation({
    waitUntil: "networkidle0",
    timeout: 10000
  });
};

export const click = async (selector) => {
  await page.click(selector, {
    waitUntil: "networkidle0",
    timeout: 10000
  });
}


export const clickAndWaitNavigation = async (selector) => {
  await Promise.all([click(selector), waitForNavigation()])
}


export const getTitle = async () => await page.title();

export const clearLocalStorage = async () => await page.evaluate(() => localStorage.clear())

export const sleep = async (seconds) => await page.waitFor(seconds * 1000);

export const url = async () => await page.url();

export const getSuccessMessageText = async () => await page.$$eval('.success-message', els => els.map((el) => el.textContent))
export const getErrorMessageText = async () => await page.$$eval('.error-message', els => els.map((el) => el.textContent))
