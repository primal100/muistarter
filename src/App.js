import withRoot from './modules/withRoot';
// --- Post bootstrap -----
import React from 'react';
import AppFooter from './modules/views/AppFooter';
import AppAppBar from './modules/views/AppAppBar';
import {BrowserRouter as Router, Route, Redirect} from "react-router-dom";
import ScrollToTop from 'react-router-scroll-top'
import Home from "./modules/components/Home";
import SignIn from "./modules/components/SignIn";
import SignUp from "./modules/components/SignUp";
import SendResetPasswordURL from "./modules/components/SendResetPasswordURL";
import ResetPassword from "./modules/components/ResetPassword";
import { API } from './modules/api';
import mockBackend from "./modules/backend"


export const UserContext = React.createContext({user: {}});


export class ProtectedRoute extends React.Component {
  render() {
    const { component: Component, authenticated, ...props } = this.props

    return (
      <Route
        {...props}
        render={props => (
          this.props.authenticated ?
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
    this.accessToken = localStorage.getItem('access')
    this.authenticated = Boolean(this.accessToken)
    this.userDetails = {};
    if (this.accessToken){
       API.defaults.headers.common['Authorization'] = 'Bearer' + this.accessToken;
    }
  }

    async componentDidMount (){
    if (this.accessToken) {
      //this.userDetails =  await getUserProfile();
    }
  }

  render() {
    return (
        <UserContext.Provider value={this.userDetails}>
        <Router>
          <ScrollToTop>
            <AppAppBar/>
            <div>
              <Route exact path="/" component={Home}/>
              <Route path="/sign-in" component={SignIn}/>
              <Route path="/sign-up" component={SignUp}/>
              <Route path="/send-reset-password-url" component={SendResetPasswordURL}/>
              <Route path="/reset-password" component={ResetPassword}/>
            </div>
            <AppFooter/>
          </ScrollToTop>
        </Router>
        </UserContext.Provider>
    );
  }
}


mockBackend();
export default withRoot(App);