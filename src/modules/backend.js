//import fetchMock from 'fetch-mock';
//fetchMock.config.overwriteRoutes = false;

import { API } from './api'
import MockAdapter from 'axios-mock-adapter'

var mock = new MockAdapter(API);


// const email = 'testuser@example.com'
// const password =  'testpassword1'
const response_key = process.env.REACT_APP_GENERAL_KEY_ERRORS
const non_field_errors_key = process.env.REACT_APP_NON_FIELD_ERRORS_KEY
const email_address = 'a@a.com'
const password =  'a'
const first_name = 'test'
const last_name = 'user'
const epoch_time = 1589819019;
//const login_details = {email: email_address, password: password}
const wrong_login_details = {email: email_address, password: 'b'}
// const existing_user_login_details = {'login': 'second', 'password': 'b'}
const login_response_ok = {'access': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1OTA5NTk1NTcsImV4cCI6MTYyMjQ5NTU1NywiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.p2LvatOtvnZ42WBsSP0jb2OXtX_5gkbbzqyRMZMUE8k',
                           'refresh': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1OTA5NTk1NTcsImV4cCI6MTYyMjQ5NTU1NywiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.3J6JVkEL8Sv0MJlV4bkKtmHZ7WNjz5-F8h_VvOwRHng'}
const logout_response_ok = {[response_key]: 'Logout successful'}
const login_failed_response = {[response_key]: 'Login or password invalid.'}
//const not_logged_in_response = {[response_key]: 'Authentication credentials were not provided.'}
//const no_permission_response = {[response_key]: 'You do not have permission to perform this action.'}
//const not_found_response = {[response_key]: 'Not found.'}
const user_details_response = {id: 1, first_name: first_name, last_name: last_name,
                              email: email_address}
//const password_change_response = {[response_key]: 'Password changed successfully'}
//const wrong_password_change_response = {old_password: ['Old password is not correct']}
//const wrong_password_change_no_match_response = {password_confirm: ["Passwords don't match"]}
//const register_no_match_response = {password_confirm: ["Passwords don't match"], [non_field_errors_key]: []}
const register_too_short_password_response = {password: ['This password is too short. It must contain at least 8 characters.'], [non_field_errors_key]: []}
//const too_short_password_response = {password: ['This password is too short. It must contain at least 8 characters.']}
//const alphanumeric_password_response = {password: ['Password must contain at least one number or special character.']}
//const register_data = {'email': email_address, 'password': password, 'password_confirm': password,
//                      'first_name': first_name, 'last_name': last_name}
const register_data_already_exists = {email: 'c@a.com', password: password, password_confirm: password,
                      first_name: first_name, last_name: last_name}
const register_data_short_password = {email: 'c@a.com', 'password': 'z', password_confirm: 'z',
                      first_name: first_name, last_name: last_name}
const register_user_already_exists = {email: ['user with this email address already exists.']}
const verify_registration_response = {[response_key]: 'User verified successfully'}
const send_reset_password_response = {[response_key]: 'Reset link sent'}
const reset_password_response = {[response_key]: 'Reset password successful'}
// const change_email_response = {[response_key]: 'Register email link email sent'}
// const verify_email_response = {[response_key]: 'Email verified successfully'}
const verify_response_invalid_signature = {[response_key]: 'Invalid signature'}


export default function mockBackend() {
    if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') {
        console.log(`Running in ${process.env.NODE_ENV} mode`)
        mock.onPost(process.env.REACT_APP_SIGN_IN_URL, wrong_login_details).reply(400, login_failed_response);
        mock.onPost(process.env.REACT_APP_SIGN_IN_URL).reply(200, login_response_ok);
        mock.onPost(process.env.REACT_APP_SIGN_UP_URL, register_data_already_exists).reply(400, register_user_already_exists);
        mock.onPost(process.env.REACT_APP_SIGN_UP_URL, register_data_short_password).reply(400, register_too_short_password_response);
        mock.onPost(process.env.REACT_APP_SIGN_OUT_URL, register_data_short_password).reply(200, logout_response_ok);
        mock.onPost(process.env.REACT_APP_SIGN_UP_URL).reply(200, user_details_response);
        mock.onPost(process.env.REACT_APP_SEND_RESET_PASSWORD_URL).reply(200, send_reset_password_response);
        mock.onPost(process.env.REACT_APP_RESET_PASSWORD_URL).reply(200, reset_password_response);
        mock.onPost(process.env.REACT_APP_RESET_PASSWORD_URL, {user_id: 1, password: 'z', password_confirm: 'z', timestamp: epoch_time, signature :1234}).reply(400, verify_response_invalid_signature);
        mock.onPost(process.env.REACT_APP_VERIFY_REGISTRATION_URL).reply(200, verify_registration_response);
        mock.onPost(process.env.REACT_APP_VERIFY_REGISTRATION_URL, {user_id: 1, timestamp: epoch_time, signature :1234}).reply(400, verify_response_invalid_signature);
        mock.onPost(process.env.REACT_APP_USER_PROFILE_URL).reply(200, user_details_response);
    } else {
        // production code
    }
}