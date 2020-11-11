import React from 'react';
import AjaxRequest from "../components/AjaxRequest";
import {clearAuthTokens, getRefreshToken} from "axios-jwt";
import {signOut} from "../api"


const logoutEndpoint = process.env.REACT_APP_SIGN_OUT_URL


class SignOut extends React.Component {

    onSuccess= () => {
        signOut();
        if (this.props.onSuccess) setTimeout(this.props.onSuccess, 0);
    }

    render(){
        const refreshToken = getRefreshToken();
        const signOutData = {refresh: refreshToken};
        const redirect = {
              pathname: "/",
        }
        return (
            <AjaxRequest url={logoutEndpoint} method="POST" values={signOutData} resetUserDetails
                         redirectTo={redirect} reDirectOnError onSuccess={this.onSuccess} onError={this.onSuccess}
            analyticsEventArgs={{category: 'User', action: 'Sign Out'}}>
            </AjaxRequest>
        )
    }
}

export default SignOut;