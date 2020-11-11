import axios from 'axios';
import * as jwt from 'jsonwebtoken'
import { parseBool} from "./utils";
import {
    useAuthTokenInterceptor,
    clearAuthTokens,
    getRefreshToken,
    getAccessToken,
    isLoggedIn,
    setAccessToken,
    refreshTokenIfNeeded, setAuthTokens
} from "axios-jwt";
import {sendAnalyticsEvent, sendAnalyticsEventForAjaxRequest, sendAnalyticsException} from "./analytics";


const userProfileUrl = process.env.REACT_APP_USER_PROFILE_URL
const refreshEndpoint = process.env.REACT_APP_REFRESH_TOKEN_URL
const logoutEndpoint = process.env.REACT_APP_SIGN_OUT_URL
const clearLocalStorageOnSignOut = parseBool(process.env.REACT_APP_CLEAR_LOCAL_STORAGE_ON_SIGN_OUT)

const REMOVE_REFRESH_TOKEN_IF_EXPIRES_IN_SECS = 300;


export const API = axios.create({
});


export const APINoAuthentication = axios.create({
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
    const isExpired = !expin || expin < 0;
    return isExpired;
}


const onRefreshTokenExpired = (redirectPath=window.location.pathname) => {
   //redirectPath = redirectPath || window.location.pathname;
    sendAnalyticsEvent({
        category: 'User',
        action: 'Redirect to sign-in as refresh token expired',
        label: 'RedirectToSignIn',
        nonInteraction: true
    });
   clearAuthTokens();
   window.location = redirectPath;
}


const setRefreshToken = (token) => {
    const accessToken = getAccessToken();
    const tokens = {accessToken: accessToken, refreshToken: token};
    setAuthTokens(tokens);
}


let tokenRefreshPromise;


const unsetTokenPromise = () =>{
    tokenRefreshPromise = null;
}

const requestRefresh = async (refreshToken) => {
    if (isTokenExpired(refreshToken)){
        onRefreshTokenExpired("sign-in");
    }

    if (!tokenRefreshPromise){
        const request = {
            method: 'POST',
            url: refreshEndpoint,
            data: {refresh: refreshToken}
        }
        sendAnalyticsEventForAjaxRequest(request.url, request.method, true, {
            category: 'User', action: 'Refresh Access Token', label: "TokenRefresh", nonInteraction: true
        })
        tokenRefreshPromise = APINoAuthentication(request);
    }
    try {
        const response = await tokenRefreshPromise;
        const data = await response.data;
        if (data.refresh) setRefreshToken(data.refresh)
        setTimeout(unsetTokenPromise, 3000);
        return data.access;
    } catch (e) {
        sendAnalyticsException(e);
        throw e;
    }
};


const currentRefreshToken = getRefreshToken();
if (currentRefreshToken && isTokenExpired(currentRefreshToken, REMOVE_REFRESH_TOKEN_IF_EXPIRES_IN_SECS)){
    onRefreshTokenExpired();
}

useAuthTokenInterceptor(API, { requestRefresh });


export const authResponseToAuthTokens = (values) => ({
  accessToken: values.access,
  refreshToken: values.refresh
});


const expectedAttrs = ['id', 'email', 'is_staff', 'exp', 'first_name', 'last_name']


function AttributeMissingFromTokenError(message) {
  return  new Error(message);
}


export const verifyTokenAttrs = (decodedToken) => {
    expectedAttrs.forEach((attr) => {
        if (! attr in decodedToken) {
            throw new AttributeMissingFromTokenError(`${attr} value is missing from decoded jwt token:`, decodedToken);
        }
    })
}

export const updateUserFromCurrentAccessToken = (updater) => {
    const accessToken = getAccessToken();
    if (accessToken) updater(jwt.decode(accessToken));
}

export const getAndUpdateUserDetails = async(updater, data) => {
    let user;

    if (data && data.access && data.refresh){
        user = jwt.decode(data.access);
        setAuthTokens(authResponseToAuthTokens(data));
    }
    else if (isLoggedIn()){
        setAccessToken(null);
        const accessToken = await refreshTokenIfNeeded(requestRefresh);
        user = jwt.decode(accessToken);
    }else{
        user = null;
    }
    if (user && !user.id) user.id = user.user_id;
    updater(user);
    if (user) verifyTokenAttrs(user);
}


export const signOut = () => {
    clearAuthTokens();
    unsetTokenPromise();
    if (clearLocalStorageOnSignOut) localStorage.clear();
}