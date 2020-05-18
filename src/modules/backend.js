import fetchMock from 'fetch-mock';
fetchMock.config.overwriteRoutes = false;

// const email = 'testuser@example.com'
// const password =  'testpassword1'
const response_key = process.env.REACT_APP_GENERAL_KEY_ERRORS
const non_field_errors_key = process.env.REACT_APP_NON_FIELD_ERRORS_KEY
const email_address = 'a@a.com'
const password =  'a'
const first_name = 'test'
const last_name = 'user'
const epoch_time = 1589819019;
// const login_details = {login: email_address, password: password}
const wrong_login_details = {login: email_address, password: 'b'}
// const existing_user_login_details = {'login': 'second', 'password': 'b'}
const login_response_ok = {[response_key]: 'Login successful'}
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
        fetchMock.post({
            url: process.env.REACT_APP_SIGN_IN_URL,
            body: wrong_login_details,
        }, {status: 400, body: login_failed_response});
        fetchMock.post({
            url: process.env.REACT_APP_SIGN_IN_URL,
        }, {status: 200, body: login_response_ok});
        fetchMock.post({
            url: process.env.REACT_APP_SIGN_UP_URL,
            body: register_data_already_exists
        }, {status: 400, body: register_user_already_exists});
        fetchMock.post({
            url: process.env.REACT_APP_SIGN_UP_URL,
            body: register_data_short_password
        }, {status: 400, body: register_too_short_password_response});
        fetchMock.post({
            url: process.env.REACT_APP_SIGN_OUT_URL,
        }, {status: 200, body: logout_response_ok});
        fetchMock.post({
            url: process.env.REACT_APP_SIGN_UP_URL,
        }, {status: 201, body: user_details_response});
        fetchMock.post({
            url: process.env.REACT_APP_SEND_RESET_PASSWORD_URL,
        }, {status: 200, body: send_reset_password_response});
        fetchMock.post({
            url: process.env.REACT_APP_RESET_PASSWORD_URL,
        }, {status: 200, body: reset_password_response});
        fetchMock.post({
            url: process.env.REACT_APP_RESET_PASSWORD_URL,
            body: {user_id: 1, password: 'z', password_confirm: 'z', timestamp: epoch_time, signature :1234}
        }, {status: 400, body: verify_response_invalid_signature});
        fetchMock.post({
            url: process.env.REACT_APP_VERIFY_REGISTRATION_URL,
        }, {status: 200, body: verify_registration_response});
        fetchMock.post({
            url: process.env.REACT_APP_VERIFY_REGISTRATION_URL,
            body: {user_id: 1, timestamp: epoch_time, signature :1234}
        }, {status: 400, body: verify_response_invalid_signature});
        fetchMock.get({
            url: process.env.REACT_APP_USER_PROFILE_URL,
        }, {status: 200, body: user_details_response});
        fetchMock.patch({
            url: process.env.REACT_APP_USER_PROFILE_URL,
        }, {status: 200, body: user_details_response});
    } else {
        // production code
    }
}