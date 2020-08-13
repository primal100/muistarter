// --- Post bootstrap -----
import React from 'react';
import Alert from "@material-ui/lab/Alert";
import Snackbar from '@material-ui/core/Snackbar';
import { withRouter } from "react-router-dom";
import compose from "recompose/compose";
import { makeStyles } from '@material-ui/core/styles';
import {withStyles} from "@material-ui/core/styles";
import withRoot from "./withRoot";


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));


const autoHideDurationSeconds = 10;
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
            <Snackbar anchorOrigin={anchorOrigin} open={this.state.open} onClose={this.handleClose} transitionDuration={transitionDuration} {...snackbarProps}>
            <Alert onClose={this.handleClose} severity={severity}>{message}</Alert>
            </Snackbar>
        )
    }
}


class Alerts extends React.Component {
    state = {
        successMessages: null,
        infoMessages: null,
        errorMessages: null
    }

    setMessagesFromLocationState(){
        console.log('Running setMessagesFromLocationState')
        if (this.props.location.state && (this.props.location.state.successMessages || this.props.location.state.errorMessages)){
            console.log('Getting messages state')
            const successMessages = this.props.location.state.successMessages;
            const infoMessages = this.props.location.state.infoMessages;
            const errorMessages = this.props.location.state.errorMessages;
            let newState = {...this.props.location.state}
            delete newState.successMessages;
            delete newState.infoMessages;
            delete newState.errorMessages;
            console.log('Setting state', successMessages, infoMessages, errorMessages)
            this.setState({successMessages: successMessages, infoMessages: infoMessages, errorMessages: errorMessages})
            console.log('Replacing history')
            this.props.history.replace({
                pathname: this.props.location.pathname,
                state: newState
            });
            console.log('History replaced')
        }
    }

    render() {
        console.log('Rendering Alerts')
        this.setMessagesFromLocationState();
        const { classes } = this.props;
        if (this.props.location.state) {
            return (
                <React.Fragment>
                    {this.state.successMessages && this.state.successMessages.map((value, index) => {
                         return (
                             <div key={index} className={classes.root + " success-message"}>
                                <SnackbarAlert severity="success" message={value} autoHideDuration={autoHideDurationSeconds * 1000}/>
                            </div>
                        )
                    })}
                    {this.state.infoMessages && this.state.infoMessages.map((value, index) => {
                         return (
                             <div key={index} className={classes.root + " info-message"}>
                                <SnackbarAlert severity="info" message={value} autoHideDuration={autoHideDurationSeconds * 1000}/>
                            </div>
                        )
                    })}
                   {this.state.errorMessages && this.state.errorMessages.map((value, index) => {
                       return (
                           <div key={index} className={classes.root + " error-message"}>
                               <SnackbarAlert severity="error" message={value} autoHideDuration={autoHideDurationSeconds * 1000}/>
                           </div>
                       )
                   })}
                </React.Fragment>
            )
        }else {
            return (<div/>)
        }
    }
}


export default compose(
    withStyles(useStyles),
    withRoot,
    withRouter
)(Alerts);
