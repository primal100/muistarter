import withRoot from './modules/withRoot';
// --- Post bootstrap -----
import React from 'react';
import { makeStyles } from '@material-ui/core/styles'
import { CustomSnackbarProvider} from "./snackbars";
import Announcement from "./modules/components/Announcement";
import AppAppBar from './modules/views/AppAppBar';
import ScrollToTop from 'react-router-scroll-top'
import AppRoutes from "./routes";
import VisibleApp from "./modules/VisibleApp";
import { SetUserContext } from "./modules/contexts"
import {Analytics} from "./modules/analytics";


const useStyles = makeStyles({
    App: {
        display: "flex",
        flexDirection: "column",
        minHeight: "99vh"
    },
    AppContent: {
        flex: "1 0 auto",
        width: "100%"
    }
});


function App (props) {
    const classes = useStyles();
    return (
        <CustomSnackbarProvider isMobile={props.isMobile}>
          <ScrollToTop>
            <SetUserContext>
            <Analytics/>
            <Announcement/>
            <VisibleApp>
                <AppAppBar showUserDetails title="OnePirate"/>
                <AppRoutes/>
            </VisibleApp>
            </SetUserContext>
          </ScrollToTop>
        </CustomSnackbarProvider>
    )
}

export default withRoot(App);
