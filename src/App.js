import withRoot from './modules/withRoot';
// --- Post bootstrap -----
import React from 'react';
import AppFooter from './modules/views/AppFooter';
import AppAppBar from './modules/views/AppAppBar';
import {BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import ScrollToTop from 'react-router-scroll-top'
import Home from "./modules/components/Home";
import ChangePassword from "./modules/components/ChangePassword";
import SignIn from "./modules/components/SignIn";
import SignUp from "./modules/components/SignUp";
import SignOut from "./modules/components/SignOut";
import SendResetPasswordURL from "./modules/components/SendResetPasswordURL";
import ResetPassword from "./modules/components/ResetPassword";
import SendParams from "./modules/components/SendParams"
import UserProfile from "./modules/components/UserProfile";
import mockBackend from "./modules/backend"
import Alerts from "./Alerts";
import { isLoggedIn } from "axios-jwt";



const verify_registration_url = process.env.REACT_APP_VERIFY_REGISTRATION_URL
const verify_email_url = process.env.REACT_APP_VERIFY_EMAIL_URL


export class ProtectedRoute extends React.Component {
  render() {
    const authenticated = isLoggedIn();
    const { component: Component, ...props } = this.props;

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


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      authenticated: isLoggedIn()
    }
  }

  render() {
    return (
        <Router>
          <ScrollToTop>
            <AppAppBar/>
            <Alerts/>
            <div>
              <Switch>
              <Route exact path="/" component={Home}/>
              <Route path="/sign-in" component={SignIn}/>
              <ProtectedRoute path="/sign-out" component={SignOut}/>
              <Route path="/sign-up" component={SignUp}/>
              <Route path="/sign-up-verify-email" render={() => <SendParams url={verify_registration_url} redirectTo="/sign-in"/>} />
              <Route path="/send-reset-password-url" component={SendResetPasswordURL}/>
              <Route path="/reset-password" component={ResetPassword}/>
              <ProtectedRoute path="/profile" component={UserProfile}/>
              <Route path="/verify-email" render={() => <SendParams url={verify_email_url} redirectTo="/"/>} />
              <ProtectedRoute path="/change-password" component={ChangePassword}/>
              {this.props.routes}
              <Route exact render={props => <Redirect to="/"/>}/>
              </Switch>
            </div>
            <AppFooter/>
          </ScrollToTop>
        </Router>
    );
  }
}


mockBackend();
export default withRoot(App);