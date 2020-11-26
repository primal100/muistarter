const rootSelector = '#root';

const logConsole = false;
export const root = async () => await page.$(rootSelector);



export const load_once = async (url='') => {
  await page.goto(URL + url, {
    waitUntil: "networkidle0",
    timeout: 100000
  });
}

export const load = async (url='') => {
  await load_once(url);
  await page.evaluate(() => {
    const localStorageMock = (function() {
        let store = {};

        return {
            isMock: true,
            getItem: function(key) {
                return store[key] || null;
            },
            setItem: function(key, value) {
                store[key] = value.toString();
            },
            removeItem: function(key) {
                delete store[key];
            },
            clear: function() {
                store = {};
            }
        };

    })();
    Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true
    })
})
};

export const waitForNavigation = async () => {
  await page.waitForNavigation({
    waitUntil: "networkidle0",
    timeout: 100000
  });
};

export const click = async (selector) => {
  await page.click(selector, {
    waitUntil: "networkidle0",
    timeout: 100000
  });
}


export const clickAndWaitNavigation = async (selector) => {
  await Promise.all([waitForNavigation(), click(selector)])
}


export const getTitle = async () => await page.title();

export const clearLocalStorage = async () => await page.evaluate(() => localStorage.clear())

export const sleep = async (seconds) => await page.waitFor(seconds * 1000);

export const url = async () => await page.url();

export const getSuccessMessageText = async () => await page.$$eval('.success-message', els => els.map((el) => el.textContent))
export const getInfoMessageText = async () => await page.$$eval('.info-message', els => els.map((el) => el.textContent))
export const getErrorMessageText = async () => await page.$$eval('.error-message', els => els.map((el) => el.textContent))

export const getMockHistory = async() => await page.evaluate(() => getMockHistory());
export const getMockRawHistory = async() => await page.evaluate(() => getMockRawHistory())
export const getMockHistoryVisits = async() => {
    const mockHistory = await getMockHistory();
    const postHistory = mockHistory.post;
    return postHistory.filter(request => request.url === '/api/visits/');
}


export const clickMobileDrawerIfExists = async() => {
    if (await page.$('#toggle-mobile-drawer')){
        await click('#toggle-mobile-drawer');
    }
}


if (logConsole) {
    page.on('console', msg => {
        for (let i = 0; i < msg.args().length; ++i)
            console.log(`${i}: ${msg.args()[i]}`);
    });
}


