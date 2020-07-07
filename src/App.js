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
import {API} from "./modules/api";
import { UserContext } from "./modules/contexts"


const userProfileUrl = process.env.REACT_APP_USER_PROFILE_URL
const verifyRegistrationUrl = process.env.REACT_APP_VERIFY_REGISTRATION_URL
const verifyEmailUrl = process.env.REACT_APP_VERIFY_EMAIL_URL


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


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userDetails: {}
        }
    }

    async componentDidMount(){
        let values;
        if (isLoggedIn()){
            const response = await API.get(userProfileUrl);
            values = response.data;
        }else{
            values = {};
        }
        //this.updateUserDetails(values)
        this.setState({userDetails: {values: values, updater: this.updateUserDetails}})
    }

    updateUserDetails = (values) => {
        //this.setState({userDetails: values})
    }

    render() {
        console.log(UserContext)
        console.log('userDetails', this.state.userDetails)
        return (
            <Router>
              <ScrollToTop>
                <AppAppBar/>
                <Alerts/>
                <div>
                  <AppRoutes/>
                </div>
                <AppFooter/>
              </ScrollToTop>
            </Router>
        );
    }
}


export default withRoot(App);