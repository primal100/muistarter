export const fill_form = async (values) => {
    for (const property in values) {
        // noinspection JSUnfilteredForInLoop
        await page.type(`input[name=${property}]`, values[property]);
    }
};

export const submit_form_enter = async () => {
  await page.keyboard.press('Enter');
};


export const click_submit_button = async () => {
  await page.$eval('form button', el => el.click());
};

export const getErrors = async () => { await page.evaluate('.Mui-error') }

export const getFieldErrorText = async () => await page.$$eval('p.Mui-error', els => els.map((el) => el.textContent))

export const getSubmitErrorText = async () => await page.$$eval('.submit-error', els => els.map((el) => el.textContent))