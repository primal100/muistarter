import React from "react";
import {isLoggedIn} from "axios-jwt";
import {sendAnalyticsEvent} from "./modules/analytics";
import {Redirect, Route, Switch} from "react-router-dom";
import SignIn from "./modules/components/SignIn";
import SignOut from "./modules/components/SignOut";
import SignUp from "./modules/components/SignUp";
import SendParams from "./modules/components/SendParams";
import SendResetPasswordURL from "./modules/components/SendResetPasswordURL";
import ResetPassword from "./modules/components/ResetPassword";
import UserProfile from "./modules/components/UserProfile";
import ChangePassword from "./modules/components/ChangePassword";
import MarkdownFileView from "./modules/components/MarkdownFileView"
import Home from "./modules/components/Home";
import NoSsr from "@material-ui/core/NoSsr";


const verifyRegistrationUrl = process.env.REACT_APP_VERIFY_REGISTRATION_URL
const verifyEmailUrl = process.env.REACT_APP_VERIFY_EMAIL_URL
const privacyFile = process.env.REACT_APP_PRIVACY_MARKDOWN_FILE || "/privacy.md"
const termsFile = process.env.REACT_APP_TERMS_MARKDOWN_FILE || "/terms.md"


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


export function ProtectedRoute(props){
    return (
        <NoSsr>
            <ProtectedRouteInner {...props}/>
        </NoSsr>
    )
}


export class AppRoutes extends React.Component {

  render() {
    return (
      <Switch>
        <Route path="/sign-in" render={() => <SignIn redirectTo={this.props.redirectOnSignIn}/>}/>
        <ProtectedRoute path="/sign-out" component={SignOut}/>
        <Route path="/sign-up" component={SignUp}/>
        <Route path="/sign-up-verify-email"
               render={() => <SendParams url={verifyRegistrationUrl} action="Verify registration" redirectTo="/sign-in"/>}/>
        <Route path="/send-reset-password-url" component={SendResetPasswordURL}/>
        <Route path="/reset-password" component={ResetPassword}/>
        <ProtectedRoute path="/profile" component={UserProfile}/>
        <Route path="/verify-email" render={() => <SendParams url={verifyEmailUrl} action="Verify new e-mail address" redirectTo="/"/>}/>
        <ProtectedRoute path="/change-password" component={ChangePassword}/>
        <Route path="/privacy" render={() => <MarkdownFileView key="privacy" url={privacyFile}/>}/>
        <Route path="/terms" render={() => <MarkdownFileView key="terms" url={termsFile}/>}/>
        {this.props.children}
        <Route exact path="/" component={Home}/>
        <Route exact render={props => <Redirect to="/"/>}/>
      </Switch>
    )
  }
}
