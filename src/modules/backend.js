import { API, APINoAuthentication } from './api'
import MockAdapter from 'axios-mock-adapter'

let mock;
let mockRaw;

if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') {
    console.log(`Running in ${process.env.NODE_ENV} mode`)
    mock = new MockAdapter(API);
    mockRaw = new MockAdapter(APINoAuthentication);
    mock.onNoMatch = "passthrough";
    mockRaw.onNoMatch = "passthrough";
}else {
    console.log(`Running in ${process.env.NODE_ENV} mode`)
    mock = null
    mockRaw = null;
}

const responseKey = process.env.REACT_APP_GENERAL_RESPONSE_KEY
const nonFieldErrorsKey = process.env.REACT_APP_NON_FIELD_ERRORS_KEY
const email_address = 'a@a.com'
const staffEmailAddress = 'a@staff.com'
const password = 'x1y@4f!21a'
const first_name = 'test'
const last_name = 'user'
const epoch_time = '1589819019';
const non_existing_email_details = {login: 'b@a.com'}
const staffLoginDetails = {email: staffEmailAddress, password: 'b'}
const wrong_login_details = {email: email_address, password: 'b'}
const user_inactive_details = {email: 'c@a.com', password: 'b'}
const accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxOTk1MzQxNzQ3LCJqdGkiOiI5NGEyZTBiZWRkZjI0NjZiOTdiOGI3YzEwMjk0NTU1ZCIsInVzZXJfaWQiOjF9.l29e1XOpGTtE7aLIG0uLFnUBOu7sEXR6VGhUOwG7qE0';
const refreshToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTk5NjgzMDE0NywianRpIjoiMDIzYTJiZjE3YTIyNDVjZWJiZjFiNjNhN2E2MmNmZGUiLCJ1c2VyX2lkIjoxfQ.Y-TFsZfIT28FtCLmzLhtE0eZrduZ6ImEFu1Dd9k0Dfg';
const login_response_ok = {'access': accessToken, refresh: refreshToken}
const accessTokenStaff = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxOTk1MzQxNzQ3LCJqdGkiOiI5NGEyZTBiZWRkZjI0NjZiOTdiOGI3YzEwMjk0NTU1ZCIsInVzZXJfaWQiOjJ9.Hqr8HHXNYgShkWNiQ6dkbtGyl7o-RPjYszWxxz3-tQs';
const refreshTokenStaff = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTk5NjgzMDE0NywianRpIjoiMDIzYTJiZjE3YTIyNDVjZWJiZjFiNjNhN2E2MmNmZGUiLCJ1c2VyX2lkIjoyfQ.9kwlRLSYN2qVf5BWZWJFQYiSanE_DDc4RxKvf8x6iac';
const staffLoginResponse = {access: accessTokenStaff, refresh: refreshTokenStaff}
const logout_response_ok = {[responseKey]: 'Logout successful'}
const loginFailedResponse = {[responseKey]: 'No active account found with the given credentials'}
const header = 'Authorization';
const userDetailsResponse = {id: 1, first_name: first_name, last_name: last_name,
                              email: email_address, is_staff: false}
const userDetailsStaffResponse = {id: 2, first_name: "Staff", last_name: "Admin",
                              email: staffEmailAddress, is_staff: true}
const new_first_name = 'Jane'
const new_last_name = 'Doe'
const change_first_name_data = {first_name: new_first_name}
const change_last_name_data = {last_name: new_last_name}
const user_details_first_name_changed_response = {id: 1, first_name: new_first_name, last_name: last_name,
                              email: email_address, is_staff: false}
const user_details_both_names_changed_response = {id: 1, first_name: new_first_name, last_name: new_last_name,
                              email: email_address, is_staff: false}
const register_data_short_password = {email: email_address, password: 'x', password_confirm: 'x',
                      first_name: first_name, last_name: last_name}
const register_too_short_password_response = {password: ['This password is too short. It must contain at least 8 characters.'], [nonFieldErrorsKey]: []}
const register_data_already_exists = {email: 'c@a.com', password: password, password_confirm: password,
                      first_name: first_name, last_name: last_name}
const register_user_already_exists = {email: ['user with this email address already exists.']}
const verify_registration_response = {[responseKey]: "Your e-mail address has been verified. Please sign in."}
const invalid_signature = "1234";
const verify_invalid_signature = {user_id: "1", timestamp: epoch_time, signature: invalid_signature}
const verify_email_invalid_signature = {user_id: "1", timestamp: epoch_time, signature: invalid_signature, email: 'a@c.com'}
const send_reset_password_response = {[responseKey]: "A link to reset your password has been sent to your e-mail address."}
const send_reset_password_no_user_response = {[responseKey]: 'User not found'}
const reset_password_response = {[responseKey]: "Reset password successful. Please sign in with the new password."}
const reset_password_too_short = {user_id: '1', password: 'x', password_confirm: 'x', timestamp: epoch_time, signature: "1235"}
const reset_password_invalid_signature = {user_id: '1', password: password, password_confirm: password, timestamp: epoch_time, signature: invalid_signature}
const change_email_response = {[responseKey]: "A verification e-mail has been sent to the newly configured e-mail address. Please click the link in that e-mail to update your e-mail address."}
const verify_email_response = {[responseKey]: "Email verified successfully"}
const verify_response_invalid_signature = {[responseKey]: 'Invalid signature. Please check again the link in the email you received.'}
const change_password_response = {[responseKey]: 'Password changed successfully'}
const change_password_request_password_too_short = {old_password: password, password: 'z', password_confirm: 'z'}
const change_password_request_wrong_old_password = {old_password: 'a', password: 'z00g5r32!', password_confirm: 'z00g5r32!'}
const change_password_response_wrong_old_password = {old_password: ['Old password is not correct']}


