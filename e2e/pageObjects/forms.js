import { click, clickAndWaitNavigation } from "./index";

export const fillForm = async (values, clear=false) => {
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



export const submitFormEnter = async () => {
  await page.keyboard.press('Enter');
};


export const clickSubmitButton = async () => {
    await click('form button');
  //await page.$eval(, el => el.click());
};


export const clickSubmitButtonAndWaitNavigation = async () => {
    await clickAndWaitNavigation('form button');
  //await page.$eval(, el => el.click());
};


export const clickSubmitButtonAndWait = async () => {
    await clickAndWaitNavigation('form button');
  //await page.$eval(, el => el.click());
};

export const clickEnableEditableFieldButton = async (name) => {
  await click(`#enable-${name}`)
  //await page.$eval(, el => el.click());
};

export const submitFieldTab = async () => {
  await page.keyboard.press('Tab');
};

export const getErrors = async () => { await page.evaluate('.Mui-error') }

export const getTextContent = async (selector) => await page.$$eval(selector, els => els.map((el) => el.textContent))
export const getFieldErrorText = async () => await getTextContent('p.Mui-error')
export const getSubmitErrorText = async () => await getTextContent('.submit-error')
