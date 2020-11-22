import withRoot from './modules/withRoot';
// --- Post bootstrap -----
import React from 'react';
import { CustomSnackbarProvider} from "./snackbars";
import Announcement from "./modules/components/Announcement";
import AppFooter from './modules/views/AppFooter';
import AppAppBar from './modules/views/AppAppBar';
import ScrollToTop from 'react-router-scroll-top'
import AppRoutes from "./routes";
import { SetUserContext } from "./modules/contexts"
import {Analytics} from "./modules/analytics";


class App extends React.Component {

    render(){
        return (
            <CustomSnackbarProvider isMobile={this.props.isMobile}>
              <ScrollToTop>
                <SetUserContext>
                <Analytics/>
                <Announcement/>
                <div className="Site">
                    <div className="Site-content">
                        <AppAppBar showUserDetails title="OnePirate"/>
                        <AppRoutes/>
                    </div>
                    <AppFooter/>
                </div>
                </SetUserContext>
              </ScrollToTop>
            </CustomSnackbarProvider>
        )
    }
}

export default withRoot(App);