function checkHeaders(config, normalReply, staffReply){
    console.log('Received request', config);
    if (config.headers[header] && config.headers[header] === `Bearer ${accessToken}`){
        return normalReply;
    }else if (config.headers[header] && config.headers[header] === `Bearer ${accessTokenStaff}`){
        return staffReply;
    }
    return [401, {[responseKey]: 'Authentication credentials were not provided.'}]
}


export default function mockBackend(errorOnNoMatch) {
    if (mock) {
        mock.onPost(process.env.REACT_APP_SIGN_IN_URL, wrong_login_details).reply(401, loginFailedResponse);
        mock.onPost(process.env.REACT_APP_SIGN_IN_URL, user_inactive_details).reply(401, loginFailedResponse);
        mock.onPost(process.env.REACT_APP_SIGN_IN_URL, staffLoginDetails).reply(200, staffLoginResponse);
        mock.onPost(process.env.REACT_APP_SIGN_IN_URL).reply(200, login_response_ok);
        mock.onPost(process.env.REACT_APP_SIGN_UP_URL, register_data_already_exists).reply(400, register_user_already_exists);
        mock.onPost(process.env.REACT_APP_SIGN_UP_URL, register_data_short_password).reply(400, register_too_short_password_response);
        mock.onPost(process.env.REACT_APP_SIGN_UP_URL).reply(201, userDetailsResponse);
        mock.onPost(process.env.REACT_APP_SEND_RESET_PASSWORD_URL, non_existing_email_details).reply(404, send_reset_password_no_user_response);
        mock.onPost(process.env.REACT_APP_SEND_RESET_PASSWORD_URL).reply(200, send_reset_password_response);
        mock.onPost(process.env.REACT_APP_RESET_PASSWORD_URL, reset_password_too_short).reply(400, register_too_short_password_response);
        mock.onPost(process.env.REACT_APP_RESET_PASSWORD_URL, reset_password_invalid_signature).reply(400, verify_response_invalid_signature);
        mock.onPost(process.env.REACT_APP_RESET_PASSWORD_URL).reply(200, reset_password_response);
        mock.onPost(process.env.REACT_APP_VERIFY_REGISTRATION_URL, verify_invalid_signature).reply(400, verify_response_invalid_signature);
        mock.onPost(process.env.REACT_APP_VERIFY_REGISTRATION_URL).reply(200, verify_registration_response);
        mockRaw.onPost(process.env.REACT_APP_REFRESH_TOKEN_URL).reply(200, login_response_ok);
        mock.onPost(process.env.REACT_APP_SIGN_OUT_URL).reply(200, logout_response_ok);
        mock.onGet(process.env.REACT_APP_USER_PROFILE_URL).reply((config) => checkHeaders(config, [200, userDetailsResponse], [200, userDetailsStaffResponse]));
        mock.onPatch(process.env.REACT_APP_USER_PROFILE_URL, change_first_name_data).reply((config) => checkHeaders(config, [200, user_details_first_name_changed_response]));
        mock.onPatch(process.env.REACT_APP_USER_PROFILE_URL, change_last_name_data).reply((config) => checkHeaders(config, [200, user_details_both_names_changed_response]));
        mock.onPost(process.env.REACT_APP_CHANGE_EMAIL_URL).reply((config) => checkHeaders(config, [200, change_email_response]));
        mock.onPost(process.env.REACT_APP_VERIFY_EMAIL_URL, verify_email_invalid_signature).reply(400, verify_response_invalid_signature);
        mock.onPost(process.env.REACT_APP_VERIFY_EMAIL_URL).reply(200, verify_email_response);
        mock.onPost(process.env.REACT_APP_CHANGE_PASSWORD_URL, change_password_request_wrong_old_password).reply((config) => checkHeaders(config, [400, change_password_response_wrong_old_password]));
        mock.onPost(process.env.REACT_APP_CHANGE_PASSWORD_URL, change_password_request_password_too_short).reply((config) => checkHeaders(config, [400, register_too_short_password_response]));
        mock.onPost(process.env.REACT_APP_CHANGE_PASSWORD_URL).reply((config) => checkHeaders(config, [200, change_password_response]));
        if (errorOnNoMatch || process.env.REACT_APP_MOCK_BACKEND_ERROR_ON_NO_MATCH) {
            console.log('Error will be raised if API request cannot be matched')
            mock.onAny().reply((config) => {
                console.log("Mock request did not match", config);
                return [404, []]
            })
        }else{
            console.log('Unmatched mock api requests will be passed through')
            mock.onAny().passThrough()
        }
    }
}


console.log('mock', mock)
console.log('mockRaw', mockRaw)
export { mock }
export { mockRaw }