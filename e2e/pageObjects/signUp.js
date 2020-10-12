import {getMockRawHistory, load} from './index'
import { click} from "./index";

export const loadSignup = async () => {
  await load();
  await click('#sign-up');
  await page.waitForSelector("#sign-up-form", {timeout: 5000});
};


export const getMockHistorySignUp = async() => {
    const mockHistory = await getMockRawHistory();
    const postHistory = mockHistory.post;
    return postHistory.filter(request => request.url === '/api/accounts/register/');
}


export const getSignUpAPIRequestData = async() => {
    const signUps = await getMockHistorySignUp();
    expect(signUps.length).toEqual(1);
    return JSON.parse(signUps[0].data);
}