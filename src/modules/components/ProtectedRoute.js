import React from "react";
import {isLoggedIn} from "axios-jwt";
import {sendAnalyticsEvent} from "../analytics";
import {Redirect, Route} from "react-router-dom";
import NoSsr from "@material-ui/core/NoSsr";

class ProtectedRouteInner extends React.Component {
  render() {
    const { component: Component, ...props } = this.props;
    const authenticated = isLoggedIn();
    if (!authenticated)
        sendAnalyticsEvent({
            category: 'User',
            action: `Redirect to sign-in as attempt was made to access ProtectedRoute by non-authenticated user: ${window.location.pathname}`,
            label: 'RedirectToSignIn',
            nonInteraction: true
        });
    return (
      <Route
        {...props}
        render={props => (
          authenticated ?
            <Component {...props} /> :
            <Redirect to='/sign-in' />
        )}
      />
    )
  }
}


export default function ProtectedRoute(props){
    return (
        <NoSsr>
            <ProtectedRouteInner {...props}/>
        </NoSsr>
    )
}