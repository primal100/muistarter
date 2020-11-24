import React from 'react';
import { makeStyles } from '@material-ui/core/styles'
import AppFooter from './views/AppFooter';


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


export default function VisibleApp (props) {
    const classes = useStyles();
    const {children, footerProps} = props;
    return (
            <div className={classes.App}>
                <div className={classes.AppContent}>
                    {children}
                </div>
                <AppFooter {...footerProps}/>
            </div>
    )
}
