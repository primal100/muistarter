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
import Alerts from "./modules/Alerts";
import { isLoggedIn } from "axios-jwt";
import {getAndUpdateUserDetails} from "./modules/api";
import { UserContext } from "./modules/contexts"

const verifyRegistrationUrl = process.env.REACT_APP_VERIFY_REGISTRATION_URL
const verifyEmailUrl = process.env.REACT_APP_VERIFY_EMAIL_URL


export class ProtectedRoute extends React.Component {
  render() {
    const { component: Component, ...props } = this.props;
    const authenticated = isLoggedIn();
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


export class AppRoutes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/sign-in" component={SignIn}/>
        <ProtectedRoute path="/sign-out" component={SignOut}/>
        <Route path="/sign-up" component={SignUp}/>
        <Route path="/sign-up-verify-email"
               render={() => <SendParams url={verifyRegistrationUrl} redirectTo="/sign-in"/>}/>
        <Route path="/send-reset-password-url" component={SendResetPasswordURL}/>
        <Route path="/reset-password" component={ResetPassword}/>
        <ProtectedRoute path="/profile" component={UserProfile}/>
        <Route path="/verify-email" render={() => <SendParams url={verifyEmailUrl} redirectTo="/"/>}/>
        <ProtectedRoute path="/change-password" component={ChangePassword}/>
        {this.props.children}
        <Route exact render={props => <Redirect to="/"/>}/>
      </Switch>
    )
  }
}


export class SetUserContext extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userDetails: {user: null, updater: this.updateUserDetails}
        }
    }

    async componentDidMount() {
        await getAndUpdateUserDetails(this.updateUserDetails);
    }

    updateUserDetails = (user) => {
        if(user && user.email) {
            this.setState({userDetails: {user: user, updater: this.updateUserDetails}})
        }
    }

    render() {
        return (
            <UserContext.Provider value={this.state.userDetails}>
            {this.props.children}
            </UserContext.Provider>
        )
    }
}


class App extends React.Component {

    render() {
        return (
            <Router>
              <ScrollToTop>
                <SetUserContext>
                <AppAppBar showName/>
                <Alerts/>
                <div>
                  <AppRoutes/>
                </div>
                <AppFooter/>
                </SetUserContext>
              </ScrollToTop>
            </Router>
        );
    }
}


export default withRoot(App);