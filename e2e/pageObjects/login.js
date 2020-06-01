import { root } from './index';

export const load_login = async () => {
  await page.goto(URL, {
    waitUntil: "networkidle0",
    timeout: 60000
  });
  await page.click('#sign-in', {
    waitUntil: "networkidle0",
    timeout: 60000
  });
};

export const fill_form = async () => {
  await page.type('input[name=email]', 'a.b@example.com');
  await page.type('input[name=password]', 'lxasrt1@7!');
};

export const submit_form_enter = async () => {
  await page.keyboard.press('Enter');
};


export const submit_form_button = async () => {
  await page.keyboard.press('Enter');
};


export const url = async () => await page.url();