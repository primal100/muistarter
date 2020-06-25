import { API, APINoHeader } from './api'
import MockAdapter from 'axios-mock-adapter'

export const mock = new MockAdapter(API);
export const mockRaw = new MockAdapter(APINoHeader);


// const email = 'testuser@example.com'
// const password =  'testpassword1'
const response_key = process.env.REACT_APP_GENERAL_ERRORS_KEY
const non_field_errors_key = process.env.REACT_APP_NON_FIELD_ERRORS_KEY
const email_address = 'a@a.com'
const password = 'x1y@4f!21a'
const first_name = 'test'
const last_name = 'user'
const epoch_time = '1589819019';
const non_existing_email_details = {login: 'b@a.com'}
const wrong_login_details = {email: email_address, password: 'b'}
const user_inactive_details = {email: 'c@a.com', password: 'b'}
const accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1OTA5NTk1NTcsImV4cCI6MTYyMjQ5NTU1NywiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.p2LvatOtvnZ42WBsSP0jb2OXtX_5gkbbzqyRMZMUE8k';
const refreshToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1OTA5NTk1NTcsImV4cCI6MTYyMjQ5NTU1NywiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.3J6JVkEL8Sv0MJlV4bkKtmHZ7WNjz5-F8h_VvOwRHng';
const login_response_ok = {'access': accessToken, 'refresh': refreshToken}
const logout_response_ok = {[response_key]: 'Logout successful'}
const login_failed_response = {[response_key]: 'Login or password invalid.'}
const user_inactive_response = {[response_key]: 'No active account found with the given credentials'}
const header = 'Authorization';
//const headerPrefix = 'Bearer ';
//const authorization_header = `${headerPrefix}${accessToken}`;
const user_details_response = {id: 1, first_name: first_name, last_name: last_name,
                              email: email_address}
const new_first_name = 'Jane'
const new_last_name = 'Doe'
const change_first_name_data = {first_name: new_first_name}
const change_last_name_data = {last_name: new_last_name}
const user_details_first_name_changed_response = {id: 1, first_name: new_first_name, last_name: last_name,
                              email: email_address}
const user_details_both_names_changed_response = {id: 1, first_name: new_first_name, last_name: new_last_name,
                              email: email_address}
//const password_change_response = {[response_key]: 'Password changed successfully'}
//const wrong_password_change_response = {old_password: ['Old password is not correct']}
//const wrong_password_change_no_match_response = {password_confirm: ["Passwords don't match"]}
//const register_no_match_response = {password_confirm: ["Passwords don't match"], [non_field_errors_key]: []}
const register_data_short_password = {email: email_address, password: 'x', password_confirm: 'x',
                      first_name: first_name, last_name: last_name}
const register_too_short_password_response = {password: ['This password is too short. It must contain at least 8 characters.'], [non_field_errors_key]: []}
//const too_short_password_response = {password: ['This password is too short. It must contain at least 8 characters.']}
//const alphanumeric_password_response = {password: ['Password must contain at least one number or special character.']}
//const register_data = {'email': email_address, 'password': password, 'password_confirm': password,
//                      'first_name': first_name, 'last_name': last_name}
const register_data_already_exists = {email: 'c@a.com', password: password, password_confirm: password,
                      first_name: first_name, last_name: last_name}
const register_user_already_exists = {email: ['user with this email address already exists.']}
const verify_registration_response = {[response_key]: "Your e-mail address has been verified. Please sign in."}
const invalid_signature = "1234";
const verify_invalid_signature = {user_id: "1", timestamp: epoch_time, signature: invalid_signature}
const verify_email_invalid_signature = {user_id: "1", timestamp: epoch_time, signature: invalid_signature, email: 'a@c.com'}
const send_reset_password_response = {[response_key]: "A link to reset your password has been sent to your e-mail address."}
const send_reset_password_no_user_response = {[response_key]: 'User not found'}
const reset_password_response = {[response_key]: "Reset password successful. Please sign in with the new password."}
const reset_password_too_short = {user_id: '1', password: 'x', password_confirm: 'x', timestamp: epoch_time, signature: "1235"}
const reset_password_invalid_signature = {user_id: '1', password: password, password_confirm: password, timestamp: epoch_time, signature: invalid_signature}
const change_email_response = {[response_key]: "A verification e-mail has been sent to the newly configured e-mail address. Please click the link in that e-mail to update your e-mail address."}
const verify_email_response = {[response_key]: "Email verified successfully"}
const verify_response_invalid_signature = {[response_key]: 'Invalid signature. Please check again the link in the email you received.'}
const change_password_response = {[response_key]: 'Password changed successfully'}
const change_password_request_password_too_short = {old_password: password, password: 'z', password_confirm: 'z'}
const change_password_request_wrong_old_password = {old_password: 'a', password: 'z00g5r32!', password_confirm: 'z00g5r32!'}
const change_password_response_wrong_old_password = {old_password: ['Old password is not correct']}


