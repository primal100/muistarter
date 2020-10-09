import withRoot from './modules/withRoot';
// --- Post bootstrap -----
import React from 'react';
import { SnackbarProvider } from 'notistack';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Announcement from "./modules/components/Announcement";
import AppFooter from './modules/views/AppFooter';
import AppAppBar from './modules/views/AppAppBar';
import {BrowserRouter as Router, Route, Redirect, Switch, withRouter } from "react-router-dom";
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
import { isLoggedIn } from "axios-jwt";
import {getAndUpdateUserDetails, updateUserFromCurrentAccessToken} from "./modules/api";
import { UserContext } from "./modules/contexts"
import {sendGAEvent, setGAUserDetails, sendGAError} from "./modules/analytics";
import {Analytics, pageViewGA} from "./modules/analytics"

const verifyRegistrationUrl = process.env.REACT_APP_VERIFY_REGISTRATION_URL
const verifyEmailUrl = process.env.REACT_APP_VERIFY_EMAIL_URL


const autoHideDurationSeconds = process.env.REACT_APP_AUTO_HIDE_DURATION_SECONDS || 5;
const transitionExitDurationSeconds = process.env.REACT_APP_TRANSITION_EXIT_DURATION_SECONDS || 3;
const anchorOrigin = {horizontal: process.env.REACT_APP_ANCHOR_ORIGIN_HORIZONTAL || 'center',
    vertical: process.env.REACT_APP_ANCHOR_ORIGIN_VERTICAL || 'top'}
const maxAlertsMobile = process.env.REACT_APP_MAX_ALERTS_MOBILE || 3
const maxAlerts = process.env.REACT_APP_MAX_ALERTS_MOBILE || 5
const snackbarClasses = {
            variantSuccess: 'success-message',
            variantError: 'error-message',
            variantWarning: 'warning-message',
            variantInfo: 'info-message'
}


export class ProtectedRoute extends React.Component {
  render() {
    const { component: Component, ...props } = this.props;
    const authenticated = isLoggedIn();
    if (!authenticated)
        sendGAEvent({
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


export class _AppRoutes extends React.Component {
   componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) pageViewGA();
  }

  render() {
      console.log('AppRoutes', this.props.redirectOnSignIn);
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
        {this.props.children}
        <Route exact path="/" component={Home}/>
        <Route exact render={props => <Redirect to="/"/>}/>
      </Switch>
    )
  }
}


export const AppRoutes = withRouter(_AppRoutes);


export class SetUserContext extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userDetails: {user: null, updater: this.updateUserDetails, reset: this.resetUserDetails, userChecked: false}
        }
    }

    async componentDidMount() {
        updateUserFromCurrentAccessToken(this.updateUserDetails);
        await getAndUpdateUserDetails(this.updateUserDetails);
    }

    updateUserDetails = (user) => {
        console.log('Updating user details', user);
        if(user && user.email) {
            setGAUserDetails(user);
            this.setState({userDetails: {user: user, updater: this.updateUserDetails,
                    reset: this.resetUserDetails, userChecked: true}});
        }
    }

    resetUserDetails = () => {
        console.log('Resetting user details');
        this.setState({userDetails: {user: null, updater: this.updateUserDetails,
                reset: this.resetUserDetails, userChecked: true}});
    }

    render() {
        return (
            <UserContext.Provider value={this.state.userDetails}>
                {this.props.children}
            </UserContext.Provider>
        )
    }
}


export class CustomSnackbarProvider extends React.Component {
    snackbarRef = React.createRef();

    onClickDismiss = key => () => {
        this.snackbarRef.current.closeSnackbar(key);
    }

    render(){
        const isMobile = this.props.isMobile;
        return (
            <SnackbarProvider maxSnack={isMobile ? maxAlertsMobile : maxAlerts} dense={isMobile}
                autoHideDuration={autoHideDurationSeconds * 1000} anchorOrigin={anchorOrigin}
                transitionDuration = {{enter: 0, exit: transitionExitDurationSeconds * 1000}}
                TransitionComponent={Fade} classes={snackbarClasses} ref={this.snackbarRef}
                action={(key) => (
                    <IconButton onClick={this.onClickDismiss(key)}>
                        <CloseIcon/>
                    </IconButton>
                )}>
                {this.props.children}
            </SnackbarProvider>
        )
    }
}


class App extends React.Component {

    render(){
        return (
            <CustomSnackbarProvider isMobile={this.props.isMobile}>
            <Router>
              <ScrollToTop>
                <SetUserContext>
                <Analytics/>
                <Announcement/>
                <AppAppBar showName/>
                <div>
                    <AppRoutes/>
                </div>
                <AppFooter/>
                </SetUserContext>
              </ScrollToTop>
            </Router>
            </CustomSnackbarProvider>
        )
    }
}

export default withRoot(App);
