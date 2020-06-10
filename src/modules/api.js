import axios from 'axios';
import {
  useAuthTokenInterceptor
} from "axios-jwt";


const refreshEndpoint = process.env.REACT_APP_REFRESH_TOKEN_URL
const userProfileEndpoint = process.env.REACT_APP_USER_PROFILE_URL


export const API = axios.create({
});


const requestRefresh = async (refreshToken) => {
  return (await axios.post(refreshEndpoint, { token: refreshToken })).data
    .access;
};


useAuthTokenInterceptor(API, { requestRefresh });

const onFail = async(values) => {
    // Check if failure is due to access token and if so refresh and return true (if refresh token fails, go to login), else return false
}


export const getUserProfile = async (values) => {
    var i;
    for (i = 0; i < 2; i++) {
       let response = await API.get(user_profile_url);
       let status = response.status;
       let data = response.data;
       if (status === 200) {
           return data;
       } else {
           await onFail(data);
       }
   }
}


export const onSignIn = async (values) => {
    localStorage.setItem('access', values.access)
    localStorage.setItem('refresh', values.refresh)
    window.location = "/";
}


export const checkAuthentication = () => {
    const accessToken = localStorage.getItem('access')
    API.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
}