function checkHeaders(config, ok_reply){
    console.log('Received request', config);
    if (config.headers[header] && config.headers[header].length > 0){
        return ok_reply
    }
    return [401, {[response_key]: 'Authentication credentials were not provided.'}]
}


export default function mockBackend() {
    if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') {
        console.log(`Running in ${process.env.NODE_ENV} mode`)
        mock.onPost(process.env.REACT_APP_SIGN_IN_URL, wrong_login_details).reply(401, login_failed_response);
        mock.onPost(process.env.REACT_APP_SIGN_IN_URL, user_inactive_details).reply(401, user_inactive_response);
        mock.onPost(process.env.REACT_APP_SIGN_IN_URL).reply(200, login_response_ok);
        mock.onPost(process.env.REACT_APP_SIGN_UP_URL, register_data_already_exists).reply(400, register_user_already_exists);
        mock.onPost(process.env.REACT_APP_SIGN_UP_URL, register_data_short_password).reply(400, register_too_short_password_response);
        mock.onPost(process.env.REACT_APP_SIGN_UP_URL).reply(201, user_details_response);
        mock.onPost(process.env.REACT_APP_SEND_RESET_PASSWORD_URL, non_existing_email_details).reply(404, send_reset_password_no_user_response);
        mock.onPost(process.env.REACT_APP_SEND_RESET_PASSWORD_URL).reply(200, send_reset_password_response);
        mock.onPost(process.env.REACT_APP_RESET_PASSWORD_URL, reset_password_too_short).reply(400, register_too_short_password_response);
        mock.onPost(process.env.REACT_APP_RESET_PASSWORD_URL, reset_password_invalid_signature).reply(400, verify_response_invalid_signature);
        mock.onPost(process.env.REACT_APP_RESET_PASSWORD_URL).reply(200, reset_password_response);
        mock.onPost(process.env.REACT_APP_VERIFY_REGISTRATION_URL, verify_invalid_signature).reply(400, verify_response_invalid_signature);
        mock.onPost(process.env.REACT_APP_VERIFY_REGISTRATION_URL).reply(200, verify_registration_response);
        mockRaw.onPost(process.env.REACT_APP_REFRESH_TOKEN_URL).reply(200, login_response_ok);
        mock.onPost(process.env.REACT_APP_SIGN_OUT_URL).reply(200, logout_response_ok);
        mock.onGet(process.env.REACT_APP_USER_PROFILE_URL).reply((config) => checkHeaders(config, [200, user_details_response]));
        mock.onPatch(process.env.REACT_APP_USER_PROFILE_URL, change_first_name_data).reply((config) => checkHeaders(config, [200, user_details_first_name_changed_response]));
        mock.onPatch(process.env.REACT_APP_USER_PROFILE_URL, change_last_name_data).reply((config) => checkHeaders(config, [200, user_details_both_names_changed_response]));
        mock.onPost(process.env.REACT_APP_CHANGE_EMAIL_URL).reply((config) => checkHeaders(config, [200, change_email_response]));
        mock.onPost(process.env.REACT_APP_VERIFY_EMAIL_URL, verify_email_invalid_signature).reply(400, verify_response_invalid_signature);
        mock.onPost(process.env.REACT_APP_VERIFY_EMAIL_URL).reply(200, verify_email_response);
        mock.onPost(process.env.REACT_APP_CHANGE_PASSWORD_URL, change_password_request_wrong_old_password).reply((config) => checkHeaders(config, [400, change_password_response_wrong_old_password]));
        mock.onPost(process.env.REACT_APP_CHANGE_PASSWORD_URL, change_password_request_password_too_short).reply((config) => checkHeaders(config, [400, register_too_short_password_response]));
        mock.onPost(process.env.REACT_APP_CHANGE_PASSWORD_URL).reply((config) => checkHeaders(config, [200, change_password_response]));
        mock.onAny().reply((config) => {
            console.log("Mock request did not match", config);
            return [404, {}]
        })
    } else {
        // production code
    }
}