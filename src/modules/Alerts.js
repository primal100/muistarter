// --- Post bootstrap -----
import React from 'react';
import Alert from "@material-ui/lab/Alert";
import Snackbar from '@material-ui/core/Snackbar';
import { withRouter } from "react-router-dom";
import compose from "recompose/compose";
import { makeStyles } from '@material-ui/core/styles';
import {withStyles} from "@material-ui/core/styles";
import withRoot from "./withRoot";
import { AlertContext } from "./contexts"


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));


const autoHideDurationSeconds = 5;
const transitionExitDurationSeconds = 3;


class SnackbarAlert extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true
        }
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({open: false});
    }

    render() {
        const {message, severity, ...snackbarProps} = this.props;
        const anchorOrigin = {horizontal: 'center', vertical: 'top'}
        const transitionDuration = {enter: 0, exit: transitionExitDurationSeconds * 1000}
        return (
            <Snackbar anchorOrigin={anchorOrigin} open={this.state.open} onClose={this.handleClose}
                      transitionDuration={transitionDuration} autoHideDuration={autoHideDurationSeconds * 1000}
                      {...snackbarProps}>
            <Alert onClose={this.handleClose} severity={severity}>{message}</Alert>
            </Snackbar>
        )
    }
}


console.log('AlertContext', AlertContext)


class Alerts extends React.Component {
    lastID = 0

    state = {
        id: 0,
        text: null,
        severity: 'success',
        alertContent: null
    }

    setAlertContent = (content) =>{
        this.setState({alertContent: content})
    }

    addToAlertText = (text, severity) =>{
        this.lastID += 1;
        if (this.state.text && text) {
            this.setState({id: this.lastID, text: `${this.state.text}\n${text}`,
                severity: severity || this.state.severity})
        }else{
            this.addAlert(text, severity)
        }
    }

    addAlert = (message, severity) => {
        if (message) {
            this.lastID += 1;
            this.setState({id: this.lastID, text: message, severity: severity})
        }
    }

    render() {
        console.log('Rendering Alerts', this.state.alert);
        const { classes } = this.props;
        const alertContextValue = {
            addAlert: this.addAlert,
            addToAlertText: this.addToAlertText,
            setAlertContent: this.setAlertContent,
        }
        return (
            <React.Fragment>
                {this.state.text && <div key={this.state.id} className={classes.root + ` ${this.state.severity}-message`}>
                    <SnackbarAlert severity={this.state.severity} message={this.state.text}/>
                </div>}
                {this.state.alertContent}
                <AlertContext.Provider value={alertContextValue}>
                    {this.props.children}
                </AlertContext.Provider>
            </React.Fragment>
        )
    }
}


export default compose(
    withStyles(useStyles),
    withRoot
)(Alerts);
