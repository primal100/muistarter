import withRoot from './modules/withRoot';
// --- Post bootstrap -----
import React from 'react';
import { CustomSnackbarProvider} from "./snackbars";
import Announcement from "./modules/components/Announcement";
import AppFooter from './modules/views/AppFooter';
import AppAppBar from './modules/views/AppAppBar';
import {BrowserRouter as Router } from "react-router-dom";
import ScrollToTop from 'react-router-scroll-top'
import { AppRoutes} from "./routes";
import { SetUserContext } from "./modules/contexts"
import {Analytics} from "./modules/analytics";


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
