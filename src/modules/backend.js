import { API, APINoAuthentication } from './api'
import * as jwt from 'jsonwebtoken'
import MockAdapter from 'axios-mock-adapter'

let mock;
let mockRaw;


if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') {
    const adaptorConfig = { delayResponse: parseInt(process.env.REACT_APP_MOCK_DELAY || 0) }
    console.log(`Running in ${process.env.NODE_ENV} mode`)
    console.log('AdaptorConfig', adaptorConfig);
    mock = new MockAdapter(API, adaptorConfig);
    mockRaw = new MockAdapter(APINoAuthentication, adaptorConfig);
    mock.onNoMatch = "passthrough";
    mockRaw.onNoMatch = "passthrough";
}else {
    console.log(`Running in ${process.env.NODE_ENV} mode`)
    mock = null
    mockRaw = null;
}

const responseKey = process.env.REACT_APP_GENERAL_RESPONSE_KEY
const nonFieldErrorsKey = process.env.REACT_APP_NON_FIELD_ERRORS_KEY
const email_address = 'testuser@example.com'
const staffEmailAddress = 'staff@admin.com'
const password = 'x1y@4f!21a'
const first_name = 'test'
const last_name = 'user'
const epoch_time = '1589819019';
const non_existing_email_details = {login: 'b@a.com'}
const staffLoginDetails = {email: staffEmailAddress, password: 'b'}
const wrong_login_details = {email: email_address, password: 'b'}
const user_inactive_details = {email: 'c@a.com', password: 'b'}
const accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxOTE1NDUyOTYzLCJqdGkiOiJiYTQxZWJkZGMwMGQ0ODhhOTQ1NWM4NzhkNmI1NjJiNiIsInVzZXJfaWQiOjEsImVtYWlsIjoidGVzdHVzZXJAZXhhbXBsZS5jb20iLCJmaXJzdF9uYW1lIjoidGVzdCIsImxhc3RfbmFtZSI6InVzZXIiLCJpc19zdGFmZiI6ZmFsc2UsImlzX3N1cGVydXNlciI6ZmFsc2V9.RF8h_R2KYjV7-0-BYpu7xaWXKei9i99SVHGTEHeUAE0';
const refreshToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTk0Njk4ODk2MywianRpIjoiODg0ZmVhYWFkN2FjNGM5Mjg2ZDIxOTllMDljNjI4MzEiLCJ1c2VyX2lkIjoxLCJlbWFpbCI6InRlc3R1c2VyQGV4YW1wbGUuY29tIiwiZmlyc3RfbmFtZSI6InRlc3QiLCJsYXN0X25hbWUiOiJ1c2VyIiwiaXNfc3RhZmYiOmZhbHNlLCJpc19zdXBlcnVzZXIiOmZhbHNlfQ.mYEs7Swy-7rJ9iWd1l3xNkIcE-2KO9KKR5ZZR-OHNc0';
const loginResponseOk = {access: accessToken, refresh: refreshToken}
const refreshedAccessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxOTE1NDUzNDkzLCJqdGkiOiIwYjVkYjlmN2ZiNjg0YWRlOGJiOWYzYmUyODc0YzM2MCIsInVzZXJfaWQiOjEsImVtYWlsIjoidGVzdHVzZXJAZXhhbXBsZS5jb20iLCJmaXJzdF9uYW1lIjoidGVzdCIsImxhc3RfbmFtZSI6InVzZXIiLCJpc19zdGFmZiI6ZmFsc2UsImlzX3N1cGVydXNlciI6ZmFsc2V9.-Bp-HQffYV-mmVV0x_UMNnmJVGvhZ1YRtlxyqtRslUE';
const refreshRefreshToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTk0Njk4OTQ5MywianRpIjoiZGU2YmRiYzMyOGQ2NDc3Njk4NTZiNjIzYzFkODQ1NDciLCJ1c2VyX2lkIjoxLCJlbWFpbCI6InRlc3R1c2VyQGV4YW1wbGUuY29tIiwiZmlyc3RfbmFtZSI6InRlc3QiLCJsYXN0X25hbWUiOiJ1c2VyIiwiaXNfc3RhZmYiOmZhbHNlLCJpc19zdXBlcnVzZXIiOmZhbHNlfQ.aPpzbtjVUcXS3jmdySOjGkI4KASpKyQWemwQB4cUjs8';
const refreshResponseOK = {access: refreshedAccessToken, refresh: refreshRefreshToken}
const accessTokenStaff = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxOTE1NDUzMTIzLCJqdGkiOiJlYzdjMTFkMGE0OWY0NjBhYWVkNDg4NmE1YWEzZDU2MyIsInVzZXJfaWQiOjIsImVtYWlsIjoic3RhZmZAYWRtaW4uY29tIiwiZmlyc3RfbmFtZSI6IkFkbWluIiwibGFzdF9uYW1lIjoiU3RhZmYiLCJpc19zdGFmZiI6dHJ1ZSwiaXNfc3VwZXJ1c2VyIjpmYWxzZX0.JL1y_0SUL1EW6A_neJH2MRc6BLLGaszgQJH5cgIvCKc';
const refreshTokenStaff = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTk0Njk4OTEyMywianRpIjoiZDQ1OGY4NzM0MTY0NDVjMGI4YWY0NTJkNTQ4Mzc2YzciLCJ1c2VyX2lkIjoyLCJlbWFpbCI6InN0YWZmQGFkbWluLmNvbSIsImZpcnN0X25hbWUiOiJBZG1pbiIsImxhc3RfbmFtZSI6IlN0YWZmIiwiaXNfc3RhZmYiOnRydWUsImlzX3N1cGVydXNlciI6ZmFsc2V9.5vkDMA_7lRMZoY0kJeoHbEKcp6tQibhzfQsSkbIiae0';
const staffLoginResponse = {access: accessTokenStaff, refresh: refreshTokenStaff}
const refreshedAccessTokenStaff = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxOTE1NDU0OTcxLCJqdGkiOiI3ZjcyM2I3MDUyYTY0ZDFlODY1M2U4NjEzYTIzZjllZiIsInVzZXJfaWQiOjIsImVtYWlsIjoic3RhZmZAYWRtaW4uY29tIiwiZmlyc3RfbmFtZSI6IkFkbWluIiwibGFzdF9uYW1lIjoiU3RhZmYiLCJpc19zdGFmZiI6dHJ1ZSwiaXNfc3VwZXJ1c2VyIjpmYWxzZX0.oktdAsfIeTVq5uHS860-1_KzxUVJTUFZdKgKvV9xPxI';
const refreshedRefreshTokenStaff = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTk0Njk5MDk3MSwianRpIjoiMjBmOTI4NmZiNGNjNGIyMzkxNTUxYzI2NjliNTE2NDgiLCJ1c2VyX2lkIjoyLCJlbWFpbCI6InN0YWZmQGFkbWluLmNvbSIsImZpcnN0X25hbWUiOiJBZG1pbiIsImxhc3RfbmFtZSI6IlN0YWZmIiwiaXNfc3RhZmYiOnRydWUsImlzX3N1cGVydXNlciI6ZmFsc2V9.W8GHw6Ue8hjg9nzsRnbd2Pa5p7hgRNyu1-UbYwhoUA0';
const staffTokenRefreshResponseOK = {access: refreshedAccessTokenStaff, refresh: refreshedRefreshTokenStaff}

