import React from 'react';
import AjaxRequest from "../components/AjaxRequest";
import { UserContext } from "../contexts";
import {clearAuthTokens, getRefreshToken} from "axios-jwt";


const logoutEndpoint = process.env.REACT_APP_SIGN_OUT_URL


class SignOut extends React.Component {

    onSuccess= () => {
        console.log('Clearing auth tokens')
        clearAuthTokens();
        if (this.props.onSuccess) setTimeout(this.props.onSuccess, 0);
        console.log('SignOut onSuccess finished')
    }

    render(){
        const signOutData = {refresh: getRefreshToken()};
        const redirect = {
              pathname: "/",
        }
        return (
            <AjaxRequest url={logoutEndpoint} method="POST" values={signOutData} resetUserDetails
                                 redirectTo={redirect} reDirectOnError onSuccess={this.onSuccess}>
            </AjaxRequest>
        )
    }
}

export default SignOut;