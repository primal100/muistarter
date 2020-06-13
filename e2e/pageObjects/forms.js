export const fill_form = async (values, clear=false) => {
    for (const name in values) {
        // noinspection JSUnfilteredForInLoop
        if (values.hasOwnProperty(name)){
            if (clear) {
                let currentValues = await getFormValues([name]);
                let currentValue = currentValues[0];
                let valueLength = currentValue.length;
                await page.click(getInputElementsSelector([name]));
                for (let i=0; i < valueLength; i++) {
                    await page.keyboard.press('Backspace');
                }
            }
            await page.type(`input[name=${name}]`, values[name]);
        }
    }
};


export const getInputElementsSelector = (names) => {
    return  names.map((name) => {
        return `input[name=${name}]`
    }).join();
};


export const getFormValues = async (names) => await page.$$eval(getInputElementsSelector(names), els => els.map((el) => el.value));
export const getFormIsDisabled = async (names) => await page.$$eval(getInputElementsSelector(names), (els) => els.map((el) => el.disabled));



export const submit_form_enter = async () => {
  await page.keyboard.press('Enter');
};


export const click_submit_button = async () => {
  await page.$eval('form button', el => el.click());
};

export const click_enable_editable_field_button = async (name) => {
  await page.$eval(`#enable-${name}`, el => el.click());
};

export const submit_field_tab = async () => {
  await page.keyboard.press('Tab');
};


export const getErrors = async () => { await page.evaluate('.Mui-error') }

export const getFieldErrorText = async () => await page.$$eval('p.Mui-error', els => els.map((el) => el.textContent))

export const getSubmitErrorText = async () => await page.$$eval('.submit-error', els => els.map((el) => el.textContent))