const logoutResponseOK = {[responseKey]: 'Logout successful'}
const loginFailedResponse = {[responseKey]: 'No active account found with the given credentials'}
const authorizationHeader = 'Authorization';
const userDetailsResponse = {id: 1, first_name: first_name, last_name: last_name,
                              email: email_address, is_staff: false, is_superuser: false}
const userDetailsStaffResponse = {id: 2, first_name: "Admin", last_name: "Staff",
                              email: staffEmailAddress, is_staff: true, is_superuser: false}
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


export const mockBackendDecodeAccessTokenFromAxiosConfig = (config) => {
    if (config.headers[authorizationHeader]){
        const accessToken = config.headers[authorizationHeader].split(' ')[1]
        console.log('found accessToken', accessToken)
        return jwt.decode(accessToken);
    }
    return null;
}


export const mockBackendCheckIsStaff = (config, normalReply, staffReply) => {
    console.log('Received request', config);
    const userData = mockBackendDecodeAccessTokenFromAxiosConfig(config);
    console.log('userData', userData)
    if (userData) {
        if (userData.is_staff) {
            console.log('returning', staffReply)
            return staffReply;
        } else {
            console.log('returning', normalReply)
            return normalReply;
        }
    }
    return [401, {[responseKey]: 'Authentication credentials were not provided.'}]
}


