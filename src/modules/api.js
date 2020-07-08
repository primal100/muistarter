import axios from 'axios';
import * as jwt from 'jsonwebtoken'
import {
    useAuthTokenInterceptor,
    setAuthTokens,
    clearAuthTokens,
    getRefreshToken, isLoggedIn,
} from "axios-jwt";


const userProfileUrl = process.env.REACT_APP_USER_PROFILE_URL
const refreshEndpoint = process.env.REACT_APP_REFRESH_TOKEN_URL
const logoutEndpoint = process.env.REACT_APP_SIGN_OUT_URL

const REMOVE_REFRESH_TOKEN_IF_EXPIRES_IN_SECS = 300;


export const API = axios.create({
});


export const APINoHeader = axios.create({
});


const getExpiresInFromJWT = (token) => {
  const exp = getTokenExpiresTimeStamp(token)
  if (exp) return exp - Date.now() / 1000

  return -1
}


// gets unix TS
const getTokenExpiresTimeStamp = (token) => {
  const decoded = jwt.decode(token)
  if (!decoded) return
  return decoded.exp
}


const isTokenExpired = (token, expire_fudge=0) => {
    if (!token) return true
    const expin = getExpiresInFromJWT(token) - expire_fudge
    return !expin || expin < 0
}


const onRefreshTokenExpired = (redirectPath=window.location.pathname) => {
   clearAuthTokens();
   window.location = redirectPath;
}


const requestRefresh = async (refreshToken) => {
    if (isTokenExpired(refreshToken)){
        onRefreshTokenExpired("sign-in/");
    }
    const response = await APINoHeader({
                    method: 'POST',
                    url: refreshEndpoint,
                    data: { token: refreshToken }});
    return response.data.access;
};


const refreshToken = getRefreshToken();
if (refreshToken && isTokenExpired(refreshToken, REMOVE_REFRESH_TOKEN_IF_EXPIRES_IN_SECS)){
    onRefreshTokenExpired();
}

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

export const getAndUpdateUserDetails = async(updater) => {
        let values;
        if (isLoggedIn()){
            const response = await API.get(userProfileUrl);
            values = response.data;
        }
        updater(values);
}