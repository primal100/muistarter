import axios from 'axios';
import {
    useAuthTokenInterceptor,
    setAuthTokens,
    clearAuthTokens,
    getRefreshToken,
} from "axios-jwt";


const refreshEndpoint = process.env.REACT_APP_REFRESH_TOKEN_URL
const logoutEndpoint = process.env.REACT_APP_SIGN_OUT_URL
//const userProfileEndpoint = process.env.REACT_APP_USER_PROFILE_URL


export const API = axios.create({
});


const requestRefresh = async (refreshToken) => {
  return (await axios.post(refreshEndpoint, { token: refreshToken })).data
    .access;
};


useAuthTokenInterceptor(API, { requestRefresh });


export const authResponseToAuthTokens = (values) => ({
  accessToken: values.access,
  refreshToken: values.refresh
});


export const onSignIn = (values) => {
    setAuthTokens(authResponseToAuthTokens(values));
    window.location = "/";
}

export const logout = async () => {
    await API.post(logoutEndpoint, {'refresh': getRefreshToken()})
    clearAuthTokens();
    window.location = "/";
}


export const checkAuthentication = () => {
    const accessToken = localStorage.getItem('access')
    API.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
}