export const mockBackendRefreshTokenMock = (config) => {
    const refreshToken = JSON.parse(config.data).refresh;
    const userData = jwt.decode(refreshToken);
    console.log('userData', userData)
    if (userData.is_staff) return [200, staffTokenRefreshResponseOK];
    else return [200, refreshResponseOK];
}


export default function mockBackend(errorOnNoMatch) {
    if (mock) {
        mock.onPost(process.env.REACT_APP_SIGN_IN_URL, wrong_login_details).reply(401, loginFailedResponse);
        mock.onPost(process.env.REACT_APP_SIGN_IN_URL, user_inactive_details).reply(401, loginFailedResponse);
        mock.onPost(process.env.REACT_APP_SIGN_IN_URL, staffLoginDetails).reply(200, staffLoginResponse);
        mock.onPost(process.env.REACT_APP_SIGN_IN_URL).reply(200, loginResponseOk);
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
        mockRaw.onPost(process.env.REACT_APP_REFRESH_TOKEN_URL).reply(mockBackendRefreshTokenMock);
        mock.onPost(process.env.REACT_APP_SIGN_OUT_URL).reply(200, logoutResponseOK);
        mock.onGet(process.env.REACT_APP_USER_PROFILE_URL).reply((config) => mockBackendCheckIsStaff(config, [200, userDetailsResponse], [200, userDetailsStaffResponse]));
        mock.onPatch(process.env.REACT_APP_USER_PROFILE_URL, change_first_name_data).reply((config) => mockBackendCheckIsStaff(config, [200, user_details_first_name_changed_response]));
        mock.onPatch(process.env.REACT_APP_USER_PROFILE_URL, change_last_name_data).reply((config) => mockBackendCheckIsStaff(config, [200, user_details_both_names_changed_response]));
        mock.onPost(process.env.REACT_APP_CHANGE_EMAIL_URL).reply((config) => mockBackendCheckIsStaff(config, [200, change_email_response]));
        mock.onPost(process.env.REACT_APP_VERIFY_EMAIL_URL, verify_email_invalid_signature).reply(400, verify_response_invalid_signature);
        mock.onPost(process.env.REACT_APP_VERIFY_EMAIL_URL).reply(200, verify_email_response);
        mock.onPost(process.env.REACT_APP_CHANGE_PASSWORD_URL, change_password_request_wrong_old_password).reply((config) => mockBackendCheckIsStaff(config, [400, change_password_response_wrong_old_password]));
        mock.onPost(process.env.REACT_APP_CHANGE_PASSWORD_URL, change_password_request_password_too_short).reply((config) => mockBackendCheckIsStaff(config, [400, register_too_short_password_response]));
        mock.onPost(process.env.REACT_APP_CHANGE_PASSWORD_URL).reply((config) => mockBackendCheckIsStaff(config, [200, change_password_response]));
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