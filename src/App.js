import withRoot from './modules/withRoot';
// --- Post bootstrap -----
import React from 'react';
import AppFooter from './modules/views/AppFooter';
import AppAppBar from './modules/views/AppAppBar';
import {BrowserRouter as Router, Route} from "react-router-dom";
import ScrollToTop from 'react-router-scroll-top'
import Home from "./modules/components/Home";
import SignIn from "./modules/components/SignIn";
import SignUp from "./modules/components/SignUp";
import ForgotPassword from "./modules/components/ForgotPassword";
import mockBackend from "./modules/backend"


function App() {
  return (
   <Router>
    <ScrollToTop>
    <AppAppBar />
    <div>
    <Route exact path="/" component={Home} />
    <Route path="/sign-in" component={SignIn} />
    <Route path="/sign-up" component={SignUp} />
    <Route path="/forgot-password" component={ForgotPassword} />
    </div>
    <AppFooter />
    </ScrollToTop>
  </Router>
  );
}


mockBackend();
export default withRoot(App